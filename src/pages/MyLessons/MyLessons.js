import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './mylessons.module.css';
import MyLessonComponent from '../../components/MyLessons/MyLessonComponent';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import MyLessonsFilterComponent from '../../components/MyLessons/MyLessonsFilterComponent';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress'


function MyLessons() {

  const navigate = useNavigate();

  const [arr, setArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userTeachers,setUserTeachers] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const [updatedLesson,setUpdatedLesson] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const observerRef = useRef(null);  
  const firstNewElementRef = useRef(null);

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
        setUserTeachers(response.data.myTeachers)
        setTotalElements(lessons.length);
        setArray(lessons.reverse());
        setIsLoading(false)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [updatedLesson]);


  const handleNextElementsFunction = () => {
    setItemsPerPage(itemsPerPage + 15);
    setTimeout(() => {
      if (firstNewElementRef.current) {
        firstNewElementRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const goToTopFunction = () => {
    setItemsPerPage(itemsPerPage - arr.length+ 15)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100)
  };

  const isLastPage = itemsPerPage >= totalElements;

  return (
<div className={isOpen ? styles.mainContainerFixed : styles.mainContainer}>
       <div className={styles.mainDiv}>

       {isLoading ? 
       
       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
<CircularProgress />
</div>
       
       :  <>
    {arr.slice(0, itemsPerPage).map((element, index) => {
    if (!(element.isCancelled)) {
      const lesson = arr[index];

      return (
        <MyLessonComponent
          userTeachers={userTeachers}
          updatedLesson={updatedLesson}
          setUpdatedLesson={setUpdatedLesson}
          element={element}
          key={element._id}
          index={index}
          lesson={lesson}
          firstNewElementRef={index === 0 ? firstNewElementRef : null}
          itemsPerPage={itemsPerPage}
        />
      );
    }
    return null; 
  })
}



</>
      }

        <div id="observerElement" ref={observerRef} />

        {!isLoading && arr?.length > 10 && (
          <>
            {isLastPage ? (
              <button className={styles.goUp} onClick={goToTopFunction}>
                Go Up
              </button>
            ) : (
              <button className={styles.goUp} onClick={handleNextElementsFunction}>
                next 15....
              </button>
            )}
          </>
        )}


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