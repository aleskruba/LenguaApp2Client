import React, { useEffect, useState, useContext, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './findteachers.module.css';
import FindTeacherComponent from '../../components/FindTeacher/FindTeacherComponent';
import BasicSelect from '../../components/FindTeacher/TeacherType.js';
import SearchBar from '../../components/FindTeacher/SearchBar.js';
import VideoPresentationComponent from '../../components/FindTeacher/VideoPresentationComponent.js';
import SliderComp from '../../components/FindTeacher/SliderComp.js';
import AuthContext from '../../context/AuthProvider';

function FindTeachers() {

  const { auth,  lessons,  teachersArray } = useContext(AuthContext);
 
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTeacherType, setSelectedTeacherType] = useState(null);
  const [sliderValue, setSliderValue] = useState([5, 30]);
  const [teachervideo, setTeacherVideo] = useState(null);
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [page, setPage] = useState(5);
  const [goUp, setGoUp] = useState(false);

 
  const lastElement = useRef();


  const GoUpFunction = () => {
    setDisplayedTeachers([])
    setPage(5);
    setGoUp(!goUp)
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  let filteredData = [...teachersArray];

  useEffect(() => {
   

    if (selectedLanguage) {
      filteredData = filteredData.filter((teacher) =>
        teacher.teachlanguages.some((lan) => lan.language === selectedLanguage.label)
      );
    }

    if (selectedTeacherType) {
      filteredData = filteredData.filter((teacher) => teacher.teacherType === selectedTeacherType.label);
    }

    filteredData = filteredData.filter(
      (teacher) => parseInt(teacher.tax) >= sliderValue[0] && parseInt(teacher.tax) <= sliderValue[1]
    );

    setCurrentPage(1);

    const startIndex = (currentPage - 1) * page;
    const endIndex = startIndex + page;
    const displayedTeachers = filteredData.slice(startIndex, endIndex);

    setDisplayedTeachers(displayedTeachers);
  }, [selectedLanguage, selectedTeacherType, sliderValue, currentPage, teachersArray, page]);



  
  const loadMoreData = () => {
    if (
      lastElement.current &&
      lastElement.current.getBoundingClientRect().bottom <= window.innerHeight
    ) {
      // When you reach the last element, load more data
      setPage((prevPage) => prevPage + 2);
    }
  };

  useEffect(() => {
    if ( displayedTeachers.length <= teachersArray.length) {
      const handleScroll = () => {
        loadMoreData();
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        // Remove the event listener when the component unmounts
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [goUp]);



  useEffect(() => {
    setDisplayedTeachers([...filteredData].slice(0, page));

  }, [ page,goUp]);

  return (
    <div className={styles.findTeacherTop}>
      <div className={styles.findTeacherFilters}>
        <div className={styles.searchBarContainer}>
          <SearchBar setSelectedLanguage={setSelectedLanguage} setCurrentPage={setCurrentPage} />
        </div>
        <div className={styles.sliderContainer}>
          <SliderComp setSliderValue={setSliderValue} sliderValue={sliderValue} setCurrentPage={setCurrentPage} />
        </div>
        <div className={styles.teachertypecontainer}>
          <BasicSelect setSelectedTeacherType={setSelectedTeacherType} setCurrentPage={setCurrentPage} />
        </div>
      </div>
      <div className={styles.videoDiv}>
        <VideoPresentationComponent teachervideo={teachervideo} />
        </div>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          {displayedTeachers.length > 0 ? (
            displayedTeachers.map((teacher, index) => (
              auth.user?._id !== teacher._id && (
                <Fragment key={index}>
                <Link
                  to={`/findteachers/${teacher._id}`}
                  state={{ teacher: teacher, lessons:lessons }}
                  className={styles.findTeacherComponent}
                  onMouseEnter={() => setTeacherVideo(teacher.profileVideo)}
                >
                  <FindTeacherComponent
                    teacher={teacher}
                    lessons={lessons}
                    teachervideo={teachervideo}
                    lastElement={lastElement}
                    teachersArray={teachersArray}
                    index={index}
                    GoUpFunction={GoUpFunction}
                  />
                </Link>

             </Fragment>
              )
            ))
          ) : (
            <div className={styles.noteacher}>
              {filteredData.length > 0 ? <p>no teachers ... </p> :
              <p>wait please ... </p> } 
              
              </div>
          )}


{filteredData.length > 0 &&
                 <div>
                              <button className={styles.goUpBtn} onClick={() => GoUpFunction()}>Go Up</button>
             
                  
                </div> }
        </div>
      </div>
    </div>
  );
}

export default FindTeachers;

