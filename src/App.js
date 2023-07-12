import React from 'react';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Profile from './pages/Profile/Profile';
import FindTeachers from './pages/FindTeachers/FindTeachers';
import {Routes,Route} from "react-router-dom";
import Layout from './components/Layout/Layout';
import NotFound404 from './pages/NotFound404/NotFound404';
import Test from './pages/Test/Test';
import SecretPage from './pages/SecretPage/SecretPage';
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
import SchedulePage from './pages/Schedule/SchedulePage';
import ScheduleStudent from './pages/ScheduleStudent/ScheduleStudent';
import FirstMessageComponent from './components/FirstMessage.js/FirstMessageComponent';

export default  function App() {
  return (
    <Routes>
    <Route path='/signup' element={<SignUp />} />
    <Route path='/login' element={<Login />} />
    <Route path='/forgottenpassword' element={<ForgottenPassword />} />

    
    <Route path='/' element={<Layout />}>    
    <Route index element={<Home />}/> 
    <Route path='/test' element={<Test />} />
    <Route path='/buycredit' element={<BuyCredit/>} />
    <Route path='/completion' element={<Completion/>} />
    <Route path='/teacherzone' element={<TeacherZone/>} />
    <Route path='/studentmessages' element={<StudentMessages/>} />
    <Route path='/teachermessages' element={<TeacherMessages/>} />
    
      <Route path='/logout' element={<Logout />} />
      <Route path='/profile' element={<Profile />} />
  
      <Route path='/findteachers' element={<FindTeachers />}/>
      <Route path="/findteachers/:teacherid" element={<TeacherProfile />} />

      <Route path='/wallet' element={<Wallet/>} />

      {/* protected route */}
      <Route element={<RequireAuth />}>
        <Route path='/secretpage' element={<SecretPage />} />
      </Route>
      <Route path='/mylessons' element={<MyLessons/>}  />
      <Route path='/myteachinglessons' element={<MyTeachingLessons/>}  />
      <Route path='/myteachers' element={<MyTeachers/>}  />
      <Route path='/mystudents' element={<MyStudents/>}  />
      <Route path='/schedule' element={<SchedulePage/>}  />
      <Route path='/schedulestudent' element={<ScheduleStudent/>}  />
      <Route path='*' element={<NotFound404 />} />
      </Route>

  </Routes>


    );



  }



