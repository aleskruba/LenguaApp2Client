import styles from './findTeacherComponent.module.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function FindTeacherComponent({ teacher, lessons, lastElement,index }) {


  let count = 0;

  lessons.forEach((lesson) => {
    if (lesson.idTeacher === teacher._id) {
      count++;
    }
  });

  const truncatedProfileText =
    teacher.profileText?.length > 300
      ? teacher.profileText.slice(0, 150) + "..."
      : teacher.profileText;

  return (
    <div className={styles.mainTeacherBox}    ref={index % 5 === 0 ? lastElement : null}>
      <div className={styles.leftSide}>
        <div className={styles.leftTopSide}>
          <div className={styles.leftImg}>
            <img src={teacher.profile} alt="" />
          </div>
        </div>
        <div className={styles.leftBottomSide}>
          <div className={styles.leftLessons}>{count}</div>
          <div className={styles.leftLessons}>lessons</div>
        </div>
      </div>
      <div className={styles.rightSide}>
        <div className={styles.rightSideTop}>
          <div className={styles.rightSideName}>
            {teacher.firstName} {teacher.lastName}
          </div>
          <div className={styles.rightSideIcon}>
            <FavoriteBorderIcon />{" "}
          </div>
        </div>
        <div className={styles.rightSideTeacherType}>
          {teacher.teacherType}
        </div>
        <div className={styles.rightSideLanguagesText}>
          <span className={styles.rightSideLanguagesTextSpan}>Teaching: </span>
          {teacher.teachlanguages.map((lan, index) => (
            <span key={index}>
              {lan.language}
              {index !== teacher.teachlanguages.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        <div className={styles.rightSidePresentation}>
          {truncatedProfileText}
        </div>
        <div className={styles.rightSideBottom}>
          <div className={styles.rightSidePrice}>HOURLY TAX $ {parseInt(teacher.tax)}</div>
          <div className={styles.rightSideButtonDiv}> Contact teacher or book a lesson  </div>
        </div>
      </div>
    </div>



  );
}

export default FindTeacherComponent;
