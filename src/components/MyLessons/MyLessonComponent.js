import React, { useState } from 'react';
import styles from './mylessoncomponent.module.css';
import moment from 'moment';
import BASE_URL from '../../config';
import axios from 'axios';

function MyLessonComponent({ element,updatedLesson,setUpdatedLesson,lesson,itemsPerPage,firstNewElementRef,index}) {


  const [backendError,setBackendError] = useState(null)
  const todayDate = new Date()
  const unixTimestampMilliseconds = Date.parse(todayDate);

  const cancelLessonFunction = async (id, billedPrice) => {

     try {
      const url = `${BASE_URL}/cancellesson`;
      const data = {
        idLesson: id,
        billedPrice: billedPrice,
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
  
      const response = await axios.put(url, data, config);
      if (response.status === 201) {   setUpdatedLesson(!updatedLesson)}        

    } catch (err) {
      if (err.message === 'Network Error') {setBackendError(err.message) }
      setUpdatedLesson(!updatedLesson)

    }
  };
  

  return (
    <div className={
       element.timeSlot.some(date => parseInt(date) < parseInt(unixTimestampMilliseconds)) ? 
       `${styles.card} ${styles.past}`
       :
      `${styles.card} ${styles.show}`} 
    
    
    ref={index === itemsPerPage-18 ? firstNewElementRef : null}>

      <div className={styles.leftBox}>
          <div className={styles.profileImgDiv} >
             <img src={element.teacherProfile} alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
          <div className={styles.rightBoxTop}>      
        <div className={styles.rightBoxName} >{element.teacherFirstName} {element.teacherLastName}</div>
        <div className={styles.rightBoxLanguage} >from  {element.teacherCountry}</div>
        </div>  
  
        <div className={styles.rightBoxBottom}>        
            <div className={styles.rightBoxDate}>
          
            {lesson.timeSlot.map((date, index) => (
                <div key={index}>
                  <span className={styles.timeslot}>
                      <div>
                    {moment(parseInt(date)).format('D.MMMM')} 
                    </div>
                    <div>
                    <span className={styles.timesfreeSpace}>{moment(parseInt(date)).format('HH:mm')}  {moment(parseInt(date)).add(1, 'hour').format('HH:mm')} </span>
                    </div>
                  </span>
                </div>
              ))}

           
         
              
              </div>
            <div className={styles.rightBoxLesson}>
              
  
        <div>
          
          {element.isReserved && !element.isConfirmed && (
            <p className={styles.reservedLesson}>Reserved by Student</p>
          )}

          {element.isCompleted && <p className={styles.completedLesson}>Completed lesson</p>}

          {element.isConfirmed && !element.isCompleted && !element.completedProblem && (
            <p className={styles.confirmedLesson}>Confirmed by teacher</p>
          )}

          {element.isConfirmed && element.completedProblem && (
            <>
              <p>PROBLEM WITH LESSON</p>
              <p>in progress....</p>
            </>
          )}
        </div>

              </div>
        </div>

        {element.timeSlot.map((date, index) => {
            if (parseInt(date) > parseInt(unixTimestampMilliseconds)) {
              return (
                <div className={styles.buttons} key={index}>
                  <button className={styles.CancelBtn} onClick={()=>cancelLessonFunction(element._id,element.billedPrice)}>Cancel Lesson</button>
             {/*      <button className={styles.RebookBtn}>Rebook Lesson</button> */}
                </div>
              );
            }
          })}
      <div className={styles.error}>{backendError ? backendError : null}</div>

    </div>
    
    </div>

  );
}

export default MyLessonComponent;