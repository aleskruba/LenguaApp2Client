import React,{useState,useEffect,useRef, Fragment} from 'react'
import styles from './reviewBoxComponent.module.css';
import axios from 'axios';
import moment from 'moment';




function ReviewBoxComponent({reviewsRef,lessons,teacher}) {

    const [arr, setArray] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [lastPage, setLastPage] = useState(false);


    useEffect(() => {

      function fetchData() {
          try {
     
            lessons && setArray((prevArray) => [...prevArray, ...lessons.slice(startIndex, startIndex + 15)]);
          } catch (error) {
            console.error(error);
          }
        }
        fetchData();
      }, [startIndex]);

      useEffect(() => {
        if (arr.length > 0 && startIndex >= totalElements - 15) {
          setLastPage(true);
        } else {
          setLastPage(false);
        }
      }, [arr, startIndex, totalElements]);
    
      const handleLoadMore = () => {
        setStartIndex((prevIndex) => prevIndex + 15);
      };
    
      const goUpFunction = () => {
        setStartIndex(0);
        setArray([]);
        setLastPage(false);
      };

    return (
    <Fragment>
         <div className={styles.mainTeacherProfileMainBoxReviews} ref={reviewsRef}>
        <div className={styles.ReviewTitleDiv}>    <h5 className={styles.ReviewTitle}>Reviews</h5>    </div>   

     
      {lessons?.map((element, index) => { 
            if (element.idTeacher === teacher._id)  {
        return  (
      <div className={styles.teacherReviewsMainBox} key={index}>
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

                      {arr.length > 15  ? 

                      <Fragment>

                            {lastPage ? (
                            <button onClick={goUpFunction} className={styles.GoUpButton}>Go up</button>
                            ) : (
                            <button onClick={handleLoadMore} className={styles.LoadMoreButton}>Load More...</button>
                        )}
                       </Fragment>
                        :
                          null  }
                    </div>
                 </div>
   
                 
   </Fragment>
  )
}

export default ReviewBoxComponent