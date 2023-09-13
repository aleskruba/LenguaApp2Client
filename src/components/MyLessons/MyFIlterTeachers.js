import React from 'react'
import styles from './myfilterteachers.module.css';
import { Link } from 'react-router-dom';

function MyFIlterTeachers({element,setFilteredTeacher,arr,setIsTeacherSelected}) {

 


 const handleSubmit = () => {
 
     setIsTeacherSelected(true)
     let count = 0;
     arr.forEach(e => {
          if (e.teacherFirstName === element.teacherFirstName && e.isConfirmed )
          {count = count + 1}
       });
     
      setFilteredTeacher({name:element.teacherFirstName, teacherProfile:element.teacherProfile , idTeacher:element.idTeacher, totalLessons:count})

     
     
    
    }

 

  return (

    
    <div className={styles.mainBox} onClick={ () => handleSubmit()}>
       

       <div className={styles.name}>
            {element.teacherFirstName}
        </div>
         <div className={styles.img}>
                <img src={element.teacherProfile} alt="" className={styles.profileImg} />
        </div>

       

    </div>

  )
}

export default MyFIlterTeachers