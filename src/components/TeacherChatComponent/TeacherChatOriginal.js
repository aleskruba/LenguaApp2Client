import React, { useEffect, useState,useRef, useMemo,useContext } from 'react';
import { io } from 'socket.io-client';
import styles from './teacherchat.module.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BASE_URL from "../../config";
import useAuth from '../../hooks/useAuth';
import axios from 'axios'
import moment from 'moment'
import AuthContext from '../../context/AuthProvider';

const socket = io('http://localhost:4000');

const TeacherChat = () => {

  const { user} = useAuth();
  const {myStudents,setMyStudents,setConfirmRejectState,confirmRejectState} = useContext(AuthContext)

  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

 
  const chatContainerRef = useRef(null);

  const [switchSides,setSwitchSides] = useState(false)
  const [rightSide,setRightSide] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');


  const [sentMessage,setSentMessage] = useState(false)


  const [selectedStudent,setSelectedStudent] = useState(null)

  useEffect(()=>{

  
    const fetchTeachers = async () =>  {
    try {
      const url = `${BASE_URL}/getchatstudents`;
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };
  
      const response = await axios.get(url, config);
      const responseData = response.data;
      setMyStudents(responseData.students)  


     
    } catch (err) {
           console.log(err)
      }
    }
    fetchTeachers()
  },[sentMessage,selectedStudent,switchSides])





const filteredItems =  useMemo(()=>{  
    return myStudents.filter(item => {
        return item.senderFirstName.toLowerCase().includes(searchQuery.toLowerCase())
  })
},[myStudents,searchQuery,messages])


  useEffect(() => {
    // Scroll to the bottom of the container
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages,switchSides,rightSide]);

  
  
  const readMessage = async (sender_id) => {
    console.log('teacher read studend ` message')

    const data = {
      student_id:sender_id,
      };
  
    try {
      const url = `${BASE_URL}/teacherreadmessageofstudent`;

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      const response = await axios.put(url, data, config);
      console.log(response)
      if (response.status===200) {setSentMessage(!sentMessage); console.log(response)}
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    const socket = io('http://localhost:4000');
    // Listen for chat messages from the server
    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);

        console.log(data)
        console.log('selectet Student',selectedStudent)
        
      if (!selectedStudent ||  (selectedStudent.sender_id !== data.sender_ID && data.teacher_id === user._id) ) {

      const updatedMyStudent = myStudents.map(element => {
        if (!selectedStudent || selectedStudent?.sender_id !== data.sender_ID  &&  element.sender_id === user._id) {
    
          const updatedChatThreads = [
            ...element.chatThreads,
            {
              sender_ID: data.sender_ID,
              sender: data.sender,
              message: data.message,
              createdAt: new Date(),
              isRead: false,
            },
          ];
  
          // Create a new element with the updated chatThreads array
          return { ...element, chatThreads: updatedChatThreads };
        }
        return element;
      });
  
      console.log('not selected',updatedMyStudent)

       setMyStudents(updatedMyStudent); 




  
      const newChatThread = {
        sender_ID:data.sender_ID,
        sender: data.sender,
        message: data.message,
        createdAt: new Date(),
        isRead: false,
      };


      if (selectedStudent && selectedStudent?.sender_id === data.sender_ID){
      setSelectedStudent({...selectedStudent,chatThreads: [...selectedStudent.chatThreads, newChatThread]});

      const updatedMyStudent = myStudents.map(element => {
        if (element.sender_id === data.sender_ID && element.receiver_id === user._id) {
          console.log(element)
          
          const updatedChatThreads = [
            ...element.chatThreads,
            {
              sender_ID: data.sender_ID,
              sender: data.sender,
              message: data.message,
              createdAt: new Date(),
              isRead: true,
            },
          ];
  
          // Create a new element with the updated chatThreads array
          return { ...element, chatThreads: updatedChatThreads };
        }
        return element;
      });
  
    
        setMyStudents(updatedMyStudent); 
       
       setTimeout(() => {
        readMessage(selectedStudent.sender_id)
        console.log('read message run')
       }, 2000); 

    }

  }

    });

    // Listen for typing events from the server
    socket.on('typing', (typing_user) => {
      if ( !(typing_user.typing_user_id === user._id) && typing_user.receiver_id === user._id )  {
        setIsTyping(true);
        setTypingUser(typing_user.typing_user_name);
      }
    });

    // Listen for stop typing events from the server
    socket.on('stop typing', (typing_user) => {
      if ((typing_user.typing_user_id !== user._id) && typing_user.receiver_id === user._id ) {
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
  }, [selectedStudent,myStudents]);





  const handleSendMessage = async () => {
    if (message && message.trim() !== '') {
      // Emit the chat message to the server
      const data = {
        student_id:selectedStudent.sender_id,
        sender_ID:user._id,
        sender: user.firstName,
        message: message,
      };
  
      socket.emit('chat message', data);
      setMessage('');
  
      // Create a new chat thread object
      const newChatThread = {
        sender_ID:user._id,
        sender: user.firstName,
        message: message,
        createdAt: new Date(),
        isRead: false,
      };
  
      if (selectedStudent) {
      setSelectedStudent({...selectedStudent,chatThreads: [...selectedStudent.chatThreads, newChatThread]});
      }
      try {
        const url = `${BASE_URL}/teachermessage`;
  
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
    
    const typingData = {
      typing_user_name: user.firstName,
      typing_user_id: user._id,
      receiver_id: selectedStudent?.receiver_id,
    };

    socket.emit('typing', typingData);
    setTypingUser(user.firstName);
  };

  const handleStopTyping = () => {
    // Emit stop typing event to the server
    const typingData = {
      typing_user_name: user.firstName,
      typing_user_id: user._id,
      receiver_id: selectedStudent?.receiver_id,
    };

    socket.emit('stop typing', typingData);
    setTypingUser('');
  };




console.log('her I am as a teacher')

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

          {filteredItems.map((student, index) => (
            <div className={ student.firstMessage.isRead === false   || student.chatThreads.some(obj=> (obj.isRead===false && obj.sender_ID !== user._id && obj.sender_ID === student.sender_id ) )  ? styles.noReadMessage :  styles.mainChatBoxLeftSideChatAreaStudentMain} 
                           onClick={()=>{setSwitchSides(false); 
                                         setRightSide(true);
                                         setSelectedStudent(student);
                                     if (student.firstMessage.isRead === false || student.chatThreads && student.chatThreads.some(obj=> obj.isRead===false ))   
                                          { 
                                            readMessage(student.sender_id)}
                                        }}  
                                         
                                         key={index}>
             
                <div className={styles.mainChatBoxLeftSideBottomBoxImg}>
                <div className={styles.mainChatBoxLeftSideBottomBoxImgDIV}>
                  <img src={student.senderImgProfile} alt="" className={styles.mainChatBoxLeftSideBottomBoxImgTag} />
                </div>
              </div>
              <div className={styles.mainChatBoxLeftSideChatAreaStudent}>
              <p className={styles.mainChatBoxLeftSideBottomBoxName}>
                {student.senderFirstName}
                </p>
         
             </div>
           
            </div>
            ))}

     

      

          </div>
        </div>


        <div className={rightSide ?  styles.mainChatBoxRightSideFlex : styles.mainChatBoxRightSideHidden}>
          <div className={styles.mainChatBoxRightSideSwitch}>
         
          <div className={styles.switchIcon} onClick={()=>{setSwitchSides(true) ; setRightSide(false); setSelectedStudent(null) }}> <ArrowBackIcon/></div>
          <div className={styles.calendarIcon}><CalendarTodayIcon/></div>
            
          </div>
          
          <div className={styles.mainChatBoxRightSideChatArea} ref={chatContainerRef} >
            <div className={styles.mainChatBoxRightSide}>
       
           { selectedStudent ? 
                    selectedStudent.receiverFirstName === user.firstName && (
                  <div className={styles.mainChatBoxRightSideChatAreaStudentMain} >
                    <div className={styles.mainChatBoxRightSideBottomBoxImg}>
                      <img src={selectedStudent?.senderImgProfile} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
                    </div>
                    <div className={styles.mainChatBoxRightSideChatAreaStudent}>
                      <p className={styles.mainChatBoxRightSideBottomBoxDate}>{moment(selectedStudent?.firstMessage.createdAt).format('dddd, MMMM HH:mm')}</p>
                      
                      <div className={styles.firstMessageQuestionary}>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                       language : {selectedStudent?.language}
                      </p>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                        level : {selectedStudent?.level}
                      </p>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                         {selectedStudent?.purpose}
                      </p>
                      </div>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                        {selectedStudent?.senderFirstName} wrote: {selectedStudent?.firstMessage.message}
                      </p>
                      

                    </div>
                  </div>
                ) 
                :
                null
           }
              




              {selectedStudent?.chatThreads.map((msg, index) => (
        
                msg.sender !== user.firstName?  (
                  <div className={styles.mainChatBoxRightSideChatAreaStudentMain} key={index}>
                     <div className={styles.mainChatBoxRightSideBottomBoxImg}>
                      <img src={selectedStudent?.senderImgProfile} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
                    </div>
                    <div className={styles.mainChatBoxRightSideChatAreaStudent}>
                      <p className={styles.mainChatBoxRightSideBottomBoxDate}>{moment(msg.createdAt).format('dddd, MMMM HH:mm')}</p>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                        {msg.sender} student wrote: {msg.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mainChatBoxRightSideChatAreaTeacherMain} key={index}>
                    <div className={styles.mainChatBoxRightSideBottomBoxImg}>
                      <img src={selectedStudent?.receiverImgProfile} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
                    </div>
                    <div className={styles.mainChatBoxRightSideChatAreaTeacher}>
                      <p className={styles.mainChatBoxRightSideBottomBoxDate}>{moment(msg.createdAt).format('dddd, MMMM HH:mm')}</p>
                      <p className={styles.mainChatBoxRightSideChatAreaTeacherPtag}>
                        {msg.sender} teacher wrote: {msg.message}
                      </p>
                    </div>
                  </div>
                )
              ))}


              
              {isTyping && typingUser === selectedStudent?.senderFirstName && (
                <div className={styles.typing}>
                  <h5>{typingUser} is typing...</h5>
                </div>
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
              disabled={selectedStudent? false : true  }
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              onKeyUp={handleStopTyping}
              placeholder={selectedStudent? 'Write some message ....' : null  }
            ></textarea>
               {selectedStudent && 
            <button onClick={handleSendMessage} className={styles.sendChat}>
              Send
            </button>}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
};

export default TeacherChat;