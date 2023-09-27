import React,{useEffect} from 'react';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Profile from './pages/Profile/Profile';
import FindTeachers from './pages/FindTeachers/FindTeachers';
import {Routes,Route, useNavigate } from "react-router-dom";
import Layout from './components/Layout/Layout';
import NotFound404 from './pages/NotFound404/NotFound404';
import Test from './pages/Test/Test';
import Home from './pages/Home/Home';
import { RequireAuth } from './components/RequireAuth/RequireAuth.js';
import Logout from './pages/Logout/Logout';
import TeacherProfile from './pages/Teacher/TeacherProfile';
import ForgottenPassword from './pages/ForgottenPassword/ForgottenPassword';
import Wallet from './pages/Wallet/Wallet';
import MyTeachers from './pages/MyTeachers/MyTeachers';
import MyLessons from './pages/MyLessons/MyLessons';
import BuyCredit from './pages/BuyCredits/BuyCredit';
import Completion from './pages/BuyCredits/Completion';
import TeacherZone from './pages/TecherZone/TeacherZone';
import StudentMessages from './pages/StudentMessages/StudentMessages';
import TeacherMessages from './pages/TeacherMessages/TeacherMessages';
import MyTeachingLessons from './pages/MyTeachingLessons/MyTeachingLessons';
import MyStudents from './pages/MyStudents/MyStudents';
//import SchedulePage from './pages/Schedule/SchedulePage';
import ScheduleStudent from './pages/ScheduleStudent/ScheduleStudent';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import TestPage from './pages/TESTPAGE/TestPage';
import SchedulePageTEST from './pages/Schedule/SchedulePageTEST';
import MyTeachingUpcomingLessons from './pages/MyTeachingUpcomingLessons/MyTeachingUpcomingLessons';
import Action from './pages/Action/Action';
import FindTeachersPagination from './pages/FindTeachers/FindTeacherPagination';
import Withdraw from './pages/Withdraw/Withdraw';

export default  function App() {


  // Inside your main JavaScript file (e.g., index.js)
/* if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js') // Replace with the correct path to your service worker file
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}
 */
  const navigate = useNavigate();

  const checkAuthentication = () => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated'); // Get the session state from sessionStorage

    if (isAuthenticated) {
      return true; // Allow access to the route if the user is authenticated
    } else {
      navigate('/sendotp'); // Redirect to the 'sendotp' page if the session is not valid
      return false;
    }
  };

  // Use useEffect to apply the guard on component mount
  useEffect(() => {
    if (window.location.pathname === '/resetpassword') {
      checkAuthentication(); // Check authentication on initial load if on the '/resetpassword' route
    }
  }, []);

  return (
  <Routes>
    <Route path='/signup' element={<SignUp />} />   
    <Route path='/login' element={<Login />} />  
    <Route path='/forgottenpassword' element={<ForgottenPassword />} /> 
    <Route path='/' element={<Layout />}>  
    <Route index element={<Home />}/> 
    <Route path='/completion' element={<Completion/>} /> 
    <Route path='/resetpassword' element= {<ResetPassword/>} canActivate={checkAuthentication} /> 
    <Route path='/testpage' element={<TestPage/>}  />
    <Route path='/findteachers' element={<FindTeachers />}/>
    <Route path="/findteachers/:idTeacher" element={<TeacherProfile />} />

    
  <Route element={<RequireAuth />}>
  <Route path='/completion' element={<Completion/>} /> 
      <Route path='/test' element={<Test />} />
      <Route path='/buycredit' element={<BuyCredit/>} />
      <Route path='/withdrawmoney' element={<Withdraw/>} />
        <Route path='/teacherzone' element={<TeacherZone/>} />
      <Route path='/studentmessages' element={<StudentMessages/>} />
      <Route path='/teachermessages' element={<TeacherMessages/>} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/wallet' element={<Wallet/>} />
      <Route path='/findteachers' element={<FindTeachers />}/>
      <Route path='/findteachersPagination' element={<FindTeachersPagination />}/>
      
   
      <Route path='/profile' element={<Profile />} />
      <Route path='/mylessons' element={<MyLessons/>}  />
      <Route path='/myteachinglessons' element={<MyTeachingLessons/>}  />
      <Route path='/myteachingupcominglessons' element={<MyTeachingUpcomingLessons/>}  />
      <Route path='/myteachers' element={<MyTeachers/>}  />
      <Route path='/mystudents' element={<MyStudents/>}  />
{/*       <Route path='/schedule' element={<SchedulePage/>}  /> */}
    <Route path='/schedule' element={<SchedulePageTEST/>}  />
        <Route path="/findteachers/:idTeacher/schedulestudent" element={<ScheduleStudent/>}  />

        <Route path='/action' element={<Action/>}  />



      <Route path='*' element={<NotFound404 />} />
    </Route>
  </Route>

  </Routes>


    );



  }



