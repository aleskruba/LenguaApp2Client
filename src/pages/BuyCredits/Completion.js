import React, { useState, useEffect } from 'react';
import styles from './completion.module.css';
import { Link} from 'react-router-dom';


const Component = () => {
  const [showCompletion, setShowCompletion] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    setShowCompletion(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.mainDiv}>
      <div className={`${styles.completionDiv} ${showCompletion ? styles.show : ''}`}>
        <h1 className={styles.completionH1}>Thank You</h1>
        <h1 className={styles.completionH1}>Your credits have been successfully updated.</h1>
        <h1 className={styles.completionH1}>Total credits $350</h1>
      </div>

      {showButton && (
        <Link to="/findteachers">
        <div className={styles.findTeacher} >
          <div className={styles.findTeacherButton} >Find your teacher</div>
        </div>
        </Link>
      )}
   
    </div>
  );
};

export default Component;
