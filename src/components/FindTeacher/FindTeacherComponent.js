import React from "react";
import styles from './findTeacherComponent.module.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


function FindTeacherComponent({teacher,lastTeacherRef}) {


  
  return (
    <>
      <div className={styles.mainTeacherBox} ref={lastTeacherRef}>
        <div className={styles.leftSide}>
          <div className={styles.leftTopSide}>
            <div className={styles.leftImg}>
              <img src="/man.jpg" alt="" />
            </div>
          </div>
          <div className={styles.leftBottomSide}>
            <div className={styles.leftLessons}>{teacher.totalLesson}</div>
            <div className={styles.leftLessons}>lessons</div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.rightSideTop}>
            <div className={styles.rightSideName}>
              {teacher.id}- {teacher.firstName}
            </div>
            <div className={styles.rightSideIcon}>
              <FavoriteBorderIcon />{" "}
            </div>
          </div>
          <div className={styles.rightSideTeacherType}>
            {teacher.teacherType}
          </div>
          <div className={styles.rightSideLnaguagesText}>
            Speaks :{" "}
            <span className={styles.rightSideLnaguages}>
              {teacher.language}
            </span>{" "}
          </div>
          <div className={styles.rightSidePresentation}>
            {teacher.profileText}
          </div>
          <div className={styles.rightSideBottom}>
            <div className={styles.rightSidePrice}>HOURLY TAX ${teacher.tax}</div>
            <div className={styles.rightSideButtonDiv}> Contact teacher or book a lesson"  </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default FindTeacherComponent;
