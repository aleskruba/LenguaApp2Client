import React, { useEffect, useState ,useContext, Fragment} from 'react';
import AuthContext from '../../context/AuthProvider';
import styles from './schedulestudent.module.css';
import {useParams } from 'react-router-dom';
import BASE_URL from '../../config';
import axios from 'axios';


function CalendarStudent() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showHours, setShowHours] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [savedSlottoDB,setSavedDlotdoDB] = useState(false)
  const [loadingSlots,setLoadingSLots] = useState(false)
  const [loadingReservedSlots,setLoadingReservedSlots] = useState(false)
  const [myBookedLessons,setMyBookedLessons] = useState(null)
  const [fetchedLessonArray, setFetchedLessonArray] = useState(null);
  const { setActualdSlots,setReservedSlots,auth } = useContext(AuthContext);

  const { idTeacher } = useParams();


  useEffect(()=>{ 

  const lessonsData = async () => {
    setLoadingReservedSlots(false)

    try {
      const url = `${BASE_URL}/lessondata`;
 
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };
  
      const response = await axios.get(url,  config);
    


      const dataTeachers = response.data.teachers
      const lessonsArray =  response.data.lessons
      setFetchedLessonArray(lessonsArray)

      const  myArray = []
       lessonsArray.some(el=> 
        { if (el.idStudent == auth.user._id) { 
          myArray.push(el.timeSlot)
          }
          return false
        }) 
      const  myArrayFlat = myArray.flatMap(timeSlotArray => timeSlotArray);
      setMyBookedLessons(myArrayFlat)

      const reservedTimeSlots = lessonsArray
      .filter(lesson => (lesson.isReserved || lesson.isConfirmed) && lesson.idTeacher === idTeacher)
      .map(lesson => lesson.timeSlot.map(timestamp => timestamp.toString()));
      
      const flattenedTimeSlots = reservedTimeSlots.flatMap(timeSlotArray => timeSlotArray);
      setReservedSlots(flattenedTimeSlots)
      setLoadingReservedSlots(true)

      
      const teacherObject = dataTeachers.find(teacher => teacher._id === idTeacher);
      const techerSlots = teacherObject
 

      setTeacher(teacherObject);
      setActualdSlots(techerSlots.teachingSlots)
      setLoadingSLots(false)


    } catch(err) {console.log(err)}

  }
  lessonsData()
},[savedSlottoDB])




  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handleDayClick = (day) => {
    if (day >= new Date()) {

      setSelectedDay(day);
      setShowHours(true);
    }
  };


  return (

      <>
    {loadingReservedSlots ? 
    <div className={styles.maincontainer}>
      <div className={styles.maindiv}>
        <div className={styles.teacherTitle}>
        <div className={styles.maindivH3}>Book lesson with {teacher?.firstName}</div> <div className={styles.imageDiv}><img src={teacher?.profile} className={styles.image}/> </div>
        </div> 
        <div className={styles.calendartop}>
          <button className={styles.prevbutton} onClick={handlePrevMonth}>
            Prev
          </button>
          <h2 className={styles.months}>                
              {currentMonth.toLocaleString('en-US', { month: 'long' })}
              </h2>
              
          <h2 className={styles.months}>
            {currentMonth.toLocaleString('default', { year: 'numeric' })}
          </h2>
          <button className={styles.nextbutton} onClick={handleNextMonth}>
            Next
          </button>
        </div>
        <Month month={currentMonth} selectedDay={selectedDay} onDayClick={handleDayClick} teacher={teacher} />
      </div>
      <div>{showHours && <Hours selectedDay={selectedDay} 
                                teacher={teacher}  
                                setSavedDlotdoDB={setSavedDlotdoDB} 
                                loadingSlots={loadingSlots}
                                loadingReservedSlots={loadingReservedSlots}
                                myBookedLessons={myBookedLessons}
                                fetchedLessonArray={fetchedLessonArray}
                                />}</div>
    </div>


    : <p>... loading</p>}
    </>

  );
}

