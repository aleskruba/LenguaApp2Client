import React, { useState, useRef, useEffect, useContext } from 'react';
import styles from './flagcomponent.module.css';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import BASE_URL from '../../config';






const MyComponent = () => {

  const {homelanguages} = useContext(AuthContext)
  
  const [isDragging, setIsDragging] = useState(false);
  const [showLeftIcon, setShowLeftIcon] = useState(false);
  const [showRightIcon, setShowRightIcon] = useState(true);
  const flagsRef = useRef(null);



  


  const flags = [
    { flag: 'uk.png', language: 'english', total: homelanguages?.totalEn },
    { flag: 'de.png', language: 'german', total: homelanguages?.totalDe },
    { flag: 'es.png', language: 'spanish', total: homelanguages?.totalSp },
    { flag: 'pt.png', language: 'portuguese', total: homelanguages?.totalPt },
    { flag: 'fr.png', language: 'french', total: homelanguages?.totalFr },
    { flag: 'cz.png', language: 'czech', total: homelanguages?.totalCZ },
  
  ];



  useEffect(() => {
    handleIcons();
  }, []);

  const handleIcons = () => {
    const flagsElement = flagsRef.current;

    const scrollVal = Math.round(flagsElement.scrollLeft);
    const maxScrollLabelWidth = flagsElement.scrollWidth - flagsElement.clientWidth;

    setShowLeftIcon(scrollVal > 0);
    setShowRightIcon(maxScrollLabelWidth > scrollVal + 1); // Add +1 to consider a small margin of error
  };

  const handleScroll = (scrollValue) => {
    const flagsElement = flagsRef.current;
    flagsElement.scrollLeft += scrollValue;
    handleIcons();
    setTimeout(() => handleIcons(), 50);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || e.buttons !== 1) return; // Check if mouse button is pressed
  
    const flagsElement = flagsRef.current;
    flagsElement.classList.add(styles.dragging);
    flagsElement.scrollLeft -= e.movementX;
    handleIcons();
  };
  

  const handleMouseUp = () => {
    setIsDragging(false);
    const flagsElement = flagsRef.current;
    flagsElement.classList.remove(styles.dragging);
  };

  return (


    <div className={styles.mainFlagDiv}>
    <div className={styles.wrapper}>
      {showLeftIcon && (
        <div className={styles.icon} id="left" onClick={() => handleScroll(-350)}>
             <div className={styles.Icon}>
                {"<"}
            </div>
        
        </div>
      )}
      <ul
        className={styles.flags}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={flagsRef}
      >
        {flags.map((element, index) => (
          <li key={index}>
            <div className={styles.flagBox}>
              <div className={styles.flagBoxLeft}>
                <div className={styles.flag}>
                     <img src={process.env.PUBLIC_URL + element.flag} className={styles.flagImg} alt="" />
              </div>
             </div>
             <div className={styles.flagBoxRight}>
               <div className={styles.flagBoxRightTop}>
                  {element.language}

                </div>
                <div className={styles.flagBoxRightBottom}>
              
                {element.total} teachers
              </div>
             </div>
            </div>
          </li>
        ))}
      </ul>
      {showRightIcon && (
        <div className={styles.icon} id="right" onClick={() => handleScroll(350)}>
                 <div className={styles.Icon}>
           {">"}
       </div>
        </div>
      )}
    </div>


    </div>
  );
};

export default MyComponent;
