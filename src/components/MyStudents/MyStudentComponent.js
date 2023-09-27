import React from 'react';
import styles from './mystudentcomponent.module.css';

function MyStudentComponent( {element,itemsPerPage,firstNewElementRef,index,countCompletedLessons }) {

  return (
    <div className={`${styles.card} ${styles.show}`} ref={index === itemsPerPage-18 ? firstNewElementRef : null}>
      <div className={styles.leftBox}>
          <div className={styles.profileImgDiv} >
             <img src={element.studentProfile} alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
        <div className={styles.rightBoxName} >{element.studentFirstName}</div>  
        <div className={styles.rightBoxType}>from {element.studentCountry}</div>
        <div className={styles.rightBoxLessons}>completed lessons {countCompletedLessons} </div>
        </div>
    </div>
  );
}

export default MyStudentComponent;