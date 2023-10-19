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

const [isLoadingLogin,setIsLoadingLogin] = useState(true)
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
        // Set isLoading to false once the user data is fetched or failed to fetch
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

  const [myTeachers, setMyTeachers] = useState(null)

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

      console.log('useEffect runs')

     
    } catch (err) {
           console.log(err)
      }
    }
    fetchTeachers()
  }
  },[userDataFetched])

  

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
                                  userDataFetched,setUserDataFetched,
                                  //teacherzone
                                  myFinishedLessonsNumber,setMyFinishedLessonsNumber,
                                  myUpcomingLessonsNumber,setMyUpcomingLessonsNumber,
                                  myStudentsNumber,setMyStudentsNumber,
                                  isLoading,setIsLoading,isLoading1,
                                  fetchedTotalEarning,setFetchedTotalEarnig,
                                  confirmNotification,confirmCancelLessonNotification,
                                  teachersAreLoading,homelanguages,notificationIsLoading,
                                  myTeachers
                                                                                        
                                  }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
