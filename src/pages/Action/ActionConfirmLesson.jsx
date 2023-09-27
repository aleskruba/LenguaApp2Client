import React, { useState, useEffect, useRef ,useContext} from 'react';
import axios from 'axios';
import styles from './action.module.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';
import CircularProgress from '@mui/material/CircularProgress'
import MyActionComponent from '../../components/ActionComponent/MyActionComponent';
import AuthContext from '../../context/AuthProvider';
import MyActionConfirmLessonComponent from '../../components/ActionComponent/MyActionConfirmLessonComponent';

function ActionConfirmLesson() {

  const [completedLessonsArray,setCompoletedLessonsArray] = useState([])
  const [loading,setLoading] = useState(true)
  const [loadingConfirm,setLoadingConfirm] =useState(false)
  const navigate = useNavigate();

  const {totalElements, setTotalElements,upCOmmingLessons} = useContext(AuthContext)


  const removeFromDisplayedLessons = (lessonId) => {
    completedLessonsArray((prevArray) => prevArray.filter((lesson) => lesson._id !== lessonId));
  };

  useEffect(() => {
      async function fetchData() {
      const url = `${BASE_URL}/lessonreservationdata`;
  
      try {
        const response = await axios.get(url, { withCredentials: true });
        const completedLessonsToConfirmByStudent = response.data.completedLessonsToConfirmByStudent
        setCompoletedLessonsArray(completedLessonsToConfirmByStudent)
    
        setTotalElements(completedLessonsToConfirmByStudent.length);
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);


  const goUpFunction = () => {

  };

  return (
    <div className={styles.mainDiv}>

{loading && !loadingConfirm?  

<div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', height: '100vh' }}>
<CircularProgress />
</div>


:  <>  {!loadingConfirm && totalElements > 0? <>
      {arr?.reverse().map((element, index) => {

      const countCompletedLessons = lessons.reduce((count, lesson) => {
        if (lesson.idStudent === element.idStudent && lesson.isCompleted) {
          return count + 1;
        }
        return count;
      }, 0)



    


        return <MyActionConfirmLessonComponent element={element} 
                                  name={element.name} 
                                  key={index} 
                                  arr={arr} 
                                  loading={loading}
                                  loadingConfirm={loadingConfirm}
                                  setLoadingConfirm={setLoadingConfirm}
                                  countCompletedLessons={countCompletedLessons}
                                  removeFromDisplayedLessons={removeFromDisplayedLessons}
                                                          />;



      })}
       </>: <p>wait please...</p>}
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

export default ActionConfirmLesson;