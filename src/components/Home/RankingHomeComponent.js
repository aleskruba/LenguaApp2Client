import React from 'react'
import styles from './rankinghomecomponent.module.css';

function RankingHomeComponent() {
  return (
    <div className={styles.mainDiv}>
        <div>
        Our customers say <span className={styles.mainExcellent}>Excellent</span>
        </div>
            <img src={process.env.PUBLIC_URL + './star.svg'} alt="" className={styles.svgImg}/>
            <span>4.7 out of 5 based on 12,165 reviews</span>
            <img src={process.env.PUBLIC_URL + './trust.png'} alt="" className={styles.trust}/>
    </div>
  )
}

export default RankingHomeComponent