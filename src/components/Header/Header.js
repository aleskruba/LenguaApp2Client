import React,{useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
import { useLocation } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';

function Header() {

  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setCheckboxChecked(false); // Uncheck the checkbox on route change
  }, [location]);

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
          </li>
          <li className={styles.testLi}>
            <Link to="/test">Test</Link>
          </li>
          <li className={styles.teacherzone}>
            <Link to="/teacherzone">Teacher Zone</Link>
            <Link to='/teachermessages'>
            <div className={styles.chatIcon}>
              <ChatIcon />
            </div>
            <div className={styles.chatIconNumber}>
                  2
            </div>
            </Link>
          </li>
 {/*          <li>
            <Link to="/secretpage">Secret Page</Link>
          </li> */}
        </ul>

        {/* right side */}
        <ul className={styles.rightUl}>
     {/*      <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li> */}

          <li className={styles.profileImgDiv} >

        
          <input type='checkbox' 
                 id={styles.checkbox} 
                 className={styles.checkbox}
                 checked={checkboxChecked}
                 onChange={handleCheckboxChange}
                 
                 />
     
     
        <label  htmlFor={styles.checkbox}>
          <img src="/man.jpg" alt="" className={styles.profileImg}/>
     
          <div className={styles.UserMessagesLi}>
            <Link to='/studentmessages'>
                 <div className={styles.chatUserIcon}>
                    <ChatIcon />
                    <div className={styles.chatUserIconNumber}>
                        2
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
      </nav>
    </div>
  );
}

export default Header;
