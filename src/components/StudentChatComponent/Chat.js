import React, { useEffect, useState,useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import styles from './chat.module.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import BASE_URL from "../../config";
import useAuth from '../../hooks/useAuth';
import moment from 'moment'

const socket = io('http://localhost:4000');

const Chat = () => {


  const { user} = useAuth();
  
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [myTeachers,setMyTeachers] = useState([])
  const chatContainerRef = useRef(null);

  const [switchSides,setSwitchSides] = useState(false)
  const [rightSide,setRightSide] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');

  const [sentMessage,setSentMessage] = useState(false)

  const [selectedTeacher,setSelectedTeacher] = useState(null)

  useEffect(()=>{

   

    const fetchTeachers = async () =>  {
    try {
      const url = `${BASE_URL}/getchatteachers`;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };


      const response = await axios.get(url, config);
      const responseData = response.data;

      setMyTeachers(responseData.teachers)
     
    } catch (err) {
           console.log(err)
      }
    }
    fetchTeachers()
  },[messages,switchSides])



useEffect(()=>{
 if (selectedTeacher) {
    setSelectedTeacher()
 }
},[])




const filteredItems =  useMemo(()=>{  
    return myTeachers?.filter(item => {
        return item.senderFirstName.toLowerCase().includes(searchQuery.toLowerCase())
  })
},[myTeachers,searchQuery])


  useEffect(() => {
    // Scroll to the bottom of the container
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages,switchSides,rightSide]);

  

  useEffect(() => {
    const socket = io('http://localhost:4000');
    // Listen for chat messages from the server
    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);

      
      const newChatThread = {
        sender: data.sender,
        message: data.message,
        createdAt: new Date(),
        isRead: false,
      };

      console.log(data)
      console.log(selectedTeacher)

      if (selectedTeacher){
      setSelectedTeacher({...selectedTeacher,chatThreads: [...selectedTeacher.chatThreads, newChatThread]});
    }



    });

    // Listen for typing events from the server
    socket.on('typing', (username) => {
      if ((username !== user.firstName) &&  username===selectedTeacher?.receiverFirstName) {
        setIsTyping(true);
        setTypingUser(username);
      }
    });

    // Listen for stop typing events from the server
    socket.on('stop typing', (username) => {
      if (username !== user.firstName) {
        setIsTyping(false);
        setTypingUser('');
      }
    });

    // Emit a message to the server to join the chat room
    socket.emit('join room', user.firstName);

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [selectedTeacher]);



  const handleSendMessage = async () => {
    if (message && message.trim() !== '') {
      // Emit the chat message to the server
      const data = {
        teacher_id:selectedTeacher.receiver_id,
        message: message,
      };
  
      socket.emit('chat message', data);
      setMessage('');
  
      // Create a new chat thread object
      const newChatThread = {
        sender: user.firstName,
        message: message,
        createdAt: new Date(),
        isRead: false,
      };
  
      if (selectedTeacher) {
        setSelectedTeacher({...selectedTeacher,   chatThreads: [...selectedTeacher.chatThreads, newChatThread]});

      }
      try {
        const url = `${BASE_URL}/studentmessage`;
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        };
  
        const response = await axios.put(url, data, config);
        if (response.status === 200) setSentMessage(!sentMessage);
      } catch (err) {
        console.log(err);
      }
    }
  };
  

    

  const handleTyping = () => {
    // Emit typing event to the server
    socket.emit('typing', user.firstName);
    setTypingUser(user.firstName);
  };

  const handleStopTyping = () => {
    // Emit stop typing event to the server
    socket.emit('stop typing', user.firstName);
    setTypingUser('');
  };


  const readMessage = async (receiver_id) => {

    console.log('student read teacher` message' ,  receiver_id, )

    const data = {
      teacher_id:receiver_id,
      };

    try {
      const url = `${BASE_URL}/teacherreadmessage`;

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      const response = await axios.put(url, data, config);
      if (response.status === 200) setSentMessage(!sentMessage);
    } catch (err) {
      console.log(err);
    }
  }



  return (
    <div className={styles.mainDiv}>
         <div className={styles.chatDivMainContainer}>
    <div className={styles.chatDivContainer} >
      <div className={styles.mainChatBox}>

        <div className={switchSides ? styles.mainChatBoxLeftSideVisible : styles.mainChatBoxLeftSide}>
          <div className={styles.mainChatBoxLeftSideTop}>
          <input
              type="text"
              className={styles.mainChatBoxLeftSideTopInput}
              placeholder="Search by name"
              id="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

          </div>

          <div className={styles.mainChatBoxLeftSideBottom}>

          {filteredItems.map((teacher, index) => (
            <div className={teacher.firstMessage.isRead === false || teacher.chatThreads.some(obj=> obj.isRead===false )  ? styles.noReadMessage : styles.mainChatBoxLeftSideChatAreaStudentMain} 
                           onClick={()=>{setSwitchSides(false); 
                                         setRightSide(true);
                                         setSelectedTeacher(teacher);
                                       if(teacher.firstMessage.isRead === false || teacher.chatThreads.some(obj=> obj.isRead===false ) )  {readMessage(teacher.  receiver_id)}
                                        
                                        }
                                         }  key={index}>
             
             
              <div className={styles.mainChatBoxLeftSideBottomBoxImg}>
                <div className={styles.mainChatBoxLeftSideBottomBoxImgDIV}>
                  <img src={teacher.receiverImgProfile} alt="" className={styles.mainChatBoxLeftSideBottomBoxImgTag} />
                </div>
              </div>
              <div className={styles.mainChatBoxLeftSideChatAreaStudent}>
              <p className={styles.mainChatBoxLeftSideBottomBoxName}>
                {teacher.receiverFirstName}
                </p>
              </div>
           
            </div>
            ))}

     

      

          </div>
        </div>


        <div className={rightSide ?  styles.mainChatBoxRightSideFlex : styles.mainChatBoxRightSideHidden}>
          <div className={styles.mainChatBoxRightSideSwitch}>
         
          <div className={styles.switchIcon} onClick={()=>{setSwitchSides(true) ; setRightSide(false)} }> <ArrowBackIcon/></div>
          <div className={styles.calendarIcon}>  <CalendarTodayIcon/></div>
            
          </div>
          
          <div className={styles.mainChatBoxRightSideChatArea} ref={chatContainerRef} >
            <div className={styles.mainChatBoxRightSide}>

            {selectedTeacher?.chatThreads.map((msg, index) => (
        
        msg.sender !== user.firstName? (
          <div className={styles.mainChatBoxRightSideChatAreaStudentMain} key={index}>
             <div className={styles.mainChatBoxRightSideBottomBoxImg}>
              <img src={selectedTeacher.receiverImgProfile} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
            </div>
            <div className={styles.mainChatBoxRightSideChatAreaStudent}>
              <p className={styles.mainChatBoxRightSideBottomBoxDate}>{moment(msg.createdAt).format('dddd, MMMM HH:mm')}</p>
              <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                {msg.sender} wrote: {msg.message}
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.mainChatBoxRightSideChatAreaTeacherMain} key={index}>
            <div className={styles.mainChatBoxRightSideBottomBoxImg}>
              <img src={selectedTeacher.senderImgProfile} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
            </div>
            <div className={styles.mainChatBoxRightSideChatAreaTeacher}>
              <p className={styles.mainChatBoxRightSideBottomBoxDate}>{moment(msg.createdAt).format('dddd, MMMM HH:mm')}</p>
              <p className={styles.mainChatBoxRightSideChatAreaTeacherPtag}>
                {msg.sender} wrote: {msg.message}
              </p>
            </div>
          </div>
        )
      ))}


              {isTyping && typingUser === selectedTeacher?.receiverFirstName ? (
                <div className={styles.typing}>
                  <h5>{typingUser} is typing...</h5>
                </div>
              ) : (null
              )}
            </div>
          </div>
          <div className={styles.chatInputButton}>
            <textarea
              className={styles.chatInput}
              name=""
              id=""
              maxLength="500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              onKeyUp={handleStopTyping}
              placeholder='Write some message ....'
            ></textarea>
            <button onClick={handleSendMessage} className={styles.sendChat}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default Chat;