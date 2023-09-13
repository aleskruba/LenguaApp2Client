import React, { useEffect, useRef, useState } from 'react';
import styles from './mylessoncomponent.module.css';
import moment from 'moment';
import { Link } from 'react-router-dom';

function MyLessonComponent({ element,lesson,userTeachers}) {


  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef(null);
  const elementRef = useRef(null);

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

  const selectedTeacher = userTeachers.find(t => t._id === element.idTeacher);


  return (
/*      <Link to={{pathname:`/findteachers/${element.idTeacher}`}}  

    state={{ teacher: selectedTeacher  }} 

> */
    <div className={`${styles.card} ${isIntersecting ? styles.show : ''}`} ref={elementRef}>
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
          
          {lesson.isReserved && !lesson.isConfirmed && (
            <p className={styles.reservedLesson}>Reserved by Student</p>
          )}

          {lesson.isCompleted && <p className={styles.completedLesson}>Completed lesson</p>}

          {lesson.isConfirmed && !lesson.isCompleted && !lesson.completedProblem && (
            <p className={styles.confirmedLesson}>Confirmed by teacher</p>
          )}

          {lesson.isConfirmed && lesson.completedProblem && (
            <>
              <p>PROBLEM WITH LESSON</p>
              <p>in progress....</p>
            </>
          )}
        </div>

              </div>
        </div>
        <div className={styles.buttons}>
            <button className={styles.CancelBtn}>Cancel Lesson</button>
            
             <button className={styles.RebookBtn}>Rebook Lesson</button>
        </div>

    </div>
    
    </div>
/*     </Link> */
  );
}

export default MyLessonComponent;