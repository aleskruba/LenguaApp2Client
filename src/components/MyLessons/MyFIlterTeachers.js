import React from 'react'
import styles from './myfilterteachers.module.css';

function MyFIlterTeachers({element,setFilteredTeacher}) {

    const handleSubmit = (name,language,lessons) => {
        setFilteredTeacher({name:name, language:language, totalLessons:lessons})
    }

  return (
    
    <div className={styles.mainBox} onClick={ () => handleSubmit(element.firstName,element.language,28)}>
        <div className={styles.name}>
            {element.firstName}
        </div>
         <div className={styles.img}>
                <img src="/man.jpg" alt="" className={styles.profileImg} />
        </div>
    </div>

  )
}

export default MyFIlterTeachers