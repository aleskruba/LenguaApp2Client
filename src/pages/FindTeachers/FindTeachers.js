import React, { useRef, useEffect, useState } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
import styles from './findteachers.module.css';
import FindTeacherComponent from '../../components/FindTeacher/FindTeacherComponent';
import './autosuggest.css'; // Import the CSS file
import BasicSelect from '../../components/FindTeacher/TeacherType.js';
import SearchBar from '../../components/FindTeacher/SearchBar.js';
import VideoPresentationComponent from '../../components/FindTeacher/VideoPresentationComponent.js';
import SliderComp from '../../components/FindTeacher/SliderComp.js';




function FindTeachers() {

  const [teachersArray, setTeachersArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const lastTeacherRef = useRef(null);
  const itemsPerPage = 10;

  let minValue = 5;
  let maxValue = 30;

  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedTeacherType, setSelectedTeacherType] = useState(null);
  const [sliderValue, setSliderValue] = useState([minValue, maxValue]);
  const [dataFiltered,setDataFiltered] = useState(false)

  useEffect(() => {
    setCurrentPage(1);
    setTeachersArray([]);
  }, [selectedLanguage, selectedTeacherType, sliderValue]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
       
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/teachers.json`);
        const data = response.data;
    
        const isFiltered = selectedLanguage || selectedTeacherType || (sliderValue[0] !== minValue || sliderValue[1] !== maxValue);


        // Filter the data based on selectedLanguage and selectedTeacherType
        let filteredData = data.teachers;
    
        if (selectedLanguage) {
          filteredData = filteredData.filter((teacher) => teacher.language === selectedLanguage.label);
          
        }
    
        if (selectedTeacherType) {
          filteredData = filteredData.filter((teacher) => teacher.teacherType === selectedTeacherType.label);
        }
    
        filteredData = filteredData.filter((teacher) => teacher.tax >= sliderValue[0] && teacher.tax <= sliderValue[1]);

        // Apply pagination to the filtered data
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        if (!isFiltered) {
     
         } else{  
             setDataFiltered(true)
        
        }

       

        setTeachersArray((prevTeachers) => [...prevTeachers, ...pageData]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    
      setLoading(false);
    };
    
  
    fetchData();
  }, [currentPage, selectedLanguage, selectedTeacherType, sliderValue]);
  
  
  useEffect(() => {


    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          // Check if all data has been loaded
          if (teachersArray.length % itemsPerPage === 0) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        }
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
  }, [teachersArray]);
  

  

  return (
    <>
    <div className={styles.findTeacherTop}>

        <div className={styles.findTeacherFilters}>
          
              <div className={styles.searchBarContainer}>
                  <SearchBar setSelectedLanguage={setSelectedLanguage} setCurrentPage={setCurrentPage}/>  
              </div>

              <div className={styles.teachertypecontainer}>
                <BasicSelect setSelectedTeacherType={setSelectedTeacherType} setCurrentPage={setCurrentPage}/>
              </div>
              
              <div className={styles.sliderContainer}>
                  <SliderComp setSliderValue={setSliderValue} sliderValue={sliderValue} setCurrentPage={setCurrentPage}/>
              </div>
          </div>

          <div className={styles.videoDiv}>
               <VideoPresentationComponent/>
            </div>

     

      <div className={styles.mainContainer}>
   
        
        
        <div className={styles.container}>
          {teachersArray.map((teacher, index) => (
            <Link key={index} to={`/findteachers/${teacher.id}`} className={styles.findTeacherComponent} >
              <FindTeacherComponent teacher={teacher} lastTeacherRef={index === teachersArray.length - 1 ? lastTeacherRef : null}  />
            </Link>
          ))}
        </div>
        {loading && <div className={styles.lodaMore}>Loading more data...</div>}

        </div>
    
 

  
      
    </div>

    </>
  );
}

export default FindTeachers;
