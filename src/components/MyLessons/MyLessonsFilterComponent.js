import React, { useState, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import Select from 'react-select';
import styles from './mylessonsfiltercomponent.module.css';
import MyFIlterTeachers from './MyFIlterTeachers';

function MyLessonsFilterComponent({ closeDialog, arr }) {
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

  const languages = ['english', 'german', 'spanish'];

  const [filteredTeacher, setFilteredTeacher] = useState({
    name: '',
    language: '',
    totalLessons: 0,
  });

  const filteredArr = useMemo(() => {
    return arr.filter((element) => {
      const nameMatch = element.firstName
        .toLowerCase()
        .includes(formik.values.teacherName.toLowerCase());
      const languageMatch =
        formik.values.selectedLanguage === null ||
        element.language.toLowerCase() === formik.values.selectedLanguage.value.toLowerCase();
      return nameMatch && languageMatch;
    });
  }, [arr, formik.values.teacherName, formik.values.selectedLanguage]);

  useEffect(() => {
    const totalLessons = filteredArr.reduce((total, element) => total + element.totalLesson, 0);
    setFilteredTeacher((prevTeacher) => ({
      ...prevTeacher,
      totalLessons: totalLessons,
    }));
  }, [filteredArr]);

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

          <div className={styles.select}>
            <Select
              name="selectedLanguage"
              options={languages.map((language) => ({ value: language, label: language }))}
              value={formik.values.selectedLanguage}
              onChange={(selectedOption) => formik.setFieldValue('selectedLanguage', selectedOption)}
              placeholder="Select a language"
            />
          </div>

          <div className={styles.leftBottomDiv}>
            {filteredArr.map((element, idx) => (
              <MyFIlterTeachers element={element} key={idx} setFilteredTeacher={setFilteredTeacher} />
            ))}
          </div>
        </div>

        <div className={styles.rightDiv}>
          <div className={styles.rightImgDiv}>
            <img src="/man.jpg" alt="" className={styles.profileImg} />
          </div>
          <div className={styles.rightLanguageDiv}>
            <h1 className={styles.rightLanguagDivH1}>{filteredTeacher.language}</h1>
          </div>

          <div className={styles.rightNameDiv}>
            <h1 className={styles.rightNameDivH1}>{filteredTeacher.name}</h1>
          </div>
          <div className={styles.righttotalLessonsDiv}>
            <h1 className={styles.righttotalLessonsDivH1}>
              {filteredTeacher.totalLessons} completed lessons
            </h1>
          </div>
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
