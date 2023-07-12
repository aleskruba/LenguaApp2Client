import React, { useState } from 'react';
import styles from './test.module.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import EnglishTest from '../../components/Tests/EnglishTest';
import SpanishTest from '../../components/Tests/SpanishTest';
import GermanTest from '../../components/Tests/GermanTest';


Modal.setAppElement('#root');

function Test() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const navigate = useNavigate();

  const closeDialog = () => {
    setIsOpen(false);
    navigate('/test');
  };

  const openTestModal = (test) => {
    setSelectedTest(test);
    setIsOpen(true);
  };


  
  return (
    <>
      <div className={styles.testMainContainer}>
        <div className={styles.testTopContainer}>
          <div className={styles.titleDiv}>
            <h1 className={styles.titleH1}>Test your language skills</h1> 
            
         
        
          </div>
        
        <div className={styles.testMainContainerOptions}>
          <div className={styles.titleDiv}>
          <h2 className={styles.titleH2}> Choose your language  </h2> 
          </div>
          <div className={styles.testMainContainerOption} onClick={() => openTestModal('english')}>
             English 
              <div className={styles.testMainContainerOptionFlag}>
                     <img src="/uk.png" alt="" className={styles.flag} />
              </div>
          </div>
          <div className={styles.testMainContainerOption} onClick={() => openTestModal('german')}>
            German
            <div className={styles.testMainContainerOptionFlag}>
                     <img src="/de.png" alt="" className={styles.flag} />
              </div>
          </div>
          <div className={styles.testMainContainerOption} onClick={() => openTestModal('spanish')}>
            Spanish
            <div className={styles.testMainContainerOptionFlag}>
                     <img src="/es.png" alt="" className={styles.flag} />
              </div>
          </div>

         
        </div>
        </div>




        <div className={styles.element}>

          <div className={styles.elementText}>
           <h2 className={styles.elementH2}>Language training solutions</h2>

          <h3 className={styles.elementH3}>When discussing needs comprehensively</h3>
          </div>

        </div>

        <div className={styles.learningtips}>
            <h2>5 Ways to Improve Learning at Home</h2>
            <ul>
              <li>Set a dedicated study area with minimal distractions.</li>
              <li>Create a consistent study schedule and stick to it.</li>
              <li>Take regular breaks to prevent fatigue and maintain focus.</li>
              <li>Utilize online resources and interactive learning tools.</li>
              <li>Engage in discussions and seek additional learning opportunities.</li>
            </ul>
          </div>

      </div>

      <Modal isOpen={isOpen} onRequestClose={closeDialog}>
        <input type="button" className={styles.closeBtn} onClick={closeDialog} value="Leave this test" />
        {selectedTest === 'english' && <EnglishTest setIsOpen={setIsOpen} />}
        {selectedTest === 'spanish' && <SpanishTest setIsOpen={setIsOpen} />}
        {selectedTest === 'german' && <GermanTest setIsOpen={setIsOpen} />}
      </Modal>
      
    </>
  );
}

export default Test;