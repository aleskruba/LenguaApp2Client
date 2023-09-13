import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './myteachingupcominglessons.module.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import MyTeachingLessonFilterComponent from '../../components/MyTeachingLessons/MyTeachingLessonFilterComponent';
import MyTeachingLessonComponent from '../../components/MyTeachingLessons/MyTeachingLessonComponent';
import BASE_URL from '../../config';
import MyTeachingUpcomingLessonComponent from '../../components/MyTeachingLessons/MyTeachingUpcomingLessonComponent';
import CircularProgress from '@mui/material/CircularProgress';

Modal.setAppElement('#root');

function MyTeachingUpcomingLessons() {
  const [arr, setArray] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const [loading,setLoading] = useState(true)
  const observerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const closeDialog = () => {
    setIsOpen(false);
    navigate('/myteachinglessons');
  };

  const openTestModal = (test) => {

    setIsOpen(true);
  };





  useEffect(() => {

    const url = `${BASE_URL}/myUpcomingTeachingLessons`

    async function fetchData() {
      try {
        const response = await axios.get(url, { withCredentials: true });
        const lessons = response.data.myLessonArray;
        setTotalElements(lessons.length);
        setArray((prevArray) => [...prevArray, ...lessons.slice(startIndex, startIndex + 15)]);
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
  
  <div className={isOpen ? styles.mainContainerFixed : styles.mainContainer}>
       <div className={styles.mainDiv}>

       {loading ?  
       
           
       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
       <CircularProgress />
     </div>
       
       :  <>
        {arr.map((element, index) => {
          
          const lesson = arr[index];
     
          return <MyTeachingUpcomingLessonComponent element={element}  key={index} lesson={lesson}/>;
        })}

</>
      }

        <div id="observerElement" ref={observerRef} />
        {(lastPage && arr.length > 10) ? (
          <button onClick={goUpFunction} className={styles.goUp}>Go up</button>
        ) : ''}

      </div>

      <div className={styles.filters} onClick={openTestModal}>Filters</div>
      <div className={styles.filtersBack}  onClick={()=>navigate("/teacherzone")}>Back</div>
      
             <Modal isOpen={isOpen} onRequestClose={closeDialog}>
               <MyTeachingLessonFilterComponent closeDialog={closeDialog} arr={arr}/>
      </Modal>
  </div>  

  );
}

export default MyTeachingUpcomingLessons;