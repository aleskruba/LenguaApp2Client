import React, { useRef, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './findteachers.module.css';
import FindTeacherComponent from '../../components/FindTeacher/FindTeacherComponent';
import './autosuggest.css'; // Import the CSS file
import BasicSelect from '../../components/FindTeacher/TeacherType.js';
import SearchBar from '../../components/FindTeacher/SearchBar.js';
import VideoPresentationComponent from '../../components/FindTeacher/VideoPresentationComponent.js';
import SliderComp from '../../components/FindTeacher/SliderComp.js';
import BASE_URL from '../../config';
import AuthContext from '../../context/AuthProvider';

function FindTeachers() {
  const [teachersArray, setTeachersArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const lastTeacherRef = useRef(null);
  let itemsPerPage = 12;

  const { auth } = useContext(AuthContext);

  let minValue = 5;
  let maxValue = 30;

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTeacherType, setSelectedTeacherType] = useState(null);
  const [sliderValue, setSliderValue] = useState([minValue, maxValue]);
  const [lessons, setLessons] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    setCurrentPage(1);
    setTeachersArray([]);
  }, [selectedLanguage, selectedTeacherType, sliderValue]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/findteachers`;
   

      try {
        const response = await axios.get(url, { withCredentials: true });
        const teacherdata = response.data.teachers;
     
        setData(teacherdata);

        const lessons = response.data.lessons;
        setLessons(lessons);

        setLoading(false);

        if (!teacherdata || !Array.isArray(teacherdata)) {
          console.error('Invalid data received from API');
          return;
        }
      } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = [...data];

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

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    setTeachersArray(pageData);
  }, [currentPage, selectedLanguage, selectedTeacherType, sliderValue, data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === lastTeacherRef.current && entry.isIntersecting && entry.intersectionRatio > 0) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.75,
      }
    );

    const currentRef = lastTeacherRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [currentPage]);

  const [teachervideo, setTeacherVideo] = useState(null);

  return (
    <>
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
            {teachersArray.length > 0 ? (
              teachersArray.map((teacher, index) => (
                auth.user._id !== teacher._id && (
                  <Link
                    key={index}
                    to={`/findteachers/${teacher._id}`}
                    className={styles.findTeacherComponent}
                    onMouseEnter={() => setTeacherVideo(teacher.profileVideo)}
                  >
                    <FindTeacherComponent teacher={teacher} lessons={lessons} lastTeacherRef={index === teachersArray.length - 1 ? lastTeacherRef : null} />
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
    </>
  );
}

export default FindTeachers;

