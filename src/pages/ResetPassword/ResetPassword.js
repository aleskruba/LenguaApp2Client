import React, { useState, useContext, useEffect } from "react";
import styles from "./resetpassword.module.css";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AuthContext from "../../context/AuthProvider";
import BASE_URL from "../../config";
import { useLocation } from "react-router-dom";

Modal.setAppElement("#root");

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one digit"
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const initialValues = {
  password: "",
  confirmPassword: "",
};

function ResetPassword() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [backendError, setBackendError] = useState("");
  const [Success,setSuccess] = useState(false)
  const location = useLocation(); // Add this hook to get the current location
  const { email } = location.state || {}; // Extract the email from the location state
  // ...

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.user) {
      navigate("/");
    }
  }, [auth]);

  const onSubmit = async (values) => {
    setBackendError("");
 
    try {
      const url = `${BASE_URL}/resetpassword`;
            const data = {
              password: values.password,
              email: email, // Use the email from the location state
            };

          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, // Set the withCredentials option to true
          };

          const response = await axios.post(url, data, config);
          if (response.status===200) 
                { setSuccess(true)
                  setTimeout(()=>{navigate('/login') },1000 )
                     
          }

    } catch (err) {
      console.log(err);
      setBackendError("An error occurred while signing up.");
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    navigate("/");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Modal isOpen={isOpen} onRequestClose={closeDialog}>
        <h1 className={styles.title}>CREATE NEW PASSWORD</h1>
        <Form className={styles.registerForm}>
     
          <div className={styles.passwordInputContainer}>
            <Field
              name="password"
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
              className={styles.signUpPassword}
            />{" "}
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
          {backendError && (
            <div className={styles.passwordErrorContainer}>{backendError}</div>
          )}

          <div className={styles.passwordInputContainer}>
            <Field
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="off"
            />{" "}
          </div>

            <div className={styles.error}>
          <ErrorMessage name="confirmPassword" component="div">
            {(errorMsg) =>
              backendError ? (
                <div className={styles.passwordErrorContainer}>{errorMsg}</div>
              ) : (
                <div className={styles.passwordErrorContainer}>{errorMsg}</div>
              )
            }
          </ErrorMessage>
          </div>
        {Success ?   <div className={styles.success}>Password has been reset successfully !!!</div> : ''}

          <div className={styles.buttons}>
            <input
              type="submit"
              className={styles.registerBtn}
              value="Save"
            />
            <input
              type="button"
              className={styles.closeBtn}
              onClick={closeDialog}
              value="Close"
            />
          </div>
          <div>
       </div>
        </Form>
      </Modal>
    </Formik>
  );
}

export default ResetPassword;
