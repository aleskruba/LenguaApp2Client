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

function FindTeachers() {
  const [teachersArray, setTeachersArray] = useState([]); // all data from the API
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [teachersPerPage] = useState(7); // Number of teachers to display per page
  const [loading, setLoading] = useState(true); // Loading page from the API
  const [lessons, setLessons] = useState(null); // Just for statistics purposes
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTeacherType, setSelectedTeacherType] = useState(null);
  const [sliderValue, setSliderValue] = useState([5, 30]);
  const [teachervideo, setTeacherVideo] = useState(null);

  const { auth } = useContext(AuthContext);
  const lastTeacherRef = useRef(null);

  // Function to load more teachers when scrolling to the end
  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.target === lastTeacherRef.current && entry.isIntersecting && entry.intersectionRatio > 0) {
        // Load more data here, increment the currentPage, or perform infinite scroll logic
        // For simplicity, let's increment the currentPage
        setCurrentPage((prevPage) => prevPage + 1);
      }
    });
  };

  // Set up the IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1, // Adjust this threshold as needed
    });

    if (lastTeacherRef.current) {
      observer.observe(lastTeacherRef.current);
    }

    // Clean up the observer when component unmounts
    return () => {
      if (lastTeacherRef.current) {
        observer.unobserve(lastTeacherRef.current);
      }
    };
  }, [lastTeacherRef, currentPage]);

  // Fetch data from the API based on currentPage and apply filtering
  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/findteachers?page=${currentPage}&per_page=${teachersPerPage}`;

      try {
        const response = await axios.get(url, { withCredentials: true });
        const teacherdata = response.data.teachers;
        setTeachersArray((prevData) => [...prevData, ...teacherdata]);

        const lessonsData = response.data.lessons;
        setLessons(lessonsData);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentPage, teachersPerPage]);

  return (
    <div className={styles.findTeacherTop}>
      <div className={styles.findTeacherFilters}>
        <div className={styles.searchBarContainer}>
          <SearchBar setSelectedLanguage={setSelectedLanguage} />
        </div>
        <div className={styles.sliderContainer}>
          <SliderComp setSliderValue={setSliderValue} sliderValue={sliderValue} />
        </div>
        <div className={styles.teachertypecontainer}>
          <BasicSelect setSelectedTeacherType={setSelectedTeacherType} />
        </div>
      </div>
      <div className={styles.videoDiv}>
        <VideoPresentationComponent teachervideo={teachervideo} />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          {teachersArray.length > 0 ? (
            teachersArray.map((teacher, index) => (
              auth.user._id !== teacher._id && (
                <Link
                  key={index}
                  to={`/findteachers/${teacher._id}`}
                  className={styles.findTeacherComponent}
                  onMouseEnter={() => setTeacherVideo(teacher.profileVideo)}
                >
                  <FindTeacherComponent
                    teacher={teacher}
                    lessons={lessons}
                    // Use a unique key for each teacher
                    key={teacher._id}
                    ref={index === teachersArray.length - 1 ? lastTeacherRef : null}
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
    </div>
  );
}

export default FindTeachers;