function Month({ month, selectedDay, onDayClick,teacher }) {
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstDay = monthStart.getDay();

  const { actualSlots } = useContext(AuthContext);

  const handleDayClick = (day) => {

    onDayClick(day);

/*     const selectedDaySlots = actualSlots.filter(timestamp => {
      const timestampDate = new Date(timestamp);
      
      // Set selectedDay's time to midnight in local timezone for accurate comparison
      const selectedDayMidnight = new Date(day);
      selectedDayMidnight.setHours(0, 0, 0, 0);
      
      return timestampDate.getTime() >= selectedDayMidnight.getTime() &&
             timestampDate.getTime() < selectedDayMidnight.getTime() + 24 * 60 * 60 * 1000;
    }); */

  };

  const savedSlotTimestamps = actualSlots.map((timestamp) => parseInt(timestamp));

  const renderWeekdays = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays.map((weekday) => <th key={weekday} style={{width:'30px'}}>{weekday}</th>);
  };

  const renderDays = () => {
    const rows = [];
    let cells = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (day <= daysInMonth) {
          const classNames = [styles.day];
          if (i === 0 && j < firstDay) {
            cells.push(<td key={j} />);
          } else {
            const currentDate = new Date(month.getFullYear(), month.getMonth(), day);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (currentDate <= new Date()) {
              classNames.push(styles.pastDay);
            }
      /*       if (selectedDay && currentDate.toISOString().split('T')[0] === selectedDay.toISOString().split('T')[0]) {
              classNames.push(styles.currentDay);
            } */

            const hasTimeslot = savedSlotTimestamps.some((timestamp) => {
              if (currentDate > today) {
              const timestampDate = new Date(timestamp);
              return timestampDate.getFullYear() === currentDate.getFullYear() &&
                      timestampDate.getMonth() === currentDate.getMonth() &&
                      timestampDate.getDate() === currentDate.getDate();
                    }
                    return false;
                    });

            if (hasTimeslot) {
              classNames.push(styles.activeDay);
            }

            if ( (selectedDay && hasTimeslot && currentDate.getTime() === selectedDay.getTime())){
              classNames.push(styles.currentReservedDay);
            } 
            

            cells.push(
              <td className={styles.td} key={j} onClick={() => handleDayClick(currentDate)}>
                <div className={classNames.join(' ')}>{day}</div>
              </td>
            );
            day++;
          }
        }
      }

      rows.push(<tr key={i}>{cells}</tr>);
      cells = [];
    }

    return rows;
  };

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr className={styles.tr}>
          <th className={styles.thmain} colSpan="7">
   
          </th>
        </tr>
        <tr>{renderWeekdays()}</tr>
      </thead>
      <tbody>{renderDays()}</tbody>
    </table>
  );
}

function Hours({ selectedDay,teacher,setSavedDlotdoDB,loadingSlots,loadingReservedSlots,myBookedLessons,fetchedLessonArray }) {


  const [selectedHour, setSelectedHour] = useState(null);
  const { actualSlots,reservedSlots,auth ,setSlotChange,slotChange} = useContext(AuthContext);
  
  const [error,setError] = useState(null)

  const formatHour = (hour) => {
    if (hour === 0) {
      return "12AM";
    } else if (hour === 12) {
      return "12PM";
    }  else if (hour > 12) {
      if (hour === 24) {
        return "12AM";
      } else {
      return `${hour - 12}PM`;
      }
    } else {
      return `${hour}AM`;
    }
  };
  

  const [bookedState ,setBookedState ] = useState(null)

  const handleHourClick = (hour) => {

    if (selectedHour === hour) {
      setSelectedHour(null); // Deselect the hour
    } else {
      setSelectedHour(hour); // Select the hour
  
      const selectedTimestamp = new Date(selectedDay);
      selectedTimestamp.setHours(hour, 0, 0, 0);
      const unixTimestamp = Math.floor(selectedTimestamp.getTime() );
  
      setBookedState(unixTimestamp);
   
    }
  };
  
  const [succesBookedLesson,setSuccesBookedLesson] = useState(false)
  const selectedHourStart = formatHour(selectedHour);
  const selectedHourEnd = formatHour(selectedHour + 1);
/*   const selectedDayFormatted = selectedDay.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
  });
 */

  useEffect(() => {
    // Reset selected hour when selectedDay changes
    setSelectedHour(null);
  }, [selectedDay]);

  const [loading,setLoading] = useState(false)

  const bookSlotFunction = async () => {
   
    if (auth.user.credits >= teacher.tax ) {
    
    setLoading(true)
    setSavedDlotdoDB(false)

    try {
      const url = `${BASE_URL}/savelessonslot`;
      const payload = {
        data: {
          credits: teacher.tax,
          timeSlot: bookedState,
          teacherID: teacher._id,
        }
      };
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Set the withCredentials option to true
      };
  
      const response = await axios.post(url, payload, config);
      setSelectedHour(null);
      setLoading(false)
      setSavedDlotdoDB(true)
     // setSlotChange(!slotChange)
          if (response.status === 201) {setSuccesBookedLesson(true)}
       } catch(err) {setError(err.response.data.error);setLoading(false)}

      }
      else {setError('you do not have enough credit....')
      return;
    }
  };




  const [hoverName,setHovername] = useState(null)
  const [hoveredHour, setHoveredHour] = useState(null);

  useEffect(()=>{},[hoveredHour])
  
  return (

    <>
    {loading || loadingSlots ? <p> ...loading</p>  :  
    <div className={styles.rightsidecontainer}>
      <div className={styles.rightsidecontainerDiv}>

        <h4 className={styles.h4text}>
        Select <span className={styles.availableSlots}>available</span> time slot from:
        <br/>
        <span className={styles.spandate}>
        {selectedDay
            ? `${selectedDay.toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "Europe/Prague", // Replace with your desired time zone
                }
              )}`
            : "Select a day to see available time slots"}
        </span>
        </h4>


        {selectedDay && (
          <div className={styles.hoursmaincontainer}>

{loadingReservedSlots ? 

            <div className={styles.hourscontainer}>
              <div className={styles.column}>
                <h4 className={styles.h4text}>AM</h4>
               
           
                {[...Array(12)].map((_, index) => {
  const amHour = index;
  const amTimestamp = Math.floor(
    new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate(),
      amHour,
      0,
      0,
      0
    ).getTime()
  );

 // setHovername(amTimestamp)

  const isActiveAM = actualSlots.includes(amTimestamp.toString());
  const isReservedAM = reservedSlots.includes(amTimestamp.toString());
  const isBookedByMe = myBookedLessons.includes(amTimestamp.toString());

  const isHovered = hoveredHour === amHour;

  return (
    <div
      className={ isActiveAM  ? selectedHour === amHour ? styles.hourBoxSelected : isBookedByMe ? styles.myBookeddHour
            : isReservedAM
            ? styles.reservedHour
            : styles.activeHour
          : isBookedByMe ? styles.myBookeddHour : styles.hourBox
      }
      key={index}
      onClick={
        !(isBookedByMe || isReservedAM)
          ? () => handleHourClick(amHour)
          : null
      }
      onMouseEnter={() => {
        const amTimestamp = Math.floor(
          new Date(
            selectedDay.getFullYear(),
            selectedDay.getMonth(),
            selectedDay.getDate(),
            amHour,
            0,
            0,
            0
          ).getTime()
        );
        setHovername(amTimestamp)
        setHoveredHour(amHour);
      }}
      onMouseLeave={() => setHoveredHour(null)}
    >
      {formatHour(amHour)} - {formatHour(amHour + 1)}
      {isHovered && isBookedByMe ? (<> <div className={styles.reservedBubble}>Reserved by you</div>
      
      <div className={styles.reservedBubbleStudent}>
      {fetchedLessonArray.map((lesson, index) => (
        <Fragment key={index}>
          {lesson.timeSlot.includes(hoverName.toString()) && (
            <div className={styles.hoverDiv}>
              <p key={lesson.id}>{lesson.teacherFirstName}</p>
              <div className={styles.imgDiv}>
                <img src={lesson.teacherProfile} className={styles.img} alt={lesson.teacherFirstName} />
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div> 
  </>
      )
             :  isHovered  && isReservedAM ? (<div className={styles.reservedBubbleOther}>  Reserved</div> ) : null}
    </div>
  );
})}



              </div>
              <div className={styles.column}>
                <h4 className={styles.h4text}>PM</h4>



                {[...Array(12)].map((_, index) => {
  const pmHour = index + 12;
  const pmTimestamp = Math.floor(
    new Date(
      selectedDay.getFullYear(),
      selectedDay.getMonth(),
      selectedDay.getDate(),
      pmHour,
      0,
      0,
      0
    ).getTime()
  );

  const isActivePM = actualSlots.includes(pmTimestamp.toString());
  const isReservedPM = reservedSlots.includes(pmTimestamp.toString());
  const isBookedByMe = myBookedLessons.includes(pmTimestamp.toString());

  const isHovered = hoveredHour === pmHour;

  return (
    <div
      className={
        isActivePM
          ? selectedHour === pmHour
            ? styles.hourBoxSelected
            : isBookedByMe
            ? styles.myBookeddHour
            : isReservedPM
            ? styles.reservedHour
            : styles.activeHour
          : isBookedByMe ? styles.myBookeddHour : styles.hourBox
      }
      key={index}
      onClick={
        !(isBookedByMe || isReservedPM) ? () => handleHourClick(pmHour) : null
      }
      onMouseEnter={() => {
        const pmTimestamp = Math.floor(
          new Date(
            selectedDay.getFullYear(),
            selectedDay.getMonth(),
            selectedDay.getDate(),
            pmHour,
            0,
            0,
            0
          ).getTime()
        );
        setHovername(pmTimestamp)
        setHoveredHour(pmHour)
      }}
      onMouseLeave={() => setHoveredHour(null)}
    >
      {formatHour(pmHour)} - {formatHour(pmHour + 1)}
      {isHovered && isBookedByMe ? (<> <div className={styles.reservedBubble}>Reserved by you</div>
      
      <div className={styles.reservedBubbleStudent}>
      {fetchedLessonArray.map((lesson, index) => (
        <Fragment key={index}>
          {lesson.timeSlot.includes(hoverName.toString()) && (
            <div className={styles.hoverDiv}>
              <p key={lesson.id}>{lesson.teacherFirstName}</p>
              <div className={styles.imgDiv}>
                <img src={lesson.teacherProfile} className={styles.img} alt={lesson.teacherFirstName} />
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div> 
  </>)
             :  isHovered  && isReservedPM ? (<div className={styles.reservedBubbleOther}>  Reserved</div> ) : null}
    </div>
  );
})}

              </div>
            </div>

:<> 
<p>...loading</p>
  {succesBookedLesson ? <p >Lesson reserved succefully</p> : null }
  </>
}

          </div>
        )}
      </div>
      {selectedHour !== null ? 
      <div className={styles.saveSlot}>
        <h5 className={styles.h5text}>{`You selected: ${selectedHourStart}  -  ${selectedHourEnd}`}</h5>
        <button type='button' className={styles.saveSlotButton} onClick={()=>bookSlotFunction(selectedHour)}><span className={styles.ButtonText}> Book NOW for ${teacher.tax}   </span></button>
        <button type='button' className={styles.cancelButton} onClick={()=>{setSelectedHour(null)}}><span className={styles.ButtonText}> Cancel ! </span></button>
     {error ? <p className={styles.error}>{error}</p> : null}
     
      </div>
      : ''}
    </div>
}
    </>
  );
}



function ScheduleStudent() {
  return (
    <div className={styles.maincontainer}>
      <CalendarStudent />
    </div>
  );
}

export default ScheduleStudent;
