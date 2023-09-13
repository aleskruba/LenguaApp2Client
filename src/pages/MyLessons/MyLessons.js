import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './mylessons.module.css';
import MyLessonComponent from '../../components/MyLessons/MyLessonComponent';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import MyLessonsFilterComponent from '../../components/MyLessons/MyLessonsFilterComponent';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress'

Modal.setAppElement('#root');

function MyLessons() {
  const [arr, setArray] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const observerRef = useRef(null);
  const [loading,setLoading] = useState(true)
  const [userTeachers,setUserTeachers] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeDialog = () => {
    setIsOpen(false);
    navigate('/mylessons');
  };

  const openTestModal = (test) => {

    setIsOpen(true);
  };


  useEffect(() => {

    const url = `${BASE_URL}/mybookedlessons`

    async function fetchData() {
      try {
        const response = await axios.get(url, { withCredentials: true });
        const lessons = response.data.myLessonArray;
        setTotalElements(lessons.length);
        setUserTeachers(response.data.myTeachers)
        setArray((prevArray) => [...prevArray, ...lessons.slice(startIndex, startIndex[startIndex -1])]);
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
      //  handleLoadMore();
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
    if (arr.length > 0 && startIndex >= totalElements ) {
      setLastPage(true);
    } else {
      setLastPage(false);
    }
  }, [arr, startIndex, totalElements]);

  const handleLoadMore = () => {
    setStartIndex((prevIndex) => prevIndex + 15);
  };

  const goUpFunction = () => {
    window.scrollTo(0, 0);
    setStartIndex(0);
    //setArray([]);
    //setLastPage(false);
  };

  return (
<div className={isOpen ? styles.mainContainerFixed : styles.mainContainer}>
       <div className={styles.mainDiv}>

       {loading ? 
       
       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
<CircularProgress />
</div>
       
       :  <>
{arr
  .sort((a, b) => new Date(b.reservedByStudentcreatedAt) - new Date(a.reservedByStudentcreatedAt))
  .map((element, index) => {
    const lesson = arr[index];
    return <MyLessonComponent element={element} key={index} lesson={lesson} userTeachers={userTeachers}/>;
  })}


</>
      }

        <div id="observerElement" ref={observerRef} />
        {(arr.length > 15) ? (
          <button onClick={goUpFunction} className={styles.goUp}>Go up</button>
        ) : ''}

      </div>

      <div className={styles.filters} onClick={openTestModal}>Filters</div>
      <div className={styles.filtersBack}  onClick={()=>navigate("/")}>Back</div>
      
             <Modal isOpen={isOpen} onRequestClose={closeDialog}>
               <MyLessonsFilterComponent closeDialog={closeDialog} arr={arr} userTeachers={userTeachers}/>
      </Modal>
  </div>    

  );
}

export default MyLessons;