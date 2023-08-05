import React,{useEffect} from 'react';
import styles from './profileData.module.css';
import useAuth from '../../hooks/useAuth';
import NativeSelectDemo from './TeacherToggle';

function ProfileData({setUpdateButton,setPasswordButton,userData}) {

  const { user } = useAuth();

  const [state, setState] = React.useState(user.teacherState);
  

  
  return (
    <div className={styles.profileDataContainer}>
      <div className={styles.profileDataMenu}>
        <ul>
          <li>Email</li>
          <li>First Name</li>
          <li>Last Name</li>
          <li>Country</li>
          <li>Phone</li>
          <li className={styles.updateButtonLI}><div className={styles.updateButton} onClick={()=>{setUpdateButton(true)}}>Update Profile</div></li>
          <li className={styles.updateButtonLI}><div className={styles.passwordButton} onClick={()=>{setPasswordButton(true)}}>Change Password</div></li>
          <li className={styles.updateButtonLI}><NativeSelectDemo state={state} setState={setState}/></li>
        </ul>
      </div>

      <div className={styles.profileDataCurrent}>
        <ul>
          <li>{userData.email}</li>
          <li>{userData.firstName}</li>
          <li>{userData.lastName}</li>
          <li>{userData.country}</li>
          <li>{userData.phone}</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileData;