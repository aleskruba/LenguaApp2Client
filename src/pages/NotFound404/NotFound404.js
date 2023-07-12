import React from 'react'
import styles from './notfound404.module.css';

function NotFound404() {
  return (
    <div className={styles.container}>
      <div className={styles.errorLogo}>
          <a href="/"> <img  className={styles.errorLogo} src={process.env.PUBLIC_URL + '/logo.png'} alt=""/></a>
      </div>
      
    <h1 className={styles.errorHeadline}>
        Uh-oh!
    </h1>
    <h2 className={styles.errorHeadline2}>
        It could be you, or it could be us, but there's no page here.
    </h2>
    <h2 className={styles.errorHeadline2}>
        Probably it is a 404 error. &nbsp;&nbsp;  It means the page does not exist.
    </h2>
      <img src={process.env.PUBLIC_URL + '/emoji.png'} alt="" className={styles.errorEmoji}/>


    </div>
  )
}

export default NotFound404