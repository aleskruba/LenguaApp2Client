import React,{ useState,useContext,useEffect} from 'react'
import styles from './teacherzone.module.css';
import TeacherProfileUpateComponent from '../../components/TeacherProfile/TeacherProfileUpateComponent';
import TeacherProfileLanguageUpate from '../../components/TeacherProfile/TeacherProfileLanguageUpdate';
import TeacherLanguageComponent from '../../components/TeacherProfile/TeacherLanguageComponent';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import BASE_URL from '../../config';
import useAuth from '../../hooks/useAuth';
const moment = require('moment');

function TeacherZone() {

    const [isOpen, setIsOpen] = useState(false);
     const [updateButton,setUpdateButton] = useState(false)
    const [updateLanguageButton,setUpdateLanguageButton] = useState(false)
    const [selectedLanguages,setSelectedLanguages] = useState([])


    // const [myReservedArrayNumber,setmyReservedArrayNumber] = useState(0)
    const { user} = useAuth();
    const {updatedData,setUpdatedData,myFinishedLessonsNumber,myStudentsNumber,myUpcomingLessonsNumber,
        isLoading,fetchedTotalEarning} = useContext(AuthContext)


    return (
    <div className={isOpen ? styles.mainTeacherZoneDivFixed : styles.mainTeacherZoneDiv}>

        <div className={styles.mainTeacherZoneDivName}>
            <div className={styles.mainTeacherZoneDivID}>ID: {user._id} </div>
            <div className={styles.mainTeacherZoneTeacherName}>{user.firstName} {user.lastName}</div>
            <div className={styles.mainTeacherZoneTeacherSince}>Teacher on Lengua App since   {moment(user.memberDate).format('DD.MM YYYY')}</div>
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
                <div className={isLoading ? styles.mainTeacherZoneStudentsSpanBlur : styles.mainTeacherZoneStudentsSpan} >{myUpcomingLessonsNumber ? myUpcomingLessonsNumber : 0 }</div>
                <Link to="/myteachingupcominglessons">
                <div className={styles.mainTeacherZoneSchedulesBtn}>Details</div>
                </Link>

                </div>
            </div>

    
            <div className={styles.mainTeacherZoneCompletedLessons}>
                <div> Completed Lessons  </div>
                <div className={styles.flexBtn}>
                <div className={isLoading ? styles.mainTeacherZoneStudentsSpanBlur : styles.mainTeacherZoneStudentsSpan}>{myFinishedLessonsNumber ? myFinishedLessonsNumber: 0}</div>
                <Link to="/myteachinglessons">
                <div className={styles.mainTeacherZoneSchedulesBtn}>Details</div>
                </Link>
                </div> 
            </div>


        <div className={styles.mainTeacherZoneStudents}>         
            <div> My Students </div>
            <div className={styles.flexBtn}>
                <div className={isLoading ? styles.mainTeacherZoneStudentsSpanBlur : styles.mainTeacherZoneStudentsSpan} >{myStudentsNumber? myStudentsNumber : 0}</div>

                <Link to="/myStudents">
                <div className={styles.mainTeacherZoneSchedulesBtn}>Details</div>
                </Link>
                </div> 
        </div>

        <div className={styles.mainTeacherZoneDivEarnedMoney}>
            <div>Earned money since  {moment(user.memberDate).format('DD.MM YYYY')} </div><span className={isLoading ? styles.mainTeacherZoneStudentsSpanBlur: styles.mainTeacherZoneEarnedMoneySpan}>$ {fetchedTotalEarning}</span>
         

        </div>
        <div className={styles.mainTeacherZoneDivBalance}>
           <div>Lengua Balance </div> <span className={styles.mainTeacherZoneBalanceSpan}>$ {user.credits}</span>
        
        </div>
       
       

       

        <div className={styles.mainTeacherZoneLanguages}>
                     <TeacherLanguageComponent/>

        </div>
        
        <div className={styles.mainTeacherZoneSettings}>
            <div className={styles.mainTeacherZoneSettingsTax}>
                <div>Tax</div>
                <div className={styles.mainTeacherZoneSettingsTAXPurple}>${updatedData !== null ? updatedData?.tax : ''}</div>
              </div>  

            <div className={styles.mainTeacherZoneSettingsPresentation}>
                <div className={styles.mainTeacherZoneSettingsPresentationTitle}>Presentation</div>
                <div className={styles.mainTeacherZoneSettingsPresentationText}>
                    <pre>
               {updatedData !== null ? updatedData?.profileText : ''}
                </pre>
                </div>

            </div>

            <div className={styles.mainTeacherZoneSettingsVideoPresentation}>
                <div>Video Presentation</div>

                <div className={styles.mainTeacherZoneSettingsVideoPresentationCODE}>{updatedData !== null ? updatedData?.profileVideo : ''}</div>
                
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