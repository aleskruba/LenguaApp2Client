import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './findteachers.module.css';
import FindTeacherComponent from '../../components/FindTeacher/FindTeacherComponent';
import BasicSelect from '../../components/FindTeacher/TeacherType.js';
import SearchBar from '../../components/FindTeacher/SearchBar.js';
import VideoPresentationComponent from '../../components/FindTeacher/VideoPresentationComponent.js';
import SliderComp from '../../components/FindTeacher/SliderComp.js';
import AuthContext from '../../context/AuthProvider';

function FindTeachers() {

  
 
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [teachersPerPage, setTeachersPerPage] = useState(5); // Number of teachers to display per page
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTeacherType, setSelectedTeacherType] = useState(null);
  const [sliderValue, setSliderValue] = useState([5, 30]);
  const [teachervideo, setTeacherVideo] = useState(null);

  const observerRef = useRef(null);
  const { auth,  lessons,  teachersArray } = useContext(AuthContext);




/*   useEffect(() => {
    const options = {
      threshold: 0.9,
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
 */
/*   const handleIntersection = (entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      handleLoadMoreTeachers();
    }
  };
 */
  // Function to load more teachers when the last teacher is in view
/*   const handleLoadMoreTeachers = () => {
    setTeachersPerPage((prevPerPage) => prevPerPage + 5);
  };
 */
  // Filtering logic
  useEffect(() => {
    let filteredData = [...teachersArray];

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

    // Update the current page when filtering
    setCurrentPage(1);

    // Update the displayed teachers based on the current page and teachers per page
    const startIndex = (currentPage - 1) * teachersPerPage;
    const endIndex = startIndex + teachersPerPage;
    const displayedTeachers = filteredData.slice(startIndex, endIndex);

    // Set the displayed teachers as the current page's content
    setDisplayedTeachers(displayedTeachers);
  }, [selectedLanguage, selectedTeacherType, sliderValue, currentPage, teachersArray, teachersPerPage]);

  const [displayedTeachers, setDisplayedTeachers] = useState([]); // Displayed teachers on the current page

  // Function to handle page change
/*   const handlePageChange = (page) => {
    setCurrentPage(page);

    // Update the number of teachers per page if lastTeacherRef is not null
    if (observerRef.current) {
      setTeachersPerPage(10);
    }
  };
 */

const isLastPage = teachersPerPage > displayedTeachers.length;

 
  const handleNextElementsFunction = () => {
    setTeachersPerPage(teachersPerPage + 5);
    setTimeout(() => {
      if (observerRef.current) {
        observerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const goToTopFunction = () => {
    setTeachersPerPage(5)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100)
  };


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
            displayedTeachers.slice(0, teachersPerPage).map((teacher, index) => (
              auth.user?._id !== teacher._id && (
                <Link
                  key={index}
                  to={`/findteachers/${teacher._id}`}
                  state={{ teacher: teacher, lessons:lessons }}
                  className={styles.findTeacherComponent}
                  onMouseEnter={() => setTeacherVideo(teacher.profileVideo)}
                >
                  <FindTeacherComponent
                    teacher={teacher}
                    lessons={lessons}
                    teachervideo={teachervideo}
                  />
                </Link>
              )
            ))
          ) : (
            <div className={styles.noteacher}></div>
          )}

{displayedTeachers?.length >= 5 && (
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

        <div id="observerElement" />


      </div>
    </div>
  );
}

export default FindTeachers;

