import React, { useState, useEffect,useRef  } from 'react';
import styles from './teacherprofile.module.css';
import { Link,useParams,useNavigate,useLocation } from 'react-router-dom';
import ReviewBoxComponent from '../../components/FindTeacher/ReviewBoxComponent';
import Modal from 'react-modal';
import FirstMessageComponent from '../../components/FirstMessage.js/FirstMessageComponent';



Modal.setAppElement('#root');

function TeacherProfile() {
  const [showHeader, setShowHeader] = useState(false);
  const reviewsRef = useRef(null); // Step 2: Create a ref
  const availabilityRef = useRef(null); // Step 2: Create a ref
  const aboutMeRef = useRef(null); // Step 2: Create a ref

  
  
  const location = useLocation();
  const { teacher,lessons } = location.state; 



  let { idTeacher } = useParams();


  
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
  }, []);

  let count=0 ;

  lessons?.map((lesson,index)=>{ 
    if(lesson.idTeacher == teacher._id ) {
      count ++
    }
    return count 
  })


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

const navigate = useNavigate()
  const goBackToTeachers = () => {
    navigate('/findteachers', { state: { teacher, lessons } })
  };

  
  return (
    
    <div className={styles.mainTeacherContainer} style={isOpen ? {display:'none'}: {display:'flex'}}>

    {showHeader && <div className={styles.header}>
      <nav className={styles.navbar}>
            <ul className={styles.leftUl}>
                <li className={styles.leftLi}>
                <img src={teacher?.profile} alt="" className={styles.logoImg} />
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
                      <img src={teacher?.profile} alt="" className={styles.Img} />
                </div>

                <div className={styles.mainTeacherProfileBoxLeftLessonsDiv}>
                      <h5 className={styles.mainTeacherProfileBoxLeftLessonsDivh5}>{count} lessons</h5>
                </div>

             </div>
              <div className={styles.mainTeacherProfileBoxRight}>
                  <div className={styles.name}>
                     <h1 className={styles.nameH1}>{teacher?.firstName} {teacher?.lastName}</h1> 
                  </div>
                  <div className={styles.teacherType}>
                       <h1 className={styles.teacherTypeH1}>{teacher?.teacherType}</h1> 
                  </div>
                  <div className={styles.language}>
                      <h1 className={styles.languageH1}>  Teaches: {teacher?.teachlanguages.map((lan, index) => (
                      <span key={index}>{lan.language} </span>
                    ))}</h1> 
                         </div>


            </div>
 
           </div>

           <div className={styles.aboutMe}>
       {teacher?.profileText}   </div>
  
  
        </div>

        <div className={styles.mainTeacherProfileAvailability} ref={availabilityRef}>
          <h1 className={styles.mainTeacherProfileAvailabilityH1}>Check Availability and book lesson</h1>
  
        <div className={styles.booklessondiv}>

                  
 
          <div className={styles.bookButton} onClick={()=> setIsOpen(true)}>Contact Teacher</div>
        
          <Link to={`/findteachers/${idTeacher}/schedulestudent`}>
          <div className={styles.bookButton} >Book lesson</div>
          </Link>
      
       </div>
        
        </div>
    
      <div ref={reviewsRef}>
      <ReviewBoxComponent  lessons={lessons} teacher={teacher}/>
      </div>
    
        </div>
    



      <div className={styles.mainTeacherProfileRight}>
 
      <button className={styles.backButton} onClick={goBackToTeachers}>back to teachers</button>
 
          <iframe
                className={styles.iframeVideo}
                src={`https://www.youtube.com/embed/${teacher?.profileVideo}`}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen={true} // Use camelCase attribute name
                title="Teacher Video"
                muted // Mute the video
              ></iframe>

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
