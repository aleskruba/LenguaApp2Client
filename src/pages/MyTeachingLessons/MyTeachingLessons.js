import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './myteachinglessons.module.css';
import { useNavigate } from 'react-router-dom';
import MyTeachingLessonComponent from '../../components/MyTeachingLessons/MyTeachingLessonComponent';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress';


function MyTeachingLessons() {


  const navigate = useNavigate();


  const [arr, setArray] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const firstNewElementRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);



  useEffect(() => {
    const url = `${BASE_URL}/myFinishedTeachingLessons`;

    async function fetchData() {
      try {
        const response = await axios.get(url, { withCredentials: true });
        const lessons = response.data.myLessonArray;
        setTotalElements(lessons.length);
        setArray(response.data.myLessonArray);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

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
    <div className={styles.mainContainer}>
      <div className={styles.mainDiv}>
      
      
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            {arr.slice(0, itemsPerPage).map((element, index) => {
              const lesson = arr[index];

              return (
                <MyTeachingLessonComponent
                  element={element}
                  key={element._id}
                  index={index}
                  lesson={lesson}
                  firstNewElementRef={index === 0 ? firstNewElementRef : null}
                  itemsPerPage={itemsPerPage}
                  />
              );
            })}
          </>
        )}
        <div/>


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


      <div className={styles.filtersBack} onClick={() => navigate('/teacherzone')}>
        Back
      </div>
    </div>
  );
}

export default MyTeachingLessons;
