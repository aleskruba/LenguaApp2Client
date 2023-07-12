import React,{useState,useEffect,useRef, Fragment} from 'react'
import styles from './reviewBoxComponent.module.css';
import axios from 'axios';




function ReviewBoxComponent({reviewsRef}) {

    const [arr, setArray] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [lastPage, setLastPage] = useState(false);


    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get(`${process.env.PUBLIC_URL}/teachers.json`)
            const teachers = response.data.teachers;
            setTotalElements(teachers.length);
            setArray((prevArray) => [...prevArray, ...teachers.slice(startIndex, startIndex + 15)]);
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

     
      {arr.map((element, index) => (
      <div className={styles.teacherReviewsMainBox} key={index}>
            <div className={styles.teacherReviewsnameAndImage}>
              <div className={styles.boxName}>
                <p><b>{element.firstName}</b></p>
                <p className={styles.teacherReviewsMainBoxDate}>15.6.2022</p>
              </div>
              <div className={styles.boxImg}>     <img src={process.env.PUBLIC_URL + '/man.jpg'} alt="" className={styles.imageProfile} /></div>
            </div>
            <div className={styles.teacherReviewsBottom}>
              <p className={styles.teacherReviewsBottomPtag}>Very good teacher</p>
            </div>
          </div>
                ))}
                        <div className={styles.innerDiv}>
                            {lastPage ? (
                            <button onClick={goUpFunction} className={styles.GoUpButton}>Go up</button>
                            ) : (
                            <button onClick={handleLoadMore} className={styles.LoadMoreButton}>Load More...</button>
                        )}
                    </div>
                 </div>
   
                 
   </Fragment>
  )
}

export default ReviewBoxComponent