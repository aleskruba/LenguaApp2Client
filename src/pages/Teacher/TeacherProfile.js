import React, { useState, useEffect,useRef  } from 'react';
import styles from './teacherprofile.module.css';
import { Link,useNavigate } from 'react-router-dom';
import ReviewBoxComponent from '../../components/FindTeacher/ReviewBoxComponent';
import Modal from 'react-modal';
import FirstMessageComponent from '../../components/FirstMessage.js/FirstMessageComponent';

Modal.setAppElement('#root');

function TeacherProfile() {
  const [showHeader, setShowHeader] = useState(false);
  const reviewsRef = useRef(null); // Step 2: Create a ref
  const availabilityRef = useRef(null); // Step 2: Create a ref
  const aboutMeRef = useRef(null); // Step 2: Create a ref

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
      setIsOpen(false);
    };
  
    const openTestModal = (test) => {
       setIsOpen(true);
         };

  useEffect(() => {
    const handleScroll = () => {
      const scrolledY = window.scrollY;
      setShowHeader(scrolledY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleReviewsClick = () => {
    const offset = 150; // Desired offset value
    const elementTop = reviewsRef.current.getBoundingClientRect().top;
    const offsetTop = elementTop + window.pageYOffset - offset;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };

  const handleAboutMeClick = () => {
    const offset = 10; // Desired offset value
      const elementTop = aboutMeRef.current.getBoundingClientRect().top;
    const offsetTop = elementTop + window.pageYOffset - offset;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };

  const availabilityClick = () => {
    const offset = 150; // Desired offset value
      const elementTop = availabilityRef.current.getBoundingClientRect().top;
    const offsetTop = elementTop + window.pageYOffset - offset;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  };




  return (
    <div className={styles.mainTeacherContainer} style={isOpen ? {display:'none'}: {display:'flex'}}>

    {showHeader && <div className={styles.header}>
      <nav className={styles.navbar}>
            <ul className={styles.leftUl}>
                <li className={styles.leftLi}>
                <img src={process.env.PUBLIC_URL + '/man.jpg'} alt="" className={styles.logoImg} />
                </li>
            </ul>

            <ul className={styles.centerUl}>
            <li>
                  <Link to="#" onClick={handleAboutMeClick}>About Me</Link>
                </li> 
                  <li>
                  <Link to="#" onClick={availabilityClick}>Availability</Link>
                </li>
                <li>
                  <Link to="#" onClick={handleReviewsClick}>Reviews</Link>
                </li>
            </ul>
      </nav>

    </div>}
    
    <div className={styles.mainTeacherProfile}>

      <div className={styles.mainTeacherProfileLeft}>

        <div className={styles.mainTeacherProfileMainBox} ref={aboutMeRef}>
           <div className={styles.mainTeacherProfileBox}>
            < div className={styles.mainTeacherProfileBoxLeft}>

                <div className={styles.mainTeacherProfileBoxLeftImgDiv}>
                      <img src={process.env.PUBLIC_URL + '/man.jpg'} alt="" className={styles.Img} />
                </div>

                <div className={styles.mainTeacherProfileBoxLeftLessonsDiv}>
                      <h5 className={styles.mainTeacherProfileBoxLeftLessonsDivh5}>129 lessons</h5>
                </div>

             </div>
              <div className={styles.mainTeacherProfileBoxRight}>
                  <div className={styles.name}>
                     <h1 className={styles.nameH1}>Petr Novak</h1> 
                  </div>
                  <div className={styles.teacherType}>
                       <h1 className={styles.teacherTypeH1}>Tutor</h1> 
                  </div>
                  <div className={styles.language}>
                      <h1 className={styles.languageH1}>  Teaches: english</h1> 
                         </div>


            </div>
    
           </div>

           <div className={styles.aboutMe}>
           Hi, my name is Caroline and I am from Cape Town, South Africa. Therefore I am a native ENGLISH speaker. I am a TEFL Certified teacher with more than 15 years of experience.
            I currently live in Cape Town, I have been here all my life and I teach English at a private nursery.
            I have explored South Africa and lots of areas within our country, but there is so much still to see and I have a wish list to visit other countries later on. 
            My main hobby is arts (my personal favorite) but I also thoroughly enjoy reading, cycling and socializing.
            Living beside the sea lets me enjoy the outdoor lifestyle and I love spending time camping in the surrounding area.          
           </div>
        </div>

        <div className={styles.mainTeacherProfileAvailability} ref={availabilityRef}>
          <h1 className={styles.mainTeacherProfileAvailabilityH1}>Check Availability and book lesson</h1>
  
        <div className={styles.booklessondiv}>

                  
 
          <div className={styles.bookButton} onClick={()=> setIsOpen(true)}>Contact Teacher</div>
        
        <Link to="/schedulestudent">
          <div className={styles.bookButton} >Book lesson</div>
          </Link>
      
      \ </div>
        
        </div>
    
      <div ref={reviewsRef}>
      <ReviewBoxComponent />
      </div>
    
        </div>
    
      <div className={styles.mainTeacherProfileRight}>
        <div className={styles.mainTeacherProfileVideo}>
         <h1>Video component</h1>
        </div>
      </div>

    </div>

    <div className={styles.modalMainDivProfile}>
      <Modal isOpen={isOpen} onRequestClose={closeDialog}>

          <FirstMessageComponent isOpen={isOpen}
                              openTestModal={openTestModal}
                              closeDialog={closeDialog}
                              setIsOpen={setIsOpen} />
      </Modal>
      </div>
    </div>
  );
}

export default TeacherProfile;
