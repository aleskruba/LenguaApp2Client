import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../config';

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
  const [confirmRejectState,setConfirmRejectState] = useState(false)
  const [actionNotice,setActionNotice] = useState(false)
  const [readConfirmation,setReadConfirmation] = useState([])
  const [notificationReaded,setNotificationReaded] = useState(false)


  //find teacher
  const [teachersArray, setTeachersArray] = useState([]);
  const [lessons, setLessons] = useState(null);


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
        } else {
          setAuth({ user: null, tokens: null });
        }
      } catch (err) {
        console.log('Error fetching user data:', err);
        setAuth({ user: null, tokens: null });
      } finally {
        // Set isLoading to false once the user data is fetched or failed to fetch
      }
    };

    fetchUserData();
  }, [key]);

  useEffect(() => {
  const url = `${BASE_URL}/myUpcomingTeachingLessons`;

  async function fetchData() {
    try {
      const response = await axios.get(url, { withCredentials: true });
      const lessonsData = response.data.myLessonArray;
      setUpcommingLessons(lessonsData)
      setTotalElements(lessonsData.length);

    } catch (error) {
      console.error(error);
    }
  }

  fetchData();
}, [confirmRejectState]);




const confirmNotification = async (id) => {


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
    setNotificationReaded(!notificationReaded)
    if (responseData.message === 'updated successfully') {
      // Remove the clicked item from the state array
      setReadConfirmation(prevState => prevState.filter(note => note._id !== id));
    }
  } catch (error) {
    console.error('Error confirming notification:', error);
    // Handle the error gracefully, possibly by displaying an error message to the user
  }

};



const fetchNotifications = async () => {
  try {
    const geturl = `${BASE_URL}/studentnotification`;
    const response = await axios.get(geturl, { withCredentials: true });
    const myNotifications = response.data.myNotifications;
    setReadConfirmation(myNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // Handle the error gracefully, possibly by displaying an error message to the user
  }
};

useEffect(()=>{
  fetchNotifications()
},[notificationReaded])



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
                                  confirmNotification,
                                  notificationReaded,setNotificationReaded

                             
                         

                                                                 
                                  }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
