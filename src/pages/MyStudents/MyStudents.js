import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './mystudents.module.css';
import MyStudentComponent from '../../components/MyStudents/MyStudentComponent';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress'

function MyStudents() {
  const [arr, setArray] = useState([]);
  const [lessons, setlessons] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const observerRef = useRef(null);
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate();

/*   useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('./array.json');
        const teachers = response.data.newTeachers;
        setTotalElements(teachers.length);
        setArray((prevArray) => [...prevArray, ...teachers.slice(startIndex, startIndex + 15)]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [startIndex]); */


  useEffect(() => {
    async function fetchData() {
      const url = `${BASE_URL}/mystudents`



      try {
        const response = await axios.get(url, { withCredentials: true });
        const students = response.data.myStudentsArray;

        setlessons(response.data.allLessons)
        setTotalElements(students.length);
        setArray((prevArray) => [...prevArray, ...students.slice(startIndex, startIndex + 15)]);
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

{loading ?  

<div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
<CircularProgress />
</div>


:  <>
      {arr.map((element, index) => {

    const countCompletedLessons = lessons.reduce((count, lesson) => {
      if (lesson.idStudent === element.idStudent && lesson.isCompleted) {
        return count + 1;
      }
      return count;
    }, 0)


        return <MyStudentComponent element={element} name={element.name} key={index} arr={arr} countCompletedLessons={countCompletedLessons}/>;
      })}
</>
      }

      <div id="observerElement" ref={observerRef} />
      {(lastPage && arr.length > 10) ? (
        <button onClick={goUpFunction} className={styles.goUp}>Go up</button>
      ) : ''}
    <div className={styles.filtersBack}  onClick={()=>navigate("/teacherzone")}>Back</div>
    </div>

  );
}

export default MyStudents;