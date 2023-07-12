import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './mylessons.module.css';
import MyLessonComponent from '../../components/MyLessons/MyLessonComponent';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import MyLessonsFilterComponent from '../../components/MyLessons/MyLessonsFilterComponent';

Modal.setAppElement('#root');

function MyLessons() {
  const [arr, setArray] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [lastPage, setLastPage] = useState(false);
  const observerRef = useRef(null);

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
    async function fetchData() {
      try {
        const response = await axios.get('./teachers.json');
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
        {arr.map((element, index) => {
          return <MyLessonComponent element={element}  key={index} />;
        })}
        <div id="observerElement" ref={observerRef} />
        {lastPage ? (
          <button onClick={goUpFunction} className={styles.goUp}>Go up</button>
        ) : ''}

      </div>

      <div className={styles.filters} onClick={openTestModal}>Filters</div>
      <div className={styles.filtersBack}  onClick={()=>navigate("/")}>Back</div>
      
             <Modal isOpen={isOpen} onRequestClose={closeDialog}>
               <MyLessonsFilterComponent closeDialog={closeDialog} arr={arr}/>
      </Modal>
  </div>    

  );
}

export default MyLessons;