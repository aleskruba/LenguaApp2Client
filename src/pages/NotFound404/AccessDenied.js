import React from 'react'
import styles from './notfound404.module.css';

function AccessDenied() {
  return (
    <div className={styles.container}>
      <div className={styles.errorLogo}>
          <a href="/"> <img  className={styles.errorLogo} src={process.env.PUBLIC_URL + '/logo.png'} alt=""/></a>
      </div>
      
    <h1 className={styles.errorHeadline}>
        Uh-oh!
    </h1>
    <h2 className={styles.errorHeadline2}>
                 It was a good try,  but no !!!!
    </h2>
    <h2 className={styles.errorHeadline2}>
                 You are not authorized to visit this page
    </h2>
      <img src={process.env.PUBLIC_URL + '/emoji2.png'} alt="" className={styles.errorEmoji}/>


    </div>
  )
}

export default AccessDenied