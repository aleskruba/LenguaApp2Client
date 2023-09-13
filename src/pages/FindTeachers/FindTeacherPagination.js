import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './findteachers.module.css';
import FindTeacherComponent from '../../components/FindTeacher/FindTeacherComponent';
import BasicSelect from '../../components/FindTeacher/TeacherType.js';
import SearchBar from '../../components/FindTeacher/SearchBar.js';
import VideoPresentationComponent from '../../components/FindTeacher/VideoPresentationComponent.js';
import SliderComp from '../../components/FindTeacher/SliderComp.js';
import BASE_URL from '../../config';
import AuthContext from '../../context/AuthProvider';

function FindTeachersPagination() {
   const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [teachersPerPage] = useState(7); // Number of teachers to display per page
  const [loading, setLoading] = useState(true); // Loading page from the API
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTeacherType, setSelectedTeacherType] = useState(null);
  const [sliderValue, setSliderValue] = useState([5, 30]);
  const [teachervideo, setTeacherVideo] = useState(null);
  const [filteredElements, setFilteredElements] = useState([]); // Filtered data

  const { auth,  lessons, setLessons,  teachersArray, setTeachersArray} = useContext(AuthContext);
  const lastTeacherRef = useRef(null);

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

    setFilteredElements(filteredData); // Update filtered data

    // Update the displayed teachers based on the current page and teachers per page
    const startIndex = (currentPage - 1) * teachersPerPage;
    const endIndex = startIndex + teachersPerPage;
    const displayedTeachers = filteredData.slice(startIndex, endIndex);

    // Set the displayed teachers as the current page's content
    setDisplayedTeachers(displayedTeachers);
  }, [selectedLanguage, selectedTeacherType, sliderValue, currentPage, teachersArray, teachersPerPage]);

  const [displayedTeachers, setDisplayedTeachers] = useState([]); // Displayed teachers on the current page

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/findteachers`;

      try {
        const response = await axios.get(url, { withCredentials: true });
        const teacherdata = response.data.teachers;
        setTeachersArray(teacherdata);

        const lessonsData = response.data.lessons;
        setLessons(lessonsData);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to handle filter change and reset the page to 1
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Function to handle language filter change
  const handleSearchLanguageChange = (language) => {
    setSelectedLanguage(language);
    handleFilterChange(); // Reset page to 1 on filter change
  };

  // Function to handle teacher type filter change
  const handleTeacherTypeChange = (teacherType) => {
    setSelectedTeacherType(teacherType);
    handleFilterChange(); // Reset page to 1 on filter change
  };

  return (
    <div className={styles.findTeacherTop}>
      <div className={styles.findTeacherFilters}>
        <div className={styles.searchBarContainer}>
          <SearchBar setSelectedLanguage={handleSearchLanguageChange} setCurrentPage={setCurrentPage} />
        </div>
        <div className={styles.sliderContainer}>
          <SliderComp
            setSliderValue={setSliderValue}
            sliderValue={sliderValue}
            setCurrentPage={handleFilterChange} // Reset page to 1 on filter change
          />
        </div>
        <div className={styles.teachertypecontainer}>
          <BasicSelect setSelectedTeacherType={handleTeacherTypeChange} setCurrentPage={setCurrentPage} />
        </div>
      </div>
      <div className={styles.videoDiv}>
        <VideoPresentationComponent teachervideo={teachervideo} />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          {displayedTeachers.length > 0 ? (
            displayedTeachers.map((teacher, index) => (
              auth.user._id !== teacher._id && (
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
                    lastTeacherRef={index === displayedTeachers.length - 1 ? lastTeacherRef : null}
                  />
                </Link>
              )
            ))
          ) : (
            <div className={styles.noteacher}></div>
          )}
        </div>
        {loading && <div className={styles.lodaMore}>... Loading</div>}
      </div>

      {/* Pagination controls */}
      <div className={styles.pagination}>
        {displayedTeachers.length > 0 && (
          <ul className={styles.paginationList}>
            {Array.from({ length: Math.ceil(filteredElements.length / teachersPerPage) }).map((_, index) => (
              <li
                key={index}
                className={`${styles.paginationItem} ${index + 1 === currentPage ? styles.activePage : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FindTeachersPagination;