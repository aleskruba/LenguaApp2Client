import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './mystudents.module.css';
import MyStudentComponent from '../../components/MyStudents/MyStudentComponent';
import { useNavigate } from 'react-router-dom';

function MyStudents() {
  const [arr, setArray] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const observerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
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
      {arr.map((element, index) => {
        return <MyStudentComponent element={element} name={element.name} key={index} />;
      })}
      <div id="observerElement" ref={observerRef} />
      {lastPage ? (
        <button onClick={goUpFunction} className={styles.goUp}>Go up</button>
      ) : ''}

<div className={styles.filtersBack}  onClick={()=>navigate("/teacherzone")}>Back</div>
    </div>
  );
}

export default MyStudents;