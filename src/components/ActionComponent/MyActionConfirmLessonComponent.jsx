import React, { useEffect, useRef, useState,useContext } from 'react';
import styles from './myactionconfirmlessoncompoent.module.css';
import moment from 'moment';
import BASE_URL from '../../config';
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

function MyActionConfirmLessonComponent({ element, removeFromDisplayedLessons,loading,loadingConfirm,setLoadingConfirm }) {


  const [isIntersecting, setIsIntersecting] = useState(false);
  const [review,setReview] = useState('')
  const observerRef = useRef(null);
  const elementRef = useRef(null);
  const  {confirmRejectState,setConfirmRejectState,totalElements,setActionNotice} = useContext(AuthContext)

  const navigate = useNavigate()

const handleChangeFunction = (e) =>{
    setReview(e.target.value)
   
}

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

  const confirmCompletedLessonFunction = async (ID) => {
    setLoadingConfirm(true)
    try {
      const url = `${BASE_URL}/confirmCompetedlesson`;
      const data = {
        id: ID,
        review:review,
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
      setConfirmRejectState(!confirmRejectState)
      removeFromDisplayedLessons(ID)
      setLoadingConfirm(false)
        if (totalElements < 1) {
        setActionNotice(true)
        navigate('/')

      }  
    } catch (err) {
      console.log(err);
    }
  };

  const problemLessonFunction = async (ID) => {
    setLoadingConfirm(true)
    try {
      const url = `${BASE_URL}/problemlesson`;
      const data = {
        id: ID,
        review:review
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
      setConfirmRejectState(!confirmRejectState)
      removeFromDisplayedLessons(ID)
      setLoadingConfirm(false)
      if (totalElements <= 1) {
        setActionNotice(true)
        navigate('/')

      } 
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div className={`${styles.card} ${isIntersecting ? styles.show : ''}`} ref={elementRef}>
      <div className={styles.leftBox}>
          <div className={styles.profileImgDiv} >
             <img src={element.teacherProfile} alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
        <div className={styles.rightBoxName} >Confirm completed lesson with <span>{element.teacherFirstName}</span></div>  
           <div className={styles.rightBoxType}> from&nbsp;&nbsp;
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
          <div>
            <textarea className={styles.reviewTextarea} 
                      value={review}
                      onChange={handleChangeFunction}     
                      placeholder={`How was your lesson with ${element.teacherFirstName}?`}
            ></textarea>
          </div>
  {!loadingConfirm  && !loading? <> 
        <div className={styles.rightBoxLessons}>
        <button className={styles.confirmButton} onClick={()=>confirmCompletedLessonFunction(element._id)}>Confirm</button>  
        
        
        <button className={styles.rejectLesson} onClick={()=>problemLessonFunction(element._id)}>Problem</button>
       </div>
       </> : <p>wait a moment.....</p>}
        </div>
    </div>
  );
}

export default MyActionConfirmLessonComponent;