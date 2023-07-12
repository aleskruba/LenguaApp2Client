import React from 'react';
import styles from './profileData.module.css';

function ProfileData({setUpdateButton,setPasswordButton}) {
  return (
    <div className={styles.profileDataContainer}>
      <div className={styles.profileDataMenu}>
        <ul>
          <li>Email</li>
          <li>First Name</li>
          <li>Last Name</li>
          <li>Phone</li>
          <li className={styles.updateButtonLI}><div className={styles.updateButton} onClick={()=>{setUpdateButton(true)}}>Update Profile</div></li>
          <li className={styles.updateButtonLI}><div className={styles.passwordButton} onClick={()=>{setPasswordButton(true)}}>Change Password</div></li>
        </ul>
        
      </div>

      <div className={styles.profileDataCurrent}>
        <ul>
          <li>petr@petr.cz</li>
          <li>Petr</li>
          <li>Novak</li>
          <li>+421 700 000 000</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileData;