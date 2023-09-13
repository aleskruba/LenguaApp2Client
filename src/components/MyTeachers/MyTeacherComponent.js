import React, { useEffect, useRef, useState,useContext } from 'react';
import styles from './myteachercomponent.module.css';
import AuthContext from '../../context/AuthProvider';
import { Link } from 'react-router-dom';

function MyTeacherComponent({ element ,countCompletedLessons,userTeachers}) {

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
    <Link to={{pathname:`/findteachers/${element.idTeacher}`}} 

          state={{ teacher: selectedTeacher  }} 
    
    >

    <div className={`${styles.card} ${isIntersecting ? styles.show : ''}`} ref={elementRef}    >
      <div className={styles.leftBox}>
          <div className={styles.profileImgDiv} >
             <img src={element.teacherProfile} alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
        <div className={styles.rightBoxName} >{element.teacherFirstName} {element.teacherLastName} </div>  
        <div className={styles.rightBoxType}>from {element.teacherCountry}</div>
        <div className={styles.rightBoxLessons}>completed lessons {countCompletedLessons}
        



          </div>
        </div>
    </div>
    </Link>

  );
}

export default MyTeacherComponent;