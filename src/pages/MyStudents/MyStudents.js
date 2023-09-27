import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './mystudents.module.css';
import MyStudentComponent from '../../components/MyStudents/MyStudentComponent';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress'
import useAuth from '../../hooks/useAuth';


function MyStudents() {

   const navigate = useNavigate();

  const [arr, setArray] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [lessons, setlessons] = useState([]);

  const firstNewElementRef = useRef(null);
  const lastElementRef = useRef(null); 

  useEffect(() => {

    async function fetchData() {
      const url = `${BASE_URL}/mystudents`

      try {
        const response = await axios.get(url, { withCredentials: true });
        const students = response.data.myStudentsArray;
        setlessons(response.data.allLessons)
        setTotalElements(students.length);
        setArray(response.data.myStudentsArray);
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

            

    const countCompletedLessons = lessons.reduce((count, lesson) => {
      if (lesson.idStudent == element.idStudent  && lesson.isCompleted) {
        return count + 1;
      }
      return count;
    }, 0)

              return (
                <MyStudentComponent
                countCompletedLessons={countCompletedLessons}
                 element={element}
                  key={element._id}
                  index={index}
                  firstNewElementRef={index === 0 ? firstNewElementRef : null}
                  itemsPerPage={itemsPerPage}
                  lastElementRef={index === arr.length - 1 ? lastElementRef : null}
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

export default MyStudents;

