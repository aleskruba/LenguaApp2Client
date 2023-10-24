import React,{useState,useRef, Fragment} from 'react'
import styles from './reviewBoxComponent.module.css';
import moment from 'moment';




function ReviewBoxComponent({reviewsRef,lessons,teacher}) {


    const [itemsPerPage, setItemsPerPage] = useState(10);

    const firstNewElementRef = useRef(null);

    const handleNextElementsFunction = () => {
      setItemsPerPage(itemsPerPage + 15);
      setTimeout(() => {
        if (firstNewElementRef.current) {
          firstNewElementRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };
  
    const goToTopFunction = () => {
      setItemsPerPage(itemsPerPage - lessons.length+ 15)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100)
    };


    const filteredLessons = lessons?.filter(element => element.idTeacher === teacher._id);
  

    const isLastPage = itemsPerPage >= filteredLessons.length;
    return (
    <Fragment>
         <div className={styles.mainTeacherProfileMainBoxReviews} ref={reviewsRef}>
        <div className={styles.ReviewTitleDiv}>    <h5 className={styles.ReviewTitle}>Reviews</h5>    </div>   

     
      {filteredLessons?.slice(0, itemsPerPage).map((element, index) => { 
            if (element.idTeacher === teacher._id )   {
                

        return  (
      <div className={styles.teacherReviewsMainBox} key={index} ref={index === itemsPerPage-18 ? firstNewElementRef : null}>
            <div className={styles.teacherReviewsnameAndImage}>
              <div className={styles.boxName}>
                <p><b>{element.firstName}</b></p>
                <p className={styles.teacherReviewsMainBoxDate}>{element.studentFirstName} {moment(element.completedConfirmedByStudentAt).format('D.M.YYYY')}</p>
              </div>
              <div className={styles.boxImg}>     <img src={element.studentProfile} alt="" className={styles.imageProfile} /></div>
            </div>
            <div className={styles.teacherReviewsBottom}>
              <p className={styles.teacherReviewsBottomPtag}>{element.ranking} </p>
            </div>
          </div>
                )
              }
              }
                
                )}
                        <div className={styles.innerDiv}>
                        { filteredLessons?.length > 10 && (
                          <>
                            {isLastPage ? (
                              <button className={styles.goUp} onClick={goToTopFunction}>
                                Go Up
                              </button>
                            ) : 
                            
                              (
                              <button className={styles.goUp} onClick={handleNextElementsFunction}>
                                load more
                              </button>
                            )}
                          </>
                        )}
                    </div>
                 </div>
   
                 
   </Fragment>
  )
}

export default ReviewBoxComponent