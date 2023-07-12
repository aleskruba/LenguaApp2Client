import React, { useEffect, useRef, useState } from 'react';
import styles from './myteachingcomponent.module.css';

function MyTeachingLessonComponent({ element}) {
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
             <img src="/man.jpg" alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
          <div className={styles.rightBoxTop}>      
        <div className={styles.rightBoxName} >{element.firstName}</div>
        <div className={styles.rightBoxLanguage} >{element.language}</div>
        </div>  
        <div className={styles.rightBoxType}>{element.teacherType}</div>
        <div className={styles.rightBoxBottom}>        
            <div className={styles.rightBoxDate}>28.6.2023</div>
            <div className={styles.rightBoxLesson}>completed</div>
        </div>
    </div>
    </div>
  );
}

export default MyTeachingLessonComponent;