import React, { useContext, useState,useEffect } from 'react';
import styles from './login.module.css';
import { Link ,Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
    .max(50, 'Password must be at most 50 characters'),
});

const initialValues = {
  email: '',
  password: '',
};


function Login() {

  const {auth, setAuth,setUserDataFetched } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.user) {
      navigate('/');
    }
  }, [auth]);


  const [isOpen, setIsOpen] = useState(true);
  const [backendError, setBackendError] = useState('');


  const onSubmit = async (values) => {
    setBackendError('');
    try {
      const url = `${BASE_URL}/login`;
      const data = {
        email: values.email,
        password: values.password,
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };
  
      const response = await axios.post(url, data, config);
      const responseData = response.data;
  
      if (responseData.user && responseData.accessToken && responseData.refreshToken) {
        // Update the user context with the received data
        setAuth(responseData.user, {
          jwt: responseData.accessToken,
          refreshToken: responseData.refreshToken,
        });
        setUserDataFetched(true);
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setBackendError(err.response.data.message);
      } else {
        setBackendError('Email or password is invalid.');
      }
    }
  };
  
  
  
  const closeDialog = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Modal isOpen={isOpen} onRequestClose={closeDialog}>
        <h1 className={styles.title}>Login</h1>
        <Form className={styles.loginForm}>
          <div className={styles.emailInputContainer}>
            <Field name="email" type="email" id="email" placeholder="Email" autoComplete="off" className={styles.loginEmail}/>
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

          <div className={styles.passwordInputContainer}>
            <Field
              name="password"
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
              className={styles.loginPassword}
            />
          </div>

          <ErrorMessage name="password" component="div">
            {(errorMsg) =>
              backendError ? (
                <div className={styles.passwordErrorContainer}>{errorMsg}</div>
              ) : (
                <div className={styles.passwordErrorContainer}>{errorMsg}</div>
              )
            }
          </ErrorMessage>
          {backendError && <div className={styles.passwordErrorContainer}>{backendError}</div>}

      <div className={styles.buttons}>
        <input type="submit" className={styles.loginBtn} value="Login" />
        <input
          type="button"
          className={styles.closeBtn}
          onClick={closeDialog}
          value="Close"
        />
      </div>

  
      <div>
        <span className={styles.loginSpan}>
          No account yet? <Link to="/signup" className={styles.alogin}>Sign Up here</Link>{' '}
        </span>
      </div>
      <div>
        <span className={styles.loginSpan}>
          Forgot password?<Link to="/forgottenpassword" className={styles.alogin}>Click here</Link>{' '}
        </span>
      </div>
    </Form>
  </Modal>
</Formik>
);
}

export default Login;