import React,{useEffect, useState} from 'react'
import styles from './teacherzone.module.css';
import TeacherProfileUpateComponent from '../../components/TeacherProfile/TeacherProfileUpateComponent';
import TeacherProfileLanguageUpate from '../../components/TeacherProfile/TeacherProfileLanguageUpdate';
import { Link } from 'react-router-dom';

function TeacherZone() {

    const [isOpen, setIsOpen] = useState(false);
 
    const [updateButton,setUpdateButton] = useState(false)
    const [updateLanguageButton,setUpdateLanguageButton] = useState(false)

    const [selectedLanguages,setSelectedLanguages] = useState([])

    const [updatedData,setUpdatedData] = useState(null)

    useEffect(()=>{updatedData  !== null  &&  console.log(updatedData.tax,updatedData.presentation,updatedData.videoPresentation)},[updatedData])

    return (
    <div className={isOpen ? styles.mainTeacherZoneDivFixed : styles.mainTeacherZoneDiv}>

        <div className={styles.mainTeacherZoneDivName}>
            <div className={styles.mainTeacherZoneDivID}>ID: 512456842</div>
            <div className={styles.mainTeacherZoneTeacherName}>Ales Kruba</div>
            <div className={styles.mainTeacherZoneTeacherSince}>Teacher on Lengua App since 28.4.2023</div>
        </div>

        <div className={styles.mainTeacherZoneSchedules}>
            <div> Your schedule slots </div>
            <Link to="/schedule">
            <div className={styles.mainTeacherZoneSchedulesBtn}>Update</div>
            </Link>
        </div>
        
    
            <div className={styles.mainTeacherZoneUpcomingLessons}>
                <div> Upcoming Lessons  </div>
                <div className={styles.flexBtn}>
                <div className={styles.mainTeacherZoneStudentsSpan} >4</div>
                <Link to="/myteachinglessons">
                <div className={styles.mainTeacherZoneSchedulesBtn}>Details</div>
                </Link>

                </div>
            </div>

    
            <div className={styles.mainTeacherZoneCompletedLessons}>
                <div> Completed Lessons  </div>
                <div className={styles.flexBtn}>
                <div className={styles.mainTeacherZoneStudentsSpan} >64</div>
                <Link to="/myteachinglessons">
                <div className={styles.mainTeacherZoneSchedulesBtn}>Details</div>
                </Link>
                </div> 
            </div>


        <div className={styles.mainTeacherZoneStudents}>         
            <div> My Students </div>
            <div className={styles.flexBtn}>
                <div className={styles.mainTeacherZoneStudentsSpan} >8</div>
                <Link to="/mystudents">
                <div className={styles.mainTeacherZoneSchedulesBtn}>Details</div>
                </Link>
                </div> 
        </div>

        <div className={styles.mainTeacherZoneDivEarnedMoney}>
            <div>Earned money since 28.4.2022 </div><span className={styles.mainTeacherZoneEarnedMoneySpan}>$ 150</span>
         

        </div>
        <div className={styles.mainTeacherZoneDivBalance}>
           <div>Lengua Balance </div> <span className={styles.mainTeacherZoneBalanceSpan}>$ 350</span>
        
        </div>
       
       

       

        <div className={styles.mainTeacherZoneLanguages}>
            <div className={styles.mainTeacherZoneLanguagesUpdateTop}> 
               <div>My teaching languages</div>
                <div className={styles.mainTeacherZoneLanguagesUpdate}>
                    <div className={styles.updateLanguageBtn} onClick={()=>setUpdateLanguageButton(true)}>
                    Update  
                    </div>
                 </div>
            </div> 
            
            <div className={styles.mainTeacherZoneLanguagesUpdateBottom}> 
                 <div className={styles.mainTeacherZoneLanguagesItems}>
                    {selectedLanguages.map((lan,index)=>(
                        <div key={index}>{lan.language}</div>
                   ))}
                </div>           
            </div>

        </div>
        
        <div className={styles.mainTeacherZoneSettings}>
            <div className={styles.mainTeacherZoneSettingsTax}>
                <div>Tax</div>
                <div className={styles.mainTeacherZoneSettingsTAXPurple}>${updatedData !== null ? updatedData.tax : ''}</div>
              </div>  

            <div className={styles.mainTeacherZoneSettingsPresentation}>
                <div className={styles.mainTeacherZoneSettingsPresentationTitle}>Presentation</div>
                <div className={styles.mainTeacherZoneSettingsPresentationText}>
                    <pre>
               {updatedData !== null ? updatedData.presentation : ''}
                </pre>
                </div>

            </div>

            <div className={styles.mainTeacherZoneSettingsVideoPresentation}>
                <div>Video Presentation</div>

                <div className={styles.mainTeacherZoneSettingsVideoPresentationCODE}>{updatedData !== null ? updatedData.videoPresentation : ''}</div>
                
                </div>
                
                <div className={styles.updateBtn} onClick={()=>{setUpdateButton(true);setIsOpen(true)}}>
                    Update Profile
                </div>
                {updateButton ? 
                <TeacherProfileUpateComponent setIsOpen={setIsOpen} 
                                              setUpdateButton={setUpdateButton}
                                              isOpen={isOpen}
                                              setUpdatedData={setUpdatedData}
                                              updatedData={updatedData}
                                            />
            :''
            }

            {updateLanguageButton ? 
                    <TeacherProfileLanguageUpate setUpdateLanguageButton={setUpdateLanguageButton}
                                                 isOpen={isOpen}
                                                 setSelectedLanguages={setSelectedLanguages}
                                                 selectedLanguages={selectedLanguages}
                    />
            :''
            }
        </div>

    </div>
  )
}

export default TeacherZone