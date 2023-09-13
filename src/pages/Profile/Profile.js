import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from './profile.module.css';
import ProfileLanguagesComponent from '../../components/Profile/ProfileLanguageComponent';
import ProfileUpdate from '../../components/Profile/ProfileUpdate';
import ProfileData from '../../components/Profile/ProfileData';
import ProfileChangePassword from '../../components/Profile/ProfileChangePassword';
import BASE_URL from '../../config';
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import useAuth from '../../hooks/useAuth';
import { Field } from 'formik';
const moment = require('moment');

function Profile() {
  const { user } = useAuth(); // Get user from the useAuth hook
  const { updateProfilePicture } = useContext(AuthContext); // Get updateProfilePicture function from the context

  const [updateButton, setUpdateButton] = useState(false);
  const [passwordButton, setPasswordButton] = useState(false);
  const [file,setFile] = useState()
  const [wrongFile,setWrongFile] = useState(false)

  const [userData, setUserData] = useState({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    country: user.country,
    profile: user.profile,
  });


 
  const  [totalCOnfirmedLessons,setTotalCOnfirmedLessons] = useState(0)

  useEffect(() => {

    const url = `${BASE_URL}/mybookedlessons`

    async function fetchData() {
      try {
        const response = await axios.get(url, { withCredentials: true });
        const lessons = response.data.myCompletedLessonArray;
        setTotalCOnfirmedLessons(lessons.length);
       } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);



  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  useEffect(() => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      profile: user.profile,
    }));
  }, [user]);


  useEffect(() => {

  }, [file]);



     async function onUpload(event) {
      const file = event.target.files[0];

  
    
      if (file) {
        const base64String = await convertToBase64(file);
        setFile(base64String)
        //console.log("Original file size:", base64String.length / 1024, "kB");
    
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    
        if (!allowedTypes.includes(file.type)) {
          setWrongFile(true)
          setTimeout(() => {
            setWrongFile(false)
          }, 1000);

        } else {
          // Resize the image if it is larger than 100kB
          if (base64String.length > 100 * 1024) {
            const image = new Image();
            image.src = base64String;
            await new Promise((resolve) => (image.onload = resolve));
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const width = image.width;
            const height = image.height;
            const maxDimension = Math.max(width, height);
            let newWidth, newHeight;
            if (maxDimension > 300) {
              const scale = 300 / maxDimension;
              newWidth = width * scale;
              newHeight = height * scale;
            } else {
              newWidth = width;
              newHeight = height;
            }
            canvas.width = newWidth;
            canvas.height = newHeight;
            context.drawImage(image, 0, 0, newWidth, newHeight);
            const updatedProfile = { profile: canvas.toDataURL('image/jpeg', 0.8) };
            setFile(updatedProfile)
            await uploadProfilePicture(updatedProfile); // Use 'await' here to ensure it finishes before continuing
          } else {
            const image = new Image();
            image.src = base64String;
            await new Promise((resolve) => (image.onload = resolve));
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const width = image.width;
            const height = image.height;
            const maxDimension = Math.max(width, height);
            let newWidth, newHeight;
            if (maxDimension > 300) {
              const scale = 300 / maxDimension;
              newWidth = width * scale;
              newHeight = height * scale;
            } else {
              newWidth = width;
              newHeight = height;
            }
            canvas.width = newWidth;
            canvas.height = newHeight;
            context.drawImage(image, 0, 0, newWidth, newHeight);
            const updatedProfile = { profile: canvas.toDataURL('image/jpeg', 0.8) };
            setFile(updatedProfile)
            await uploadProfilePicture(updatedProfile); // Use 'await' here to ensure it finishes before continuing
          }
        }
      } else {
       // console.log('No file selected.');
      }
    }
    

  async function uploadProfilePicture(updatedProfile) {
    const _id = user._id;

    const url = `${BASE_URL}/updateprofile`;
    const data = { _id, updatedProfile };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Set the withCredentials option to true
    };

    try {
      const response = await axios.put(url, data, config);
     // console.log('responseData', response.data);

      const updatedUserData = response.data;
      // Update the profile picture URL by calling the updateProfilePicture function
      updateProfilePicture(updatedUserData.profile);
    } catch (error) {
      
    //  console.error('Error updating profile:', error);
    }
  }

  moment(user.memberDate).format('DD:MM:YY');

  return (
    <div className={updateButton || passwordButton ? styles.profileMainContainerFixed : styles.profileMainContainer}>
      <div className={styles.profileImgContainer}>
        <div className={styles.profileImgContainerFlexBox}>
          <div className={styles.profileImgContainerimgDiv}>
          <span className={wrongFile ? styles.profileImgContainerimgDivSpan : styles.profileImgContainerimgDivSpanNone} >only jpg,jpeg,png files allowed</span>
          <label htmlFor="profile">
                    <img src={user.profile ? user.profile : 'avatar.png'}
                         alt="avatar"  
                        className={styles.profileImgContainerImg}/>
                  </label>
       
                  <input onChange={onUpload} type="file" id='profile' name='profile'style={{display:"none"}} />



          </div>
        </div>
      </div>

      <div className={styles.profileClassesData}>
                  <div>  <h2 className={styles.profileClassesDataH2}>Member on Lengua since   {moment(user.memberDate).format('DD.MM YYYY')}</h2></div>
            <div className={styles.profileClassesDataMember}>        
          <div className={styles.profileClassesDataLessons}>  <h2 className={styles.profileClassesDataH1}>{totalCOnfirmedLessons}</h2></div>
          <div className={styles.profileClassesDataText}>  <h2 className={styles.profileClassesDataH2}>Total completed lessons</h2></div>
          </div>
      </div>

      {!updateButton ? (
        <div className={styles.profileLanguagesContainer}>
          <ProfileLanguagesComponent />
        </div>
      ) : (
        ''
      )}

      {!updateButton || !passwordButton ? (
        <div className={styles.profileUserDataContainer}>
          <ProfileData setUpdateButton={setUpdateButton} setPasswordButton={setPasswordButton} userData={userData} />
        </div>
      ) : (
        <>
          <div className={styles.profileUserDataUpdateContainer}>
            <ProfileUpdate setUpdateButton={setUpdateButton} setUserData={setUserData} />
          </div>
          <div className={styles.profileUserDataUpdateContainer}>
            <ProfileChangePassword setPasswordButton={setPasswordButton} />
          </div>
        </>
      )}

      {updateButton && (
        <div className={styles.profileUserDataUpdateContainer}>
          <ProfileUpdate setUpdateButton={setUpdateButton} setUserData={setUserData} userData={userData} />
        </div>
      )}
      {passwordButton && (
        <div className={styles.profileUserDataUpdateContainer}>
          <ProfileChangePassword setPasswordButton={setPasswordButton} />
        </div>
      )}
    </div>
  );
}

export default Profile;