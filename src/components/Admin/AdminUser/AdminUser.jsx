import React,{useEffect, useState} from 'react'
import styles from './adminuser.module.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../../config';
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';



const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });


function AdminUser() {
    const navigate = useNavigate()

    const [user,setUser] = useState(null)
    const [hideInputs,setHideInputs] = useState(false)
    const [backendError,setBackendError] = useState(null)
    const [success,setSuccess] = useState(null)

    const params = useParams()
 
    useEffect(() => {
        const fetchData = async () => {
          try {
            const url = `${BASE_URL}/getuser`;
    
            // Specify the query parameters as an object
            const response = await axios.get(url, {
              params: { id: params.id },
              withCredentials: true,
            });
    
            setUser(response.data.user);
           
          } catch (err) {
            console.log(err);
          }
        };
    
        fetchData();
      }, []);
     

      const handleFormSubmit = async (values) => {
        const { password, confirmPassword } = values;
        setBackendError(null)
    
        // Create an object with the form values
        const formData = {
          password: password,
          confirmPassword: confirmPassword,
        };
    
      // Client-side code
    try {
        const url = `${BASE_URL}/adminchangepassword`;
        const data = {
          newPassword: formData.password,
          id : params.id  
        };
      
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        };
      
      
        const response = await axios.put(url, data, config);
    
        if (response.status === 201) {
     
           setSuccess(response.data.message);
           setTimeout(()=>{navigate('../admin/adminusers/') },1000)
               
        } else {
          console.log('Password change request failed');
          // Handle the response or error status here
        }
      
      } catch (err) {
          console.log(err)
        if (err.response.data = 'incorrect new password') {
            setBackendError("Incorrect new password");
            }
      }
      
      };


  return (


   <>      
    <div className={styles.container}>
    <div className={styles.mainbox}>
           <div className={styles.box}>
                <div>email:</div> <div>{user?.email}</div>
            </div>
            <div className={styles.box}>
                <div>first name:</div><div>{user?.firstName}</div>
            </div>
            <div className={styles.box}>
                <div>last name:</div><div>{user?.lastName}</div>
            </div>
            </div>

            <div className={styles.buttons}> 
                <button className={styles.changePassword} onClick={()=>setHideInputs(true)}>change password</button>
                <button className={styles.cancelBtn} onClick={()=>{ navigate('../admin/adminusers');setHideInputs(false)}} >back to users</button>
            </div>

            </div>
    {hideInputs && 
    
    <div className={styles.passwordMainDiv}>
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      <Form>
 
        <Field
          type="password"
          name="password"
          placeholder="New Password"
          className={styles.inputBox}
        />
        <ErrorMessage
          name="password"
          component="div"
          className={styles.inputBoxError}
        />

        <Field
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className={styles.inputBox}
        />
        <ErrorMessage
          name="confirmPassword"
          component="div"
          className={styles.inputBoxError}
        />

    <div className={styles.buttons}>
          <button type="submit" className={styles.inputBoxButton}>
           Update Password
         </button>
  
     
        </div>

  
      </Form>
    </Formik>
    { backendError ?  <p className={styles.notSuccess}>{backendError}</p> : null } 
    { success ?  <p className={styles.success}>{success}</p> : null } 
  </div>


    
    }
     </>
  )
}

export default AdminUser