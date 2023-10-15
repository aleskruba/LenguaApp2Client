import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './myteachers.module.css';
import MyTeacherComponent from '../../components/MyTeachers/MyTeacherComponent';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress'

function MyTeachers() {
  const [arr, setArray] = useState([]);
  const [lessons, setlessons] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [loading,setLoading] = useState(true)
  const [userTeachers,setUserTeachers] = useState(null)
  const observerRef = useRef(null);
  

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const url = `${BASE_URL}/myteachers`;

      try {
        const response = await axios.get(url, { withCredentials: true });
        const teachers = response.data.myTeachersArray;
        setlessons(response.data.allLessons);
        setUserTeachers(response.data.myTeachers)
        setTotalElements(teachers.length);
        setArray((prevArray) => [...prevArray, ...teachers.slice(startIndex, startIndex + 15)]);
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [startIndex]);

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
    if (arr.length > 0 && (startIndex >= totalElements - 15 || arr.length >= 10)) {
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
      {loading ? 
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
      <CircularProgress />
      </div>
      :  <>

      {arr.map((element, index) => {
        const countCompletedLessons = lessons.reduce((count, lesson) => {
          if (lesson.idTeacher === element.idTeacher && lesson.isCompleted) {
            return count + 1;
          }
          return count;
        }, 0);

        return <MyTeacherComponent 
                    userTeachers={userTeachers}
                    element={element} 
                    name={element.name} 
                    key={index} 
                    arr={arr} 
                    countCompletedLessons={countCompletedLessons}/>;
              
              })}
     </>
      }

      <div id="observerElement" ref={observerRef} />

      {arr.length < 1 && <h1 className={styles.noTeacherText}>You have no teachers yet .... </h1>}
      {/* Show "Go up" button only if it's the last page or there are at least 10 elements */}
      {(lastPage && arr.length > 10)  ? (
        <button onClick={goUpFunction} className={styles.goUp}>Go up</button>
      ) : ''}
      <div className={styles.filtersBack}  onClick={()=>navigate("/")}>Back</div>
 
      </div>
      
  );
}

export default MyTeachers;
