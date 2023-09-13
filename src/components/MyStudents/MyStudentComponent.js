import React, { useEffect, useRef, useState } from 'react';
import styles from './mystudentcomponent.module.css';

function MyStudentComponent( {element ,countCompletedLessons }) {
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
        <div className={styles.rightBoxName} >{element.studentFirstName}</div>  
        <div className={styles.rightBoxType}>from {element.studentCountry}</div>
        <div className={styles.rightBoxLessons}>completed lessons {countCompletedLessons}</div>
        </div>
    </div>
  );
}

export default MyStudentComponent;