import React, { useContext, useEffect, useState } from 'react';
import styles from './home.module.css';
import FlagComponent from '../../components/Home/FlagComponent';
import RankingHomeComponent from '../../components/Home/RankingHomeComponent';
import TeachersHomeComponent from '../../components/Home/TeachersHomeComponent';
import Footer from '../../components/Footer/Footer';
import ScrollerBarComponent from '../../components/Home/SrollerBarComponent';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthContext from '../../context/AuthProvider';

function Home() {

const {currentUser} = useContext(AuthContext)


  return ( 
    <div className={styles.homeContainer}>
  <div className={styles.homeMainDiv}>

       <div className={styles.homeLeftDiv}>

    <div className={styles.homeLeftComponentDiv}>
          <div>
            <h1 className={styles.homeLeftDivH1}>Become fluent in any language</h1>

     
                <ul className={styles.homeLeftDivUL}>
                  <li>Take customizable 1-on-1 lessons trusted by millions of users</li>
                  <li>Learn from certified teachers that fit your budget and schedule</li>
                  <li>Connect with a global community of language learners</li>
                </ul>
              
           <Link to="/login"><div className={styles.startButton}>Start now</div></Link>
            </div>

        </div>
     </div>

       <div className={styles.homeRightDiv}>
       <img src={process.env.PUBLIC_URL + '/italki.jpg'} alt="" className={styles.italkiImg} />

       </div>
  </div>

  <FlagComponent/>
  <RankingHomeComponent/>
    <TeachersHomeComponent/>
    <ScrollerBarComponent/>
    <Footer/>

</div>
  )
}

export default Home;