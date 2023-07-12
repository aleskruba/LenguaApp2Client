import React, { useEffect, useState,useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import styles from './teacherchat.module.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const socket = io('http://localhost:4000');

const TeacherChat = () => {

  const [savedName,setSavedName] = useState('Ales')    
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

 
  const chatContainerRef = useRef(null);

  const [switchSides,setSwitchSides] = useState(false)
  const [rightSide,setRightSide] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');


  const [myTeachers,setMyTeachers] = useState([
    {name:'Emily',
     date:'25.6.2023'},
    {name:'Jan',
     date:'24.6.2023'},
   {name:'Dan',
     date:'23.6.2023'},
  ]) 



const filteredItems =  useMemo(()=>{  
    return myTeachers.filter(item => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    });

    // Listen for typing events from the server
    socket.on('typing', (username) => {
      if (username !== savedName) {
        setIsTyping(true);
        setTypingUser(username);
      }
    });

    // Listen for stop typing events from the server
    socket.on('stop typing', (username) => {
      if (username !== savedName) {
        setIsTyping(false);
        setTypingUser('');
      }
    });

    // Emit a message to the server to join the chat room
    socket.emit('join room', savedName);

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (message && message.trim() !== '') {
      // Emit the chat message to the server
      const data = {
        sender: savedName,
        message: message,
      };
      
      socket.emit('chat message', data);
      setMessage('');
    }
  };
  

  const handleTyping = () => {
    // Emit typing event to the server
    socket.emit('typing', savedName);
    setTypingUser(savedName);
  };

  const handleStopTyping = () => {
    // Emit stop typing event to the server
    socket.emit('stop typing', savedName);
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

          {filteredItems.map((teacher, index) => (
            <div className={styles.mainChatBoxLeftSideChatAreaStudentMain} 
                           onClick={()=>{setSwitchSides(false); setRightSide(true)}}  key={index}>
             
             
              <div className={styles.mainChatBoxLeftSideBottomBoxImg}>
                <div className={styles.mainChatBoxLeftSideBottomBoxImgDIV}>
                  <img src={process.env.PUBLIC_URL + '/woman.jpg'} alt="" className={styles.mainChatBoxLeftSideBottomBoxImgTag} />
                </div>
              </div>
              <div className={styles.mainChatBoxLeftSideChatAreaStudent}>
              <p className={styles.mainChatBoxLeftSideBottomBoxName}>
                {teacher.name}
                </p>
                <p className={styles.mainChatBoxLeftSideChatAreaStudentBoxDate}>   {teacher.date}</p>
             </div>
           
            </div>
            ))}

     

      

          </div>
        </div>


        <div className={rightSide ?  styles.mainChatBoxRightSideFlex : styles.mainChatBoxRightSideHidden}>
          <div className={styles.mainChatBoxRightSideSwitch}>
         
          <div className={styles.switchIcon} onClick={()=>{setSwitchSides(true) ; setRightSide(false)} }> <ArrowBackIcon/></div>
          <div className={styles.calendarIcon}><CalendarTodayIcon/></div>
            
          </div>
          
          <div className={styles.mainChatBoxRightSideChatArea} ref={chatContainerRef} >
            <div className={styles.mainChatBoxRightSide}>
              {messages.map((msg, index) => (
                msg.sender === savedName ? (
                  <div className={styles.mainChatBoxRightSideChatAreaStudentMain} key={index}>
                    <div className={styles.mainChatBoxRightSideBottomBoxImg}>
                      <img src={process.env.PUBLIC_URL + '/man.jpg'} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
                    </div>
                    <div className={styles.mainChatBoxRightSideChatAreaStudent}>
                      <p className={styles.mainChatBoxRightSideBottomBoxDate}>24.6.2023</p>
                      <p className={styles.mainChatBoxRightSideChatAreaStudentPtag}>
                        {msg.sender} wrote: {msg.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mainChatBoxRightSideChatAreaTeacherMain} key={index}>
                    <div className={styles.mainChatBoxRightSideBottomBoxImg}>
                      <img src={process.env.PUBLIC_URL + '/woman.jpg'} alt="" className={styles.mainChatBoxRightSideBottomBoxImgTag} />
                    </div>
                    <div className={styles.mainChatBoxRightSideChatAreaTeacher}>
                      <p className={styles.mainChatBoxRightSideBottomBoxDate}>23.6.2023</p>
                      <p className={styles.mainChatBoxRightSideChatAreaTeacherPtag}>
                        {msg.sender} wrote: {msg.message}
                      </p>
                    </div>
                  </div>
                )
              ))}
              {isTyping && typingUser !== '' && (
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

export default TeacherChat;