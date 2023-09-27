import React from 'react';
import styles from './myteachingcomponent.module.css';
import moment from 'moment';


function MyTeachingUpcomingLessonComponent({  element,lesson,itemsPerPage,firstNewElementRef,index }) {

  return (
    <div className={`${styles.card} ${styles.show}`} ref={index === itemsPerPage-18 ? firstNewElementRef : null}>
      <div className={styles.leftBox}>
          <div className={styles.profileImgDiv} >
             <img src={element.studentProfile} alt="" className={styles.profileImg} />
            </div>
      </div>

      <div className={styles.rightBox}>
        
          <div className={styles.rightBoxTop}>      
        <div className={styles.rightBoxName} >{element.studentFirstName}</div>
        <div className={styles.rightBoxType}>from {element.studentCountry}</div>
        
        </div>  
        <div className={styles.rightBoxBottom}>        
            <div className={styles.rightBoxDate}>     
             {lesson.timeSlot.map((date, index) => (
              <div key={index}>
                {moment(parseInt(date)).format('DD MMM HH:mm')} -{' '}
                {moment(parseInt(date)).add(1, 'hour').utc().format('HH:mm')} 
              </div>
            ))}</div>
          </div>
          <div className={styles.rightBoxLesson}>{element.isCancelled ? 'Lesson Cancelled by Student' : 'Confirmed lesson'}</div>
    </div>
    </div>
  );
}

export default MyTeachingUpcomingLessonComponent;