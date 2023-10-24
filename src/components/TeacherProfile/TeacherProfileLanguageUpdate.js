

import React, { useState,useRef  } from 'react';
import TeacherLanguagesComponent from './TeacherLanguageComponent';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import styles from './teacherprofileupdatecomponent.module.css';

Modal.setAppElement('#root');

function TeacherProfileLanguageUpate({
  setUpdateLanguageButton,
  isOpen,
  setSelectedLanguages,
  selectedLanguages
}) {
  const [backendError, setBackendError] = useState('');
  const navigate = useNavigate();

  const previousSelectedLanguagesRef = useRef(selectedLanguages);


  const handleSubmit = () => {
    setBackendError('');
    if (JSON.stringify(selectedLanguages) !== JSON.stringify(previousSelectedLanguagesRef.current)) {
    //  console.log(selectedLanguages);
    }
    closeDialog();
  };

  const closeDialog = () => {
    navigate('/teacherzone');
    setUpdateLanguageButton(false);
  };

if (backendError) {console.log(backendError)}
  return (
    <Modal isOpen={isOpen} onRequestClose={closeDialog}>

      <div className={styles.TeacherLanguagesComponentDiv}> 
      <TeacherLanguagesComponent
        setSelectedLanguages={setSelectedLanguages}
        selectedLanguages={selectedLanguages}
      />

      <div className={styles.buttons}>
        <input
          type="submit"
          className={styles.updateBtn}
          value="Update"
          onClick={handleSubmit}
        />
        <input
          type="button"
          className={styles.closeBtn}
          onClick={closeDialog}
          value="Close"
        />
      </div>
      </div>
    </Modal>
  );
}

export default TeacherProfileLanguageUpate;

