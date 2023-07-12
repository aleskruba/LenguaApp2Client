import React, { useEffect, useState } from 'react';
import styles from './teachershomecomponent.module.css';
import axios from 'axios';

function TeachersHomeComponent() {
  const [teachersArray, setTeachersArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/teachers.json`);
        const data = response.data;
        setTeachersArray(data.teachers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 

  const calculateRowCount = () => {
    const containerWidth = window.innerWidth - 300; // Adjust the margin/padding as needed
    const boxWidth = 370; // Adjust the box width as needed
    const rowCount = Math.floor(containerWidth / boxWidth);
    return rowCount > 0 ? rowCount : 1;
  };

  return (
    <div className={styles.mainTeacherDiv}>
      <div className={styles.mainTeacherTextDiv}>Some of our teachers</div>

      <div
        className={styles.teacherPresentations}
        style={{ flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {teachersArray.length &&
          teachersArray.slice(0, calculateRowCount() * 2).map((element, index) => (
            <div
              className={styles.teacherBox}
              style={{
                display: index < calculateRowCount() * 2 ? 'flex' : 'none',
                margin: '10px',
              }}
              key={index}
            >
              <div className={styles.teacherBoxTop}>Video presentation</div>
              <div className={styles.teacherBoxBottom}>
                <div className={styles.teacherBoxName}>{element.firstName}</div>
                <div className={styles.teacherType}>{element.teacherType}</div>
                <div className={styles.teacherLanguage}>
                  {element.language} <span className={styles.teacherLanguageLevel}>|||||</span>
                </div>
                <div className={styles.teacherPriceText}>Lessons start from</div>
                <div className={styles.teacherPrice}>{element.tax}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default TeachersHomeComponent;
