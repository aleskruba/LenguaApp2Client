import React, { useEffect, useState } from 'react';
import styles from './forgottenPasswords.module.css';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import BASE_URL from '../../config';


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
    const [code,setCode] = useState('')
    const [email,setEmail] = useState('')
    const [wrongOtp,setWrongOtp] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [errorMessageEmail, setErrorMessageEmail] = useState(false)
    const [sendedOtp,setSendedOtp] =  useState(true)
  

    axios.defaults.withCredentials = true;

    const [emailSOS,setemailSOS] = useState()

    const onSubmit = async (values) => {
      setBackendError('');
      console.log(values.email);
      setemailSOS(values.email)
    
      try {

        const url = `${BASE_URL}/fpassword`;
        const data = {
          email: values.email
              };
    
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Set the withCredentials option to true
        };
    
        const response = await axios.post(url, data, config);
        const responseData = response.data;


        if (responseData.status) {
          console.log(responseData.status);
          setSendedOtp(false);
          setEmail(values.email);
          values.email = ''; // Clear the email field directly
          setWrongOtp(false);
    
         }
    
        if (responseData.error) {
          console.log(responseData.error);
        }
      } catch (err) {
          if (err.response.status === 404);
           {setBackendError('This email is not registred')
      }

      }
    };
    
    
    

    const closeDialog = () => {
      setIsOpen(false);
      navigate('/');
    };

    const  handleCode = async (e) => {
      setCode(e.target.value)
      }
  




      const submitCode = async (e) => {
        e.preventDefault();
        console.log('code:', code);
      
        try {
          const url = `${BASE_URL}/verifyOTP`;
              const data = {
                code: code ,
              };

              const config = {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true, // Set the withCredentials option to true
              };

              const response = await axios.post(url, data, config);
              const responseData = response.data;
              console.log(responseData.message)
                  if (responseData.message === 'OTP verified successfully!') {
        // Navigate to the resetpassword page if OTP is verified
        navigate("/resetpassword", {
          state: { email: emailSOS }, // Pass the email in the location state
        });
      } else {
        alert('Invalid OTP or session expired.');
      }
    } catch (error) {
        setErrorMessage(true)
        console.log(error.response.status)
        if (error.response.status === 401) {
            console.log('Invalid OTP or session expired.')
        }
    }
  };
      


   
    return (
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Modal isOpen={isOpen} onRequestClose={closeDialog}>
        {sendedOtp ? (
          // Render the form for entering the email and sending OTP
          <>
            <h1 className={styles.title}>Did you forget the password ?</h1>
            <p className={styles.text}>Please enter your email address below so we can send you a link to reset your password</p>
            <Form className={styles.loginForm}>
           { wrongOtp ?  <div className={styles.WrongOTP}>Invalid OTP amigo</div> : ''}
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
                  <Link to="/signup" className={styles.alogin}>Sign Up here</Link>{' '}
                </span>
              </div>
            </Form>
          </>
        ) : (
          // Render the form for entering the OTP
          <>
            <Form className={styles.loginForm}>
              <p className={styles.text}>We sent you an email! Please enter OTP</p>
              {errorMessage ?<div style={{color:'red'}}>Invalid OTP or session expired.</div>: ''}
              <div className={styles.emailInputContainer}>
                <input name="otp" type="text" id="otp" placeholder="otp" autoComplete="off" onChange={handleCode}/>
              </div>
              <div>
                <input type="button" className={styles.sendBtn} value="Send" onClick={submitCode}/>
              </div>
            </Form>
          </>
        )}
      </Modal>
    </Formik>
  );
  }
export default ForgottenPassword;