import React,{useState} from 'react'
import  styles from './profilechangepassword.module.css'
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-modal';



    Modal.setAppElement('#root');

const validationSchema = Yup.object({
  oldPassword: Yup.string()
  .required('Required')
  .min(6, 'Password must be at least 6 characters')
  .max(50, 'Password must be at most 50 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one digit'
  ),
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
  oldPassword: '',
  password:'',
  confirmPassword:'',
};

function ProfileChangePassword({setPasswordButton}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [backendError, setBackendError] = useState('');

 

  const onSubmit = (values) => {
    setBackendError('');
    console.log(values)
    setIsOpen(false)
    closeDialog()
   };

   const closeDialog = () => {
    setIsOpen(false);
    navigate('/profile');
    setPasswordButton(false)
  };


  return (
           <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    <Modal isOpen={isOpen} onRequestClose={closeDialog} >
                    
                    <div>
                       <Form className={styles.profileForm}>
               
                       <div >
                  <Field name="oldPassword" 
                         type="password" 
                         id="oldPassword" 
                         placeholder="Old Password" 
                         autoComplete="off" 
                         className={styles.oldPasswordInputContainerInput}/>
                </div>
              
              <ErrorMessage name="oldPassword" component="div">
                {(errorMsg) =>
                  backendError ? (
                    <div className={styles.oldPasswordErrorContainer}>{errorMsg}</div>
                  ) : (
                    <div className={styles.oldPasswordErrorContainer}>{errorMsg}</div>
                  )
                }
              </ErrorMessage>



                <div >
                  <Field name="password" 
                         type="password" 
                         id="password" 
                         placeholder="New Password" 
                         autoComplete="off" 
                         className={styles.newPasswordInputContainer}/>
                </div>
              
              <ErrorMessage name="password" component="div">
                {(errorMsg) =>
                  backendError ? (
                    <div className={styles.newPasswordErrorContainer}>{errorMsg}</div>
                  ) : (
                    <div className={styles.newPasswordErrorContainer}>{errorMsg}</div>
                  )
                }
              </ErrorMessage>
              {backendError && <div className={styles.firstNameErrorContainer}>{backendError}</div>}

              <div >

                  <Field name="confirmPassword"
                         type="password" 
                         id="confirmPassword" 
                         placeholder="Confirm Password" 
                         autoComplete="off" 
                         className={styles.confirmPasswordInputContainer}
                         />
                </div>
              
              <ErrorMessage name="confirmPassword" component="div">
                {(errorMsg) =>
                  backendError ? (
                    <div className={styles.confirmPasswordErrorContainer}>{errorMsg}</div>
                  ) : (
                    <div className={styles.confirmPasswordErrorContainer}>{errorMsg}</div>
                  )
                }
              </ErrorMessage>
              {backendError && <div className={styles.lastNameErrorContainer}>{backendError}</div>}

          
              

            <div className={styles.buttons}>
              <input type="submit" className={styles.updateBtn} value="Update" />
              <input
                type="button"
                className={styles.closeBtn}
                onClick={closeDialog}
                value="Close"
              />
            </div>

          </Form>

          </div>   
          </Modal>

         
  </Formik>


  )
}

export default ProfileChangePassword