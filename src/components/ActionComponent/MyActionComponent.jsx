import React, { useEffect, useRef, useState,useContext } from 'react';
import styles from './myactioncomponent.module.css';
import moment from 'moment';
import BASE_URL from '../../config';
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import { useNavigate  } from 'react-router-dom';

function MyActionComponent({ element, countCompletedLessons, removeFromDisplayedLessons,loading,loadingConfirm,setLoadingConfirm }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);
  const elementRef = useRef(null);
  const  {confirmRejectState,setConfirmRejectState,totalElements,setActionNotice} = useContext(AuthContext)


const navigate = useNavigate ()





  useEffect(() => {
    const options = {
      threshold: 0.9,
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (observerRef.current && elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      setIsIntersecting(entry.isIntersecting);
    });
  };

  const confirmLessonFunction = async (ID) => {
    setLoadingConfirm(true)
    try {
      const url = `${BASE_URL}/confirmlesson`;
      const data = {
        id: ID,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      await axios.put(url, data, config);

      // Remove the confirmed lesson from the displayed lessons
      //removeFromDisplayedLessons(ID);
      removeFromDisplayedLessons(ID)
      setLoadingConfirm(false)
      //setConfirmRejectState(!confirmRejectState)
      if (totalElements <= 1) {
        setActionNotice(true)
        navigate('/')

      }
    } catch (err) {
      console.log(err);
    }
  };

  const rejectLessonFunction = async (ID) => {
    setLoadingConfirm(true)
    try {
      const url = `${BASE_URL}/rejectlesson`;
      const data = {
        id: ID,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };

      await axios.put(url, data, config);

      // Remove the confirmed lesson from the displayed lessons
      //removeFromDisplayedLessons(ID);
      removeFromDisplayedLessons(ID)
      setLoadingConfirm(false)
      //setConfirmRejectState(!confirmRejectState)
      if (totalElements <= 1) {
        setActionNotice(true)
        navigate('/')

      }
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
    {!loadingConfirm  && !loading? 
    <div className={`${styles.card} ${isIntersecting ? styles.show : ''}`} ref={elementRef}>
      <div className={styles.leftBox}>
          <div className={styles.profileImgDiv} >
             <img src={element.studentProfile} alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
        <div className={styles.rightBoxName} >{element.studentFirstName} asks you for a lesson</div>  
        <div className={styles.rightBoxType}>
            {element.timeSlot.map((el, index) => {
              const startTime = moment(parseInt(el)).format('D:MMM HH:mm');
              const endTime = moment(parseInt(el) + 3600000).format('HH:mm'); // Adding 1 hour (3600000 milliseconds)
              
              return (
                <span key={index}>
                  {`${startTime} - ${endTime}`}
                  {index < element.timeSlot.length - 1 ? ' - ' : ''}
                </span>
              );
            })}
          </div>
  
        <div className={styles.rightBoxLessons}>
        <button className={styles.confirmButton} onClick={()=>confirmLessonFunction(element._id)}>Confirm</button>  
        
        
        <button className={styles.rejectLesson} onClick={()=>rejectLessonFunction(element._id)}>Reject</button>
       </div>
       
        </div>
    </div>
    
   : <p>wait a moment.....</p>}

</>
  );
}

export default MyActionComponent;