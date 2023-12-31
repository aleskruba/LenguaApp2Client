import React, { useState,useContext,useEffect } from 'react';
import styles from './signup.module.css';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Formik ,Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'
import axios from 'axios';
import AuthContext from '../../context/AuthProvider';
import BASE_URL from '../../config';

Modal.setAppElement('#root');


const validationSchema = Yup.object({ 
  email: Yup.string()
    .required('Required!')
    .email('Invalid email format')
    .max(50, 'Email must be at most 50 characters'),
  password: Yup.string()
    .required('Required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
    ),
   
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required')
});


const initialValues = {
  email:'',
  password:'',
  confirmPassword:''
}

const profile = 'avatar.png'

function SignUp() {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [backendError, setBackendError] = useState('');


  const {auth} = useContext(AuthContext);

  useEffect(() => {
    if (auth.user) {
      navigate('/');
    }
  }, [auth]);


  const onSubmit = async (values) => {
    setBackendError('');
    console.log(values);
    
    try {
      const url = `${BASE_URL}/signup`
      const data = {
        email: values.email,
        password: values.password,
        profile,
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const res = await axios.post(url, data, config);
      const responseData = res.data;
      console.log(responseData);
  
      if (responseData.message) {
        // Handle specific error messages
        setBackendError(responseData.message);
      }
      if (responseData.user) {
        // Redirect to a different page if the user property exists in the response data
        navigate('/');
      }
    } catch (err) {
      console.log(err);
      setBackendError('An error occurred while signing up.');
    }
  };
  

  const closeDialog = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}>
      <Modal isOpen={isOpen} onRequestClose={closeDialog}>
        <h1 className={styles.title}>Sign Up</h1>
        <Form className={styles.registerForm} >
        <div className={styles.emailInputContainer}>
          <Field
            name="email"
            type="email"
            id="email"
            placeholder='Email'
            autoComplete="off"
            className={styles.signUpEMail}

             />  </div>
          <ErrorMessage name='email' component='div' >
          {
              (errorMsg => 
              
                backendError ? 
                    <div className={styles.emailErrorContainer}>{errorMsg}</div> 
                      :
                     <div className={styles.emailErrorContainer}>{errorMsg}</div>
              
              )
            }
            </ErrorMessage>     
            {backendError && (
          <div className={styles.emailErrorContainer}>{backendError}</div>
        )}
        

      <div className={styles.passwordInputContainer}>
             <Field
              name="password"
              type="password"
              id="password"
              placeholder='Password'
              autoComplete="off"
              className={styles.signUpPassword}
                /> </div>

          <ErrorMessage name='password' component='div' >  
          {errorMsg => (
                backendError ? 
                    <div className={styles.passwordErrorContainer}>{errorMsg}</div> 
                      :
                     <div className={styles.passwordErrorContainer}>{errorMsg}</div>
              )}
             </ErrorMessage> 
             {backendError && (
            <div className={styles.passwordErrorContainer}>{backendError}</div>
          )}

             <div className={styles.passwordInputContainer}>
             <Field
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder='Confirm Password'
              autoComplete="off"
                /> </div>

          <ErrorMessage name='confirmPassword' component='div' >  
          {errorMsg => (
                backendError ? 
                    <div className={styles.passwordErrorContainer}>{errorMsg}</div> 
                      :
                     <div className={styles.passwordErrorContainer}>{errorMsg}</div>
              )}
             </ErrorMessage> 
          
          <div className={styles.buttons}>
            <input type="submit" className={styles.registerBtn} value="Sign Up" />
            <input
              type="button"
              className={styles.closeBtn}
              onClick={closeDialog}
              value="Close"
            />
          </div>
          <div>
            <span className={styles.registerSpan}>
              Already account? <Link to="/login" className={styles.alogin}>Login here</Link>{' '}
            </span>
          </div>
        </Form>

      </Modal>
    </Formik>
  );
}

export default SignUp;