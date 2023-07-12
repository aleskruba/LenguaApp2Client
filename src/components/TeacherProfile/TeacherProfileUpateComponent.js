

import React,{useEffect, useState} from 'react'
import  styles from './teacherprofileupdatecomponent.module.css'
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';

    Modal.setAppElement('#root');

const validationSchema = Yup.object({
 
  tax: Yup.number()
     .typeError('Tax must be a number')
     .max(30,'Maximum allowed hourly Tax is $30'),
  presentation: Yup.string()
    .max(1200, 'Presentation must be at most 1200 characters'),
  videoPresentation: Yup.string()
    .max(30, 'Video code must be at most 30 characters')
  
});



function TeacherProfileUpateComponent({ setUpdateButton, isOpen,setUpdatedData,updatedData,setIsOpen}) {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState('');
  const [noChanges, setNoChanges] = useState(false);

  const initialValues = {
    tax: updatedData !== null ? updatedData.tax : '',
    presentation: updatedData !== null ? updatedData.presentation : '',
    videoPresentation: updatedData !== null ? updatedData.videoPresentation : '',
  };

  const onSubmit = (values, { resetForm }) => {
    setBackendError('');
    if (isFormChanged(values)) {
      const updatedFields = {};
  
      Object.keys(values).forEach((fieldName) => {
        if (values[fieldName] !== initialValues[fieldName]) {
          updatedFields[fieldName] = values[fieldName];
        }
      });
  
      setUpdatedData((prevData) => ({
        ...prevData,
        ...updatedFields,
      }));
      setIsOpen(false)
      closeDialog();
    } else {
      setNoChanges(true);
      setTimeout(() => {
        setNoChanges(false);
      }, 3000);
    }
  };
  



  const closeDialog = () => {
    navigate('/teacherzone');
    setIsOpen(false)
    setUpdateButton(false);
  };

  const isFormChanged = (values) => {
    return (
      values.tax !== initialValues.tax ||
      values.presentation !== initialValues.presentation ||
      values.videoPresentation !== initialValues.videoPresentation
    );
  };

  return (

           <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    <Modal isOpen={isOpen} onRequestClose={closeDialog}>
                       <Form className={styles.profileForm}>
               
       
                       <Field
                          name="tax"
                          type="text"
                          id="tax"
                          placeholder="Hourly Tax"
                          autoComplete="off"
                          className={styles.taxInputContainer}
                          inputMode="decimal"
                          maxLength={2}
                        />
       
               
                <ErrorMessage name="tax" component="div">
                  {(errorMsg) =>
                    backendError ? (
                      <div className={styles.taxErrorContainer}>{errorMsg}</div>
                    ) : (
                      <div className={styles.taxErrorContainer}>{errorMsg}</div>
                    )
                  }
                </ErrorMessage>
                {backendError && <div className={styles.taxErrorContainer}>{backendError}</div>}



           
                <Field
                      as="textarea" // Use textarea instead of input
                      name="presentation"
                      id="presentation"
                      placeholder="Presentation"
                      autoComplete="off"
                      className={styles.presentationInputContainer}
                      maxLength='1200'
                    />
     
              
              <ErrorMessage name="presentation" component="div">
                {(errorMsg) =>
                  backendError ? (
                    <div className={styles.presentationErrorContainer}>{errorMsg}</div>
                  ) : (
                    <div className={styles.presentationErrorContainer}>{errorMsg}</div>
                  )
                }
              </ErrorMessage>
              {backendError && <div className={styles.presentationErrorContainer}>{backendError}</div>}

                  <Field name="videoPresentation"
                         type="text" 
                         id="videoPresentation" 
                         placeholder="Video Presentation" 
                         autoComplete="off" 
                         className={styles.videoPresentationInputContainer}
                         maxLength='30'
                         />
              
              <ErrorMessage name="videoPresentation" component="div">
                {(errorMsg) =>
                  backendError ? (
                    <div className={styles.videoPresentationErrorContainer}>{errorMsg}</div>
                  ) : (
                    <div className={styles.videoPresentationErrorContainer}>{errorMsg}</div>
                  )
                }
              </ErrorMessage>
              {backendError && <div className={styles.videoPresentationErrorContainer}>{backendError}</div>}
                     
        

            <div className={styles.buttons}>
              <input type="submit" className={styles.updateBtn} value="Update" />
              <input
                type="button"
                className={styles.closeBtn}
                onClick={closeDialog}
                value="Close"
              />
            </div>
            {noChanges && <div className={styles.noChangesMessage}>No changes, you cannot update!</div>}

       {/*            <h1>TEST SCRIPT INJECTION</h1>
                  <h1>TAX : {submitValues.tax &&  submitValues.tax}</h1>
                  <h1>PRESENTATION : {submitValues.presentation && submitValues.presentation}</h1>
                  <h1>VIDEO PRESENTATION : {submitValues.videoPresentation && submitValues.videoPresentation}</h1> */}

          </Form>
          </Modal>
       
  </Formik>
 

  )
}

export default TeacherProfileUpateComponent
