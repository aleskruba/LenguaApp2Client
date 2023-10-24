import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';
import { io } from 'socket.io-client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {



  const [auth, setAuth] = useState({ user: null, tokens: null });
  const [key, setKey] = useState(Date.now()); // Add a key to force re-render
  const [savedSlot,setSavedSlot] = useState([])
  const [actualSlots,setActualdSlots] = useState([])
  const [reservedSlots,setReservedSlots] = useState([])
  const [updatedData,setUpdatedData] = useState(null)
  const [totalElements, setTotalElements] = useState(0); // total of reserved lessons from students , trigger action
  const [upCOmmingLessons,setUpcommingLessons] = useState([])
  const [completedLessons,setCompletedLessons] = useState([])
  const [confirmRejectState,setConfirmRejectState] = useState(false)
  const [actionNotice,setActionNotice] = useState(false)
  const [readConfirmation,setReadConfirmation] = useState([])
  const [notificationRead,setNotificationRead] = useState(false)
  const [readCancelLessonConfirmation,setReadCancelLessonConfirmation] = useState([])

  //teacher zone
  const [myFinishedLessonsNumber,setMyFinishedLessonsNumber] = useState(null)
  const [myStudentsNumber,setMyStudentsNumber] = useState(null)
  const [myUpcomingLessonsNumber,setMyUpcomingLessonsNumber] = useState(null)
  const [isLoading,setIsLoading] = useState(true)
  const [isLoading1,setIsLoading1] = useState(true)
  
  const [fetchedTotalEarning,setFetchedTotalEarnig] = useState(null)
  const [userDataFetched, setUserDataFetched] = useState(false);
  const [lessonsDataFetched, setLessonsDataFetched] = useState(false);

  //find teacher
  const [teachersArray, setTeachersArray] = useState([]);
  const [lessons, setLessons] = useState(null);
  const [teachersAreLoading,setTeachersAreLoading] = useState (true)
  const [homelanguages,setHomeLanguages] = useState([])
  const [notificationIsLoading,setNotificationIsLoading] = useState(true)



  useEffect(() => {


    const fetchData = async () => {
      const url = `${BASE_URL}/findteachers`;

      try {
        const response = await axios.get(url, { withCredentials: true });
        const teacherdata = response.data.teachers;
        setTeachersArray(teacherdata);
        setTeachersAreLoading(false)

        const lessonsData = response.data.lessons;
        setLessons(lessonsData);

       // setLoading(false);
      } catch (error) {
       // setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  

  }, []);


  useEffect(()=>{
    
    const fetchFunction  = async () => {
    try {
      const url = `${BASE_URL}/loadhomedata`;
      const response = await axios.get(url, { withCredentials: true });
      const responseData = response.data;
      setHomeLanguages(responseData)
    }catch (err) {
      console.log('Error fetching user data:', err);
    }
  }
  fetchFunction()
  },[])


  const updateUserContext = (userData, tokens) => {
    setAuth({ user: userData, tokens: tokens });
  };

  const updateProfilePicture = (profilePictureUrl) => {
    setAuth((prevAuth) => ({
      ...prevAuth,
      user: {
        ...prevAuth.user,
        profile: profilePictureUrl,
      },
    }));
    setKey(Date.now()); 
  };


  const updateUserTeacherState = (teacherState) => {
    setAuth((prevAuth) => ({
      ...prevAuth,
      user: {
        ...prevAuth.user,
        teacherState: teacherState,
      },
    }));
    setKey(Date.now()); 
  };

 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const url = `${BASE_URL}/checkuser`;
        const response = await axios.get(url, { withCredentials: true });
        const responseData = response.data;

        if (responseData.user) {
      
          setAuth({
            user: responseData.user,
            tokens: {
              jwt: responseData.accessToken,
              refreshToken: responseData.refreshToken,
            },
          });
          setUserDataFetched(true);
          
        } else {
          setAuth({ user: null, tokens: null });
        }
      } catch (err) {
        console.log('Error fetching user data:', err);
        setAuth({ user: null, tokens: null });
      } finally {
        // Set isLoading to false once the user data is fetchedStudentChat or failed to fetch
      }
    };

    fetchUserData();
  }, [key]);



  useEffect(() => {

    async function fetchData() {
    if (userDataFetched) {

     const url = `${BASE_URL}/teacherZone`

      try {
        const response = await axios.get(url, { withCredentials: true });

        setUpdatedData(response.data.teacherDetails[0])
        setMyFinishedLessonsNumber(response.data.myFinishedLessonsNumber)
        setMyStudentsNumber(response.data.myStudentsNumber)
        setMyUpcomingLessonsNumber(response.data.myUpcomingLessonsNumber)
        setFetchedTotalEarnig(response.data.totalEarning)
        setLessonsDataFetched(true)
        setIsLoading(false)
      } catch (error) {
        console.error(error);
      }
    }

  }     fetchData(); 
  }, [userDataFetched]);



  useEffect(() => {
    if (userDataFetched) {
      const url = `${BASE_URL}/lessonreservationdata`;
  
      async function fetchData() {
    try {
      const response = await axios.get(url, { withCredentials: true });
      const lessonsData = response.data.lessons;
      const completedLessonsData = response.data.completedLessonsToConfirmByStudent;
      setCompletedLessons(completedLessonsData)
      setUpcommingLessons(lessonsData)
      setTotalElements(lessonsData.length+completedLessonsData.length);
    } catch (error) {
      console.error(error);
    }
  }

  fetchData()

}

}, [userDataFetched,confirmRejectState]);


useEffect(() => {

  if (userDataFetched) {
    const geturl = `${BASE_URL}/studentnotification`;

      async function fetchData() {
    try {
   
    const response =  await axios.get(geturl, { withCredentials: true });
    if (response.status === 201) {
    const myNotifications = response.data.myNotifications;

    setReadConfirmation(myNotifications); 
    setNotificationIsLoading(false)}

  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Handle the error gracefully, possibly by displaying an error message to the user

   }
  }
    fetchData()
    }
},[userDataFetched,notificationRead,confirmRejectState])


useEffect(() => {
  if (userDataFetched) {

      
    async function fetchData() {

    try {
      const geturl = `${BASE_URL}/teachernotificationcancellesson`;
      const response =  await axios.get(geturl, { withCredentials: true });
      if (response.status === 201) {
        const myNotifications = response.data.myNotifications;
        setReadCancelLessonConfirmation(myNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Handle the error gracefully, possibly by displaying an error message to the user
    }
  }
  fetchData()
  }
},[userDataFetched,notificationRead,confirmRejectState])



const confirmNotification = async (id) => {
  if (lessonsDataFetched) {

  try {
        const url = `${BASE_URL}/studentnotification`;
        const data = {
          lessonID: id,
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Set the withCredentials option to true
        };

        const response = await axios.put(url, data, config);
        const responseData = response.data;
        setNotificationRead(!notificationRead)
        if (responseData.message === 'updated successfully') {
          // Remove the clicked item from the state array
          setReadConfirmation(prevState => prevState.filter(note => note._id !== id));
        }
      } catch (error) {
        console.error('Error confirming notification:', error);
        // Handle the error gracefully, possibly by displaying an error message to the user
      }
    }
    };


  const confirmCancelLessonNotification = async (id) => {
    if (lessonsDataFetched) {

    try {
      const url = `${BASE_URL}/teachernotificationcancellesson`;
      const data = {
        lessonID: id,
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };
  
      const response = await axios.put(url, data, config);
      const responseData = response.data;
      setNotificationRead(!notificationRead)
      if (responseData.message === 'updated successfully') {
        // Remove the clicked item from the state array
        setReadCancelLessonConfirmation(prevState => prevState.filter(note => note._id !== id));
      }
    } catch (error) {
      console.error('Error confirming notification:', error);
      // Handle the error gracefully, possibly by displaying an error message to the user
    }
  }
  };

  //mesages teacher
  const [myStudents, setMyStudents] = useState(null)
  const [selectedStudent,setSelectedStudent] = useState(null)
  const [messagesTeacher, setMessagesTeacher] = useState([]);
  const [sentMessage,setSentMessage] = useState(false)
  const [isTypingStudent, setIsTypingStudent] = useState(false);
  const [typingUserStudent, setTypingUserStudent] = useState('');
  const [switchSidesTeacher,setSwitchSidesTeacher] = useState(true)
  //const [readMessagefromStudentState,setReadMessagefromStudentState]= useState(false)

  
  //mesages student
  const [myTeachers, setMyTeachers] = useState(null)
  const [selectedTeacher,setSelectedTeacher] = useState(null)
  const [messages, setMessages] = useState([]);
  const [sentMessageStudent,setSentMessageStudent] = useState(false)
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [switchSides,setSwitchSides] = useState(true)
  //const [readMessagefromTeacherState,setReadMessagefromTeacherState]= useState(false)

  // messages counter

  const [totalMessagesFromStudents ,setTotalMessagesFromStudents] = useState(0);
  const [totalMessagesFromTeachers ,setTotalMessagesFromTeachers] = useState(0);

  const [fetchedStudentChat,setFetchedStudentChat] = useState(false)
  const [fetchedTeacherChat,setFetchedTeacherChat] = useState(false)



  const readMessage = async (sender_id) => {    

    const data = {
      student_id:sender_id,
      };
  
    try {
      const url = `${BASE_URL}/teacherreadmessageofstudent`;
    
      myStudents.forEach(student => {
        if (student.sender_id === sender_id && student.firstMessage.isRead === false) {
          setTotalMessagesFromStudents(prev => prev - 1);
        }
      });
       

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      const response = await axios.put(url, data, config);
      if (response.status===200) {
          setSentMessageStudent(!sentMessageStudent)    
                                         
            }
    } catch (err) {
      console.log(err);
    }
  }

  
  

  // mesaages to a teacher 

  useEffect(() => {

    if (userDataFetched) {

    const socket = io('http://localhost:4000');
    // Listen for chat messagesTeacher from the server
    socket.on('chat message', (data) => {

      if (data.teacher_id === auth.user._id) {

         
      setMessagesTeacher((prevMessages) => [...prevMessages, data]);

    
        
      if (!selectedStudent ||  (selectedStudent.sender_id !== data.sender_ID && data.teacher_id === auth.user._id) ) {

        setTotalMessagesFromStudents(prev=>prev+1)

      const updatedMyStudent = myStudents.map(element => {
        if (element.receiver_id === auth.user._id) {

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
  
       setMyStudents(updatedMyStudent); 

    }
  
      const newChatThread = {
        sender_ID:data.sender_ID,
        sender: data.sender,
        message: data.message,
        createdAt: new Date(),
        isRead: false,
      };

      if (selectedStudent && selectedStudent?.sender_id === data.sender_ID){
      setSelectedStudent({...selectedStudent,chatThreads: [...selectedStudent.chatThreads, newChatThread]});
      //setTotalMessagesFromStudents(prev=>prev+1)

      const updatedMyStudent = myStudents.map(element => {
        if (element.sender_id === data.sender_ID && element.receiver_id === auth.user._id) {
 
          
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

       }, 2000); 

    }
  
      }
    
    });


    // Listen for typing events from the server
    socket.on('typing', (typing_user) => {
      if ( !(typing_user.typing_user_id === auth.user._id) && typing_user.receiver_id === auth.user._id )  {
        setIsTypingStudent(true);
        setTypingUserStudent(typing_user.typing_user_name);
      }
    });

    // Listen for stop typing events from the server
    socket.on('stop typing', (typing_user) => {
      if ((typing_user.typing_user_id !== auth.user._id) && typing_user.receiver_id === auth.user._id ) {
        setIsTypingStudent(false);
        setTypingUserStudent('');
      }
    });

    // Emit a message to the server to join the chat room
    socket.emit('join room', auth.user.firstName);

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }
}, [selectedStudent,myStudents,sentMessage]);





const readMessagefromTeacher = async (receiver_id) => {

  const data = {
    teacher_id:receiver_id,
    };

  try {
    const url = `${BASE_URL}/studentreadmessageofteacher`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    const response = await axios.put(url, data, config);

    if (response.status===200) { 
       setTotalMessagesFromTeachers(0)  
      setSentMessage(!sentMessage)


    };
  } catch (err) {
    console.log(err);
  }
}



// mesaages to a student
useEffect(() => {

  if (userDataFetched) {
  const socket = io('http://localhost:4000');



  // Listen for chat messages from the server
  socket.on('chat message', (data) => {


      if (data.student_id === auth.user._id) {
      

    setMessages((prevMessages) => [...prevMessages, data]);

    if (data.student_id === auth.user._id) {
  
      setTotalMessagesFromTeachers(prev=>prev+1)
      
     const updatedMyTeacher = myTeachers.map(element => {
      if (selectedTeacher?.receiver_id !== data.sender_ID  && element.receiver_id === data.sender_ID && element.sender_id === auth.user._id) {

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

       setMyTeachers(updatedMyTeacher); 

     const newChatThread = {
      sender_ID:data.sender_ID,
      sender: data.sender,
      message: data.message,
      createdAt: new Date(),
      isRead: true,
    };

    if (selectedTeacher && selectedTeacher.receiver_id === data.sender_ID ){
      setSelectedTeacher({...selectedTeacher,chatThreads: [...selectedTeacher.chatThreads, newChatThread]});
    //  setTotalMessagesFromTeachers(prev=>prev+1)
      
    const updatedMyTeacher = myTeachers.map(element => {
      if (element.receiver_id === data.sender_ID && element.sender_id === auth.user._id) {
  
  
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

    
      setMyTeachers(updatedMyTeacher); 
         
     setTimeout(() => {
      readMessagefromTeacher(selectedTeacher.receiver_id )
    }, 2000); 
  } 

    }
}

  });

  // Listen for typing events from the server
  socket.on('typing', (typing_user) => {
    if ((typing_user.typing_user_id !== auth.user._id) &&  typing_user.receiver_id === selectedTeacher?.receiver_id) {
      setIsTyping(true);
      setTypingUser(typing_user.typing_user_name);
    }
  });

  // Listen for stop typing events from the server
  socket.on('stop typing', (typing_user) => {
    if (typing_user.typing_user_id !== auth.user._id) {
      setIsTyping(false);
      setTypingUser('');
    }
  });

  // Emit a message to the server to join the chat room
  socket.emit('join room', auth.firstName);

  // Clean up the socket connection when component unmounts
  return () => {
    socket.disconnect();
  };
}
}, [selectedTeacher,myTeachers,sentMessageStudent]);


useEffect(()=>{
  
  if (userDataFetched) {

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
    setFetchedTeacherChat(true)
   
  } catch (err) {
         console.log(err)
    }
  }
  fetchTeachers()
}

},[sentMessageStudent, switchSides,selectedTeacher,userDataFetched,sentMessage])

//readMessagefromStudentState


useEffect(()=>{

  if (userDataFetched ) {



  const fetchStudents = async () =>  {
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
    setFetchedStudentChat(true)
   
  } catch (err) {
         console.log(err)
    }
  }
  fetchStudents()
}
},[sentMessage,selectedStudent,switchSidesTeacher,userDataFetched,sentMessageStudent])
//readMessagefromTeacherState

 useEffect(()=>{

  if (fetchedStudentChat) {

  const arr = new Set(); 

myStudents?.forEach((student) => {
  if (student.receiver_id === auth.user._id) {
    if (student.firstMessage.isRead === true) {
      // Use a Set to store unique objects in the 'arr' array
      student.chatThreads.forEach((obj) => {
 
        if (obj.isRead === false && obj._id !== undefined) {
          arr.add(obj);
        }
      });
    }
    if (student.firstMessage.isRead === false )  { arr.add(student.firstMessage);}
  }
});

const uniqueArr = Array.from(arr);

  //setTotalMessagesFromStudents(arr.length)
  setTotalMessagesFromStudents(uniqueArr.length)
  
  }

},[fetchedStudentChat,sentMessageStudent])


useEffect(()=>{

  if (fetchedTeacherChat) {

  const arr = new Set(); 

myTeachers?.forEach((teacher) => {
  if (teacher.sender_id === auth.user._id) {
    if (teacher.firstMessage.isRead === true) {
      // Use a Set to store unique objects in the 'arr' array
      teacher.chatThreads.forEach((obj) => {
 
        if (obj.isRead === false && obj._id !== undefined) {
          arr.add(obj);
        }
      });
    }
   if (teacher.firstMessage.isRead === false )  { arr.add(teacher.firstMessage);}
   
  }
});

const uniqueArr = Array.from(arr);


  setTotalMessagesFromTeachers(uniqueArr.length)
  
  }

},[fetchedTeacherChat,sentMessage])


  return (
    <AuthContext.Provider value={{ auth, 
                                  setAuth: updateUserContext,
                                  updateProfilePicture,
                                  updateUserTeacherState,
                                  savedSlot,
                                  setSavedSlot,
                                  actualSlots,
                                  setActualdSlots,
                                  reservedSlots,
                                  setReservedSlots,
                                  updatedData,
                                  setUpdatedData,
                                  totalElements, 
                                  setTotalElements,
                                  confirmRejectState,
                                  setConfirmRejectState,
                                  actionNotice,
                                  setActionNotice,
                                  upCOmmingLessons,
                                  teachersArray, setTeachersArray,
                                  lessons, setLessons,
                                  readConfirmation,setReadConfirmation,
                                  notificationRead,setNotificationRead,
                                  readCancelLessonConfirmation,
                                  completedLessons,
                                  setCompletedLessons,
                                  setUpcommingLessons,
                                  setReadCancelLessonConfirmation,
                                  userDataFetched,setUserDataFetched,setIsLoading1,
                                  //teacherzone
                                  myFinishedLessonsNumber,setMyFinishedLessonsNumber,
                                  myUpcomingLessonsNumber,setMyUpcomingLessonsNumber,
                                  myStudentsNumber,setMyStudentsNumber,
                                  isLoading,setIsLoading,isLoading1,
                                  fetchedTotalEarning,setFetchedTotalEarnig,
                                  confirmNotification,confirmCancelLessonNotification,
                                  teachersAreLoading,homelanguages,notificationIsLoading,
                                  myTeachers,setMyTeachers,myStudents, setMyStudents,
                                  selectedStudent,setSelectedStudent,messagesTeacher, setMessagesTeacher,
                                  sentMessage,setSentMessage,isTypingStudent, setIsTypingStudent,typingUserStudent, setTypingUserStudent,
                                  readMessage,selectedTeacher,setSelectedTeacher,messages, setMessages,sentMessageStudent,setSentMessageStudent,
                                  isTyping, setIsTyping,typingUser, setTypingUser,readMessagefromTeacher,
                                  switchSidesTeacher,setSwitchSidesTeacher,switchSides,setSwitchSides,
                                  totalMessagesFromStudents ,setTotalMessagesFromStudents,totalMessagesFromTeachers ,setTotalMessagesFromTeachers,
                                  fetchedStudentChat,fetchedTeacherChat
                                                                                        
                                  }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
