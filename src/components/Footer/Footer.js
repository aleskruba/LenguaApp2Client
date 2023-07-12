import React from 'react';
import styles from './footer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faVk, faYoutube } from '@fortawesome/free-brands-svg-icons';


function Footer() {
  return (
    <div className={styles.footerMain}>
         <ul className={styles.footerMainUL}>
          <li className={styles.lengua} >© 2023 Lengua</li>
          <div className={styles.footerMainULDiv}>
          <li>About us</li>
          <li>Careers</li>
          <li>Press</li>
          <li>Support</li>
          <li>Privacy</li>
          <li>Contact</li>
          </div>
         </ul>

         <ul className={styles.footerMainIconsUL}>
          <li><FontAwesomeIcon icon={faFacebook} className={styles.footerMainLI}/></li>
          <li><FontAwesomeIcon icon={faTwitter} className={styles.footerMainLI}/> </li>
          <li><FontAwesomeIcon icon={faInstagram} className={styles.footerMainLI}/></li>
          <li><FontAwesomeIcon icon={faYoutube} className={styles.footerMainLI}/></li>
          <li><FontAwesomeIcon icon={faVk} className={styles.footerMainLI}/></li>
          </ul>
       

       </div>

  );
}

export default Footer;