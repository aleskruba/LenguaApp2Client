import React, { useState, useEffect, useRef ,useContext} from 'react';
import axios from 'axios';
import styles from './action.module.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress'
import MyActionComponent from '../../components/ActionComponent/MyActionComponent';
import AuthContext from '../../context/AuthProvider';
import MyActionConfirmLessonComponent from '../../components/ActionComponent/MyActionConfirmLessonComponent';

function Action() {
  const [arr, setArray] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [completedLessonsArray,setCompoletedLessonsArray] = useState([])
  const [lastPage, setLastPage] = useState(false);
  const observerRef = useRef(null);
  const [loading,setLoading] = useState(true)
  const [loadingConfirm,setLoadingConfirm] =useState(false)
  const navigate = useNavigate();

  const {totalElements, setTotalElements,upCOmmingLessons} = useContext(AuthContext)


  const removeFromDisplayedLessons = (lessonId) => {
    setArray((prevArray) => prevArray.filter((lesson) => lesson._id !== lessonId));
    setCompoletedLessonsArray((prevArray) => prevArray.filter((lesson) => lesson._id !== lessonId));

  };



  useEffect(() => {
      async function fetchData() {
      const url = `${BASE_URL}/lessonreservationdata`;
  
      try {
        const response = await axios.get(url, { withCredentials: true });
        const lessonsData = response.data.lessons;
        const completedLessonsToConfirmByStudent = response.data.completedLessonsToConfirmByStudent
        setCompoletedLessonsArray(completedLessonsToConfirmByStudent)
        setLessons(lessonsData);
    
        setTotalElements(lessonsData.length+response.data.completedLessonsToConfirmByStudent.length);
    

        // Initially populate the arr state with the first 15 lessons (or all if less than 15)
        setArray(lessonsData.slice(0, Math.min(15, lessonsData.length)));
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

useEffect(()=>{
  if (totalElements<1){
    navigate('/')
  }
},[totalElements])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersection = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        handleLoadMore();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (observerRef.current) {
      observerRef.current.observe(document.querySelector('#observerElement'));
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array to only add observer once

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
    <div className={styles.mainDiv}>

{loading && !loadingConfirm?  

<div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
<CircularProgress />
</div>


:  <>  {!loadingConfirm? <>
      {arr?.reverse().map((element, index) => {

    const countCompletedLessons = lessons.reduce((count, lesson) => {
      if (lesson.idStudent === element.idStudent && lesson.isCompleted) {
        return count + 1;
      }
      return count;
    }, 0)


        return <MyActionComponent element={element} 
                                  name={element.name} 
                                  key={index} 
                                  arr={arr} 
                                  loading={loading}
                                  loadingConfirm={loadingConfirm}
                                  setLoadingConfirm={setLoadingConfirm}
                                  countCompletedLessons={countCompletedLessons}
                                  removeFromDisplayedLessons={removeFromDisplayedLessons}/>;
      })}
      
            {completedLessonsArray?.reverse().map((element, index) => {


              return <MyActionConfirmLessonComponent element={element} 
                                        name={element.name} 
                                        key={index} 
                                        arr={arr} 
                                        loading={loading}
                                        loadingConfirm={loadingConfirm}
                                        setLoadingConfirm={setLoadingConfirm}
                                        removeFromDisplayedLessons={removeFromDisplayedLessons}/>;
            })}
     
     
       </>: <p>wait please......</p>}
</>
      }
      
     {upCOmmingLessons>1 ? <div>No other requests.... </div> : null}
    

      <div id="observerElement" ref={observerRef} />
      {(lastPage && arr.length > 10) ? (
        <button onClick={goUpFunction} className={styles.goUp}>Go up</button>
      ) : ''}
    <div className={styles.filtersBack}  onClick={()=>navigate("/")}>Back</div>
    </div>

  );
}

export default Action;