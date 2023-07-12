import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import styles from './firstmessagecomponent.module.css';

const validationSchema = Yup.object({
  language: Yup.string().required('You must choose a language'),
  level: Yup.string(),
  preferences: Yup.array().of(Yup.string()),
  message: Yup.string().max(300, 'Message must be at most 300 characters'),
});

  const initialValues = {
    language: '',
    level: '',
    preferencies: [],
    message: '',
  };
  

  const teacherLanguages = ['english','german']
  
  const preferenciesArray = ['Hobby','Daily Life', 'Travel','Food','Health','Entertainment','Test Preparation','Family','Business']
  
  const levels = ['A1','A2','B1','B2','C1','C2']
  

function FirstMessageComponent({setIsOpen,isOpen,openTestModal,closeDialog}) {
    
    const [backendError, setBackendError] = useState('');

    const navigate = useNavigate();

    const onSubmit = (values) => {
      console.log(values)
      closeDialog()
      navigate('/studentmessages')
     };

  return (
    <div className={styles.modalMainDiv}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form >

     <div className={styles.languageDiv}>
        <h1 className={styles.languageH1}>What language do you want to learn with me?</h1>
        <div className={styles.languagesOptions}>

        {teacherLanguages.map((language, index) => (
                <label key={index} className={styles.languagesOption}>
                  <Field type="radio" name="language" value={language} />
                  <span className={styles.languagesOptionSpan}>{language}</span>
                </label>
              ))}
     

        </div>
     </div>

     <div className={styles.levelDiv}>
     <div className={styles.levelInnerDiv}>
            <h1 className={styles.levelH1}>What is your language level?</h1>
            <div className={styles.levelSlider}>
              {levels.map((level, index) => (
                <label key={index} className={styles.levelCircle}>
                  <Field type="radio" name="level" value={level} />
                  <span className={styles.levelCirclespan}>{level}</span>
                </label>
              ))}
            </div>
          </div>
          </div>

     <div className={styles.preferencies}>
         <h1 className={styles.preferenciesH1}>Why do you want to learn this language？</h1>  
         <div className={styles.preferenciesOptions}>

         {preferenciesArray.map((pref, index) => (
                <label key={index} className={styles.preferenciesOption}>
                  <Field type="checkbox" name="preferencies" value={pref} />
                  <span className={styles.preferenciesOptionSpan}>{pref}</span>
                </label>
              ))}
        </div>      
     </div>

     <div className={styles.questionsDiv}>
        <h1 className={styles.questionsH1}>Feel free to ask me any questions</h1>  

        <Field
                      as="textarea" // Use textarea instead of input
                      name="message"
                      id="message"
                      placeholder="Your question"
                      autoComplete="off"
                      className={styles.questionInputContainer}
                      maxLength='1200'
                    />
 
     </div>

     <div className={styles.buttons}>
        <button className={styles.sendbutton} type="submit" >Send</button>
        <button className={styles.cancelbutton} onClick={closeDialog}>Cancel</button>
     </div>
     
     <div>
     <ErrorMessage name="language" component="div">
                {(errorMsg) =>
                  backendError ? (
                    <div className={styles.ErrorContainer}>{backendError.message}</div>
                  ) : (
                    <div className={styles.ErrorContainer}>{errorMsg}</div>
                  )
                }
              </ErrorMessage>

       <ErrorMessage name="message" component="div">
                {(errorMsg) =>
                  backendError ? (
                    <div className={styles.ErrorContainer}>{backendError.message}</div>
                  ) : (
                    <div className={styles.ErrorContainer}>{errorMsg}</div>
                  )
                }
           </ErrorMessage>


     </div>
   
      </Form>
    </Formik>
    </div>
  )
}

export default FirstMessageComponent