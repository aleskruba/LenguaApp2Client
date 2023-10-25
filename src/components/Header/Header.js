import React, { useEffect, useState, useRef,useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import { useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import useAuth from '../../hooks/useAuth';
import AuthContext from '../../context/AuthProvider';

function Header() {

  const { user} = useAuth();
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const location = useLocation();
  const ulRef = useRef(null);

  const {totalElements,actionNotice,readConfirmation,readCancelLessonConfirmation,confirmNotification,
    confirmCancelLessonNotification,
    totalMessagesFromStudents ,totalMessagesFromTeachers 
  } = useContext(AuthContext)

  
useEffect(() => {
    setCheckboxChecked(false); // Uncheck the checkbox on route change
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ulRef.current && !ulRef.current.contains(event.target)) {
        setCheckboxChecked(false);
      }
    };

    const handleScroll = () => {
      setCheckboxChecked(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked); // Toggle checkbox state
  };



 

 


  return (
    <div className={styles.header}>
      <nav className={styles.navbar}>
        <ul className={styles.leftUl}>
          <li>
          <Link to="/"> <img src={process.env.PUBLIC_URL + '/logo.png'} alt="" className={styles.logoImg}  /></Link>

          </li >
          <li className={styles.findteachersLi}>
            <Link to="/findteachers">Find Teachers</Link>
            <div className={styles.findteachersLiPagination}> <Link to="/findteachersPagination">with pagination</Link></div>
          </li>
          <li className={styles.testLi}>
            <Link to="/test">Test</Link>
          </li>

    {user?.admin &&  <li className={styles.testLi}>
            <Link to="/admin">Admin</Link>
          </li>
}
      {user && user.teacherState ? 
          <li className={styles.teacherzone}>
            <Link to="/teacherzone">Teacher Zone</Link>
            <Link to='/teachermessages'>
            <div className={styles.chatIcon}>
              <ChatIcon />
            </div>
            <div className={styles.chatIconNumber}>
                  {totalMessagesFromStudents}
            </div>
            </Link>
          </li> :null }


       </ul>

        {user ? 

        <ul className={styles.rightUl} ref={ulRef}>
          <li className={styles.profileImgDiv} >
          <input type='checkbox' 
                 id={styles.checkbox} 
                 className={styles.checkbox}
                 checked={checkboxChecked}
                 onChange={handleCheckboxChange}
                 
                 />
     
        <label  htmlFor={styles.checkbox}>
          <img src={user.profile} alt="" className={styles.profileImg}/>
     
          <div className={styles.UserMessagesLi}>
            <Link to='/studentmessages'>
                 <div className={styles.chatUserIcon}>
                    <ChatIcon />
                    <div className={styles.chatUserIconNumber}>
                    {totalMessagesFromTeachers}
                    </div>
                </div>
            </Link>
         
            </div>
        
          </label>
             <ul className={styles.profileImgUl} >
           
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/wallet">Wallet</Link>
              </li>
              <li>
                <Link to="/myteachers">My Teachers</Link>
              </li>
              <li>
                <Link to="/mylessons">My Lessons</Link>
              </li>
              <li className={styles.profileLogout} >
                <Link to="/logout"  >Logout</Link>
              </li>
            </ul>
          </li>
         </ul>

        : 
          <ul>
                 <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul> 
        }

        </nav>

  { user && totalElements > 0  && !actionNotice ? 

      <Link to='/action'>
        <div className={styles.actionRequired}>
             <span className={styles.actionRequiredText}>Action required click here</span>
        </div>
        </Link>  
   : null}

{ user &&  readConfirmation?.map((note, index) => 

(
  <Fragment key={note._id}>
    {!note.isReadConfirmation  ? (
        note.isConfirmed &&  !note.isRejected ?(
        <div
          className={ styles.confirmation}
          style={{ top: `calc(70px + ${index * 70}px)`, left: `30px` }}
          key={index}
          onClick={()=>confirmNotification(note._id) }
        >   
          <span>Lesson accepted by: </span>
          <p className={styles.confirmationPText}>{note.teacherFirstName}</p>
          <p className={styles.confirmationText}>Confirm by clicking here</p>
        </div>
      ) : (
        <div
          className={styles.confirmationReject}
          style={{ top: `calc(70px + ${index * 70}px)`, left: `30px` }}
          key={index}
          onClick={()=>confirmNotification(note._id) }
        >
          <span>Lesson rejected by : </span>
          <p className={styles.confirmationPText}>{note.teacherFirstName}</p>
          <p className={styles.confirmationText}>Confirm by clicking here</p>
        </div>
      )
    )  : null}
  </Fragment>
))}

{readCancelLessonConfirmation?.map((note, index) => (

  <Fragment key={note._id}>
      <div
        className={ styles.confirmationCancelled}
        style={{ top: `calc(70px + ${index * 70}px)`, left: `250px` }}
        key={index}
        onClick={()=>confirmCancelLessonNotification(note._id) }
      >
   
        <span>Lesson cancelled by: </span>
        <p className={styles.confirmationPText}>{note.studentFirstName}</p>
        <p className={styles.confirmationText}>Confirm by clicking here</p>
      </div>

</Fragment>
))}

    </div>
  );
}

export default Header;
