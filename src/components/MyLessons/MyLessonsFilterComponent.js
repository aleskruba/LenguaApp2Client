import React, { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import styles from './mylessonsfiltercomponent.module.css';
import MyFIlterTeachers from './MyFIlterTeachers';
import { Link } from 'react-router-dom';


function MyLessonsFilterComponent({ closeDialog, arr ,userTeachers}) {
  

  const formik = useFormik({
    initialValues: {

      teacherName: '',
      selectedLanguage: null,
    },
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  const [isTeacherSelected,setIsTeacherSelected] = useState(false)

  const [filteredTeacher, setFilteredTeacher] = useState({
    idTeacher: '', // Add idTeacher here
    name: '',
    language: '',
    totalLessons: null,
    teacherProfile: ''
  });
  

  const filteredArr = useMemo(() => {
    // Helper function to remove duplicates based on teacher's name
    const removeDuplicates = (arr) => {
      const teacherNames = new Set();
      return arr.filter((element) => {
        if (!teacherNames.has(element.teacherFirstName)) {
          teacherNames.add(element.teacherFirstName);
          return true;
        }
        return false;
      });
    };

    // Filter the original array based on form values
    const filtered = arr.filter((element) => {
      const nameMatch = element.teacherFirstName
        .toLowerCase()
        .includes(formik.values.teacherName.toLowerCase());
      const languageMatch =
        formik.values.selectedLanguage === null ||
        element.language.toLowerCase() === formik.values.selectedLanguage.value.toLowerCase();
      return nameMatch && languageMatch;
    });

    // Remove duplicates based on teacher's name
    return removeDuplicates(filtered);
  }, [arr, formik.values.teacherName, formik.values.selectedLanguage]);


  useEffect(() => {
    const totalLessons = filteredArr.reduce((total, element) => total + element.totalLesson, 0);
    setFilteredTeacher((prevTeacher) => ({
       ...prevTeacher,
      totalLessons: totalLessons,
    }));
  }, [filteredArr]);

  
  const selectedTeacher = userTeachers.find(t => t._id === filteredTeacher.idTeacher);

  return (
    <>
      <div className={styles.mainDiv}>
        <div className={styles.leftDiv}>
          <input
            type="text"
            placeholder="teacher's name"
            className={`${styles.leftDivInput} ${
              formik.touched.teacherName && formik.errors.teacherName ? styles.error : ''
            } inputStyle`}
            name="teacherName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.teacherName}
            maxLength="10"
          />
          {formik.touched.teacherName && formik.errors.teacherName && (
            <div className={styles.errorText}>{formik.errors.teacherName}</div>
          )}

    {/*       <div className={styles.select}>
            <Select
              name="selectedLanguage"
              options={languages.map((language) => ({ value: language, label: language }))}
              value={formik.values.selectedLanguage}
              onChange={(selectedOption) => formik.setFieldValue('selectedLanguage', selectedOption)}
              placeholder="Select a language"
            />
          </div> */}

          <div className={styles.leftBottomDiv}>
            {filteredArr.map((element, idx) => (
              <MyFIlterTeachers element={element} 
                                key={idx} 
                                setFilteredTeacher={setFilteredTeacher}
                                setIsTeacherSelected={setIsTeacherSelected}
                                userTeachers={userTeachers}
                                arr={arr} />
            ))}
          </div>
        </div>

        <div className={styles.rightDiv}>

          { isTeacherSelected ? 
         <>
      
      <Link to={{pathname:`/findteachers/${filteredTeacher.idTeacher}`}} 

state={{ teacher: selectedTeacher  }} 

>
 

           <div className={styles.rightImgDiv}>
              <img src={filteredTeacher.teacherProfile}alt="" className={styles.profileImg} />
            </div>
            <div className={styles.rightLanguageDiv}>
              <h1 className={styles.rightLanguagDivH1}>{filteredTeacher.language}</h1>
            </div>

            <div className={styles.rightNameDiv}>
              <h1 className={styles.rightNameDivH1}>{filteredTeacher.name}</h1>
                  </div>
            <div className={styles.righttotalLessonsDiv}>
              <h1 className={styles.righttotalLessonsDivH1}>
              {filteredTeacher.totalLessons || filteredTeacher.totalLessons > 0  ? 
                    `${filteredTeacher.totalLessons} completed lessons` : null }
              </h1>
            </div>
            </Link>
   
          </>
            :  <div>Select your Teaacher </div> } 


        </div>


      </div>


      <div className={styles.buttons}>
        <div className={styles.cancelBUtton} onClick={closeDialog}>
          Back
        </div>
      </div>
    </>
  );
}

export default MyLessonsFilterComponent;
