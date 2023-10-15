import React from 'react'
import styles from './firstpage.module.css'; 

function FirstPage() {
  return (
    <div className={styles.mainContainer}>
        <div className={styles.container}>
            <div className={styles.topText}>Welcome to lengua App</div>
            <div className={styles.topTextWait}>Wait please ....</div>
                <div className={styles.box}>
                    <div className={styles.card} id={styles.front}>
                        <div className={styles.cardInner}>
                          <img src={process.env.PUBLIC_URL + '/uk.png'} className={styles.flag}/>
                         </div>
                      </div>
                    
                    <div className={styles.card} id={styles.back}>
                    <div className={styles.cardInner}>
                          <img src={process.env.PUBLIC_URL + '/es.png'} className={styles.flag}/>
                         </div>
                    </div>
                    
                    <div className={styles.card} id={styles.left}>
                    <div className={styles.cardInner}>
                          <img src={process.env.PUBLIC_URL + '/pt.png'} className={styles.flag}/>
                         </div>
                    </div>
                    
                    <div className={styles.card} id={styles.right}>
                    <div className={styles.cardInner}>
                          <img src={process.env.PUBLIC_URL + '/fr.png'} className={styles.flag}/>
                         </div>
                    </div>
                    
                    <div className={styles.card} id={styles.top}>
                    <div className={styles.cardInner}>
                          <img src={process.env.PUBLIC_URL + '/de.png'} className={styles.flag}/>
                         </div>
                    </div>
                    
                    <div className={styles.card} id={styles.bottom}>
                    <div className={styles.cardInner}>
                          <img src={process.env.PUBLIC_URL + '/cz.png'} className={styles.flag}/>
                         </div>
                    </div>

                </div>
            <div className={styles.bottomText}>The new way the world learns foreign languages.</div>
        </div>
    </div>
  )
}

export default FirstPage