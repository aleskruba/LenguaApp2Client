import React, { useEffect, useState,useRef, useMemo, useContext } from 'react';
import { io } from 'socket.io-client';
import styles from './chat.module.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios'
import BASE_URL from "../../config";
import useAuth from '../../hooks/useAuth';
import moment from 'moment'
import AuthContext from '../../context/AuthProvider';

const socket = io('http://localhost:4000');

const Chat = () => {


  const { user} = useAuth();
  const {myTeachers,selectedTeacher,setSelectedTeacher,messages, 
    sentMessageStudent,setSentMessageStudent,isTyping, typingUser, setTypingUser,readMessagefromTeacher,
    switchSides,setSwitchSides,sentMessage,fetchedTeacherChat } = useContext(AuthContext)
  
  const [message, setMessage] = useState();

  const chatContainerRef = useRef(null);


  const [rightSide,setRightSide] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');




const filteredItems =  useMemo(()=>{  
    return myTeachers?.filter(item => {
        return item.senderFirstName.toLowerCase().includes(searchQuery.toLowerCase())
  })
},[myTeachers,searchQuery,messages,sentMessage,fetchedTeacherChat])



  useEffect(() => {
    // Scroll to the bottom of the container
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages,switchSides,rightSide]);

  



  const handleSendMessage = async () => {
    if (message && message.trim() !== '') {
      // Emit the chat message to the server
      const data = {
        sender_ID:user._id,
        sender: user.firstName,
        teacher_id:selectedTeacher.receiver_id,
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
        if (response.status === 200) setSentMessageStudent(!sentMessageStudent);
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
      receiver_id: selectedTeacher?.receiver_id,
    };
    
    socket.emit('typing', typingData);
    setTypingUser(user.firstName);
  };

  const handleStopTyping = () => {
    // Emit stop typing event to the server
    const typingData = {
      typing_user_name: user.firstName,
      typing_user_id: user._id,
      receiver_id: selectedTeacher?.receiver_id,
    };

    socket.emit('stop typing', typingData);
    setTypingUser('');
  };




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

          {filteredItems?.map((teacher, index) => (
            <div className={  (teacher.firstMessage.isRead === false && teacher.sender_id !== user._id ) ||  (teacher.chatThreads.some(obj=> obj.isRead===false && obj.sender_ID === teacher.receiver_id ))   ? styles.noReadMessage : styles.mainChatBoxLeftSideChatAreaStudentMain} 
                  

            onClick={()=>{setSwitchSides(false); 
                                         setRightSide(true);
                                         setSelectedTeacher(teacher);
                                       if(teacher.firstMessage.isRead === false || teacher.chatThreads.some(obj=> obj.isRead===false ) || teacher.receiver_id === selectedTeacher?.receiver_id )  {
                                        readMessagefromTeacher(teacher.receiver_id)}
                                        
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
         
          <div className={styles.switchIcon} onClick={()=>{setSwitchSides(true) ; setRightSide(false) ; setSelectedTeacher(null)} }> <ArrowBackIcon/></div>
          <div className={styles.calendarIcon}>  <CalendarTodayIcon/></div>
            
          </div>
          
          <div className={styles.mainChatBoxRightSideChatArea} ref={chatContainerRef} >
            <div className={styles.mainChatBoxRightSide}>

            { selectedTeacher ? 
                    selectedTeacher.senderFirstName === user.firstName && (
                  <div className={styles.mainChatBoxRightSideChatAreaTeacherMain} >
                    <div className={styles.mainChatBoxRightSideBottomBoxImg}>
                      <img src={selectedTeacher.senderImgProfile} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
                    </div>
                    <div className={styles.mainChatBoxRightSideChatAreaStudent}>
                      <p className={styles.mainChatBoxRightSideBottomBoxDate}>{moment(selectedTeacher.firstMessage.createdAt).format('dddd, MMMM HH:mm')}</p>
                      
                      <div className={styles.firstMessageQuestionary}>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                       language : {selectedTeacher.language}
                      </p>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                        level : {selectedTeacher.level}
                      </p>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                         {selectedTeacher.purpose}
                      </p>
                      </div>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                        {selectedTeacher.senderFirstName} wrote: {selectedTeacher.firstMessage.message}
                      </p>
                      

                    </div>
                  </div>
                ) 
                :
                null
           }

            {selectedTeacher?.chatThreads.map((msg, index) => (
          
                  
            msg.sender !== user.firstName? (
              <div className={styles.mainChatBoxRightSideChatAreaStudentMain} key={index}>
                <div className={styles.mainChatBoxRightSideBottomBoxImg}>
                  <img src={selectedTeacher.receiverImgProfile} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
                </div>
                <div className={styles.mainChatBoxRightSideChatAreaStudent}>
                  <p className={styles.mainChatBoxRightSideBottomBoxDate}>{moment(msg.createdAt).format('dddd, MMMM HH:mm')}</p>
                  <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                     {msg.message}
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
                     {msg.message}
                  </p>
                </div>
              </div>
            )

        
          ))}


           
            </div>
          </div>
        
          <div className={styles.chatInputButton}>
          {isTyping && typingUser === selectedTeacher?.receiverFirstName ? (
                <div className={styles.typing}>
                  <h5>{typingUser} is typing...</h5>
                </div>
              ) : (null
              )}
            <textarea
              className={styles.chatInput}
              name=""
              id=""
              maxLength="500"
              disabled = {selectedTeacher? false : true  }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleTyping}
              onKeyUp={handleStopTyping}
              placeholder={selectedTeacher? 'Write some message ....' : null  }
            ></textarea>
              {selectedTeacher && 
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

export default Chat;