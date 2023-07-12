import React, { useState } from 'react';
import styles from './forgottenPasswords.module.css';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

Modal.setAppElement('#root');

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Required!')
    .email('Invalid email format')
    .max(50, 'Email must be at most 50 characters')
});

const initialValues = {
  email: '',
};


function ForgottenPassword() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [backendError, setBackendError] = useState('');
  
  
    const onSubmit = (values) => {
      setBackendError('');
      console.log(values);
    
    
     
    };
    const closeDialog = () => {
      setIsOpen(false);
      navigate('/');
    };
  
    return (
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Modal isOpen={isOpen} onRequestClose={closeDialog}>
          <h1 className={styles.title}>Did you forget the password ?</h1>
          <p className={styles.text}>Please enter your email address below so we can send you a link to reset your password</p>
          
          <Form className={styles.loginForm}>
            <div className={styles.emailInputContainer}>
              <Field name="email" type="email" id="email" placeholder="Email" autoComplete="off" />
            </div>
            <ErrorMessage name="email" component="div">
              {(errorMsg) =>
                backendError ? (
                  <div className={styles.emailErrorContainer}>{errorMsg}</div>
                ) : (
                  <div className={styles.emailErrorContainer}>{errorMsg}</div>
                )
              }
            </ErrorMessage>
            {backendError && <div className={styles.emailErrorContainer}>{backendError}</div>}
  
           
        <div className={styles.buttons}>
          <input type="submit" className={styles.sendBtn} value="Send" />
          <input
            type="button"
            className={styles.closeBtn}
            onClick={closeDialog}
            value="Close"
          />
        </div>
  
    
        <div>
          <span className={styles.loginSpan}>
            <Link to="/login" className={styles.alogin}>Login here</Link>{' '}
          </span>
        </div>
        <div>
          <span className={styles.loginSpan}>
            <Link to="/signup"  className={styles.alogin}>Sign Up here</Link>{' '}
          </span>
        </div>
      </Form>
    </Modal>
  </Formik>
  );
  }
export default ForgottenPassword;