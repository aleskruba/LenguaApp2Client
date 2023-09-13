import React, { useEffect, useRef, useState } from 'react';
import styles from './myteachingcomponent.module.css';
import moment from 'moment';

function MyTeachingLessonComponent({ element,lesson}) {
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

  return (
    <div className={`${styles.card} ${isIntersecting ? styles.show : ''}`} ref={elementRef}>
      <div className={styles.leftBox}>
          <div className={styles.profileImgDiv} >
             <img src={element.studentProfile} alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
          <div className={styles.rightBoxTop}>      
        <div className={styles.rightBoxName} >{element.studentFirstName}</div>
        </div>  
        <div className={styles.rightBoxType}>from {element.studentCountry}</div>
        <div className={styles.rightBoxBottom}>        
            <div className={styles.rightBoxDate}>     
             {lesson.timeSlot.map((date, index) => (
              <div key={index}>
                {moment(parseInt(date)).format('DD MMMM HH:mm')} -{' '}
                {moment(parseInt(date)).add(1, 'hour').utc().format('HH:mm')} 
              </div>
            ))}</div>
            <div className={styles.rightBoxLesson}>completed</div>
        </div>
    </div>
    </div>
  );
}

export default MyTeachingLessonComponent;