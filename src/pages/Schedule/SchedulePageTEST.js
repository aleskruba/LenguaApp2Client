import React, { useState, useEffect, useContext, Fragment } from 'react';
import styles from './schedulepageteacher.module.css';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import BASE_URL from '../../config';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showHours, setShowHours] = useState(false);
  const [loadingReservedSlots, setLoadingReservedSlots] = useState(false);
  const [teacherreservedSlots, setTeacherreservedSlots] = useState(null);
   const [fetchedLessonArray, setFetchedLessonArray] = useState(null);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null); // New state for selected day


  const {setSavedSlot,auth } = useContext(AuthContext);
 
  useEffect(() => {
    setLoadingReservedSlots(true);
    const fetchData = async () => {
      try {
        const url = `${BASE_URL}/teachersavedscheduleslot`;
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        };
        const response = await axios.get(url, config);
        const responseData = response.data.teachingSlots;
        const lessonsArray = response.data.lessons;
        const userID = response.data.userID;
        setFetchedLessonArray(lessonsArray);

        const reservedTimeSlots = lessonsArray
          .filter(
            (lesson) => (!lesson.isReserved || lesson.isConfirmed) && lesson.idTeacher === userID
          )
          .map((lesson) => lesson.timeSlot.map((timestamp) => timestamp.toString()));

        const flattenedTimeSlots = reservedTimeSlots.flatMap((timeSlotArray) => timeSlotArray);
        setTeacherreservedSlots(flattenedTimeSlots);
        setSavedSlot(responseData);
        setLoadingReservedSlots(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (day) => {
    if (day >= new Date()) {
      setSelectedDay(day);
      setSelectedCalendarDay(day); // Update selected day when a day is clicked
      setShowHours(true);
    }
  };


  return (
    <>
      {loadingReservedSlots ? (
        <p>...loading</p>
      ) : (
        <div className={styles.maincontainer}>
          <div className={styles.maindiv}>
            <div className={styles.calendartop}>
              <button className={styles.prevbutton} onClick={handlePrevMonth}>
                Prev
              </button>
              <h2 className={styles.months}>                
              {currentMonth.toLocaleString('en-US', { month: 'long' })}
              </h2>
              
              <h2 className={styles.months}>{currentMonth.getFullYear()}</h2>
              <button className={styles.nextbutton} onClick={handleNextMonth}>
                Next
              </button>
            </div>
            <Month
              month={currentMonth}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              teacherreservedSlots={teacherreservedSlots}
              selectedCalendarDay={selectedCalendarDay} // Pass selectedCalendarDay as a prop
            />
          </div>
          <div>
            {showHours && (
              <Hours
                selectedDay={selectedDay}
                showHours={showHours}
                setShowHours={setShowHours}
                teacherreservedSlots={teacherreservedSlots}
                fetchedLessonArray={fetchedLessonArray}
                auth={auth}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Month({ month, selectedDay, onDayClick, teacherreservedSlots, selectedCalendarDay }) {

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstDay = monthStart.getDay();

  const handleDayClick = (day) => {
    onDayClick(day);
  };

  const { savedSlot } = useContext(AuthContext);

  const savedSlotTimestamps = savedSlot.map((timestamp) => parseInt(timestamp));

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

            if (currentDate <= today) {
              classNames.push(styles.pastDay);
            }

            const hasTimeslot = savedSlotTimestamps.some((timestamp) => {
              if (currentDate > today) {
                const timestampDate = new Date(timestamp);
                return (
                  timestampDate.getFullYear() === currentDate.getFullYear() &&
                  timestampDate.getMonth() === currentDate.getMonth() &&
                  timestampDate.getDate() === currentDate.getDate()
                );
              }
            });

            const isReserved = teacherreservedSlots && teacherreservedSlots.includes(currentDate.toString());

            if (hasTimeslot && isReserved) {
              classNames.push(styles.reservedHour);
            }else if (hasTimeslot && (selectedDay && currentDate.getTime() === selectedDay.getTime())){
              classNames.push(styles.currentReservedDay);
            } 
            else if (hasTimeslot) {
              classNames.push(styles.activeDay);
            } 
            else if ( (selectedDay && currentDate.getTime() === selectedDay.getTime())){
              classNames.push(styles.currentDay);
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
        <tr className={styles.days}>{renderWeekdays()}</tr>
      </thead>
      <tbody>{renderDays()}</tbody>
    </table>
  );
}



function Hours({ selectedDay, showHours, setShowHours,teacherreservedSlots,fetchedLessonArray,auth }) {
  const { savedSlot, setSavedSlot } = useContext(AuthContext);

  
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

  const handleHourClick = (hour) => {
    const selectedHour = new Date(selectedDay);
      selectedHour.setHours(hour);

    const isSelected = savedSlot.includes(Math.floor(selectedHour.getTime()).toString());

     if (isSelected) {
      setSavedSlot((prevSlots) => prevSlots.filter((slot) => slot !== Math.floor(selectedHour.getTime()).toString()));
    } else {
      setSavedSlot((prevSlots) => [...prevSlots, Math.floor(selectedHour.getTime()).toString()]);
    }
  };

  const navigate = useNavigate();

  const saveTimeSlotFunction = async () => {
    try {
      const url = `${BASE_URL}/teachersavescheduleslot`;
      const data = {
        datesArray: savedSlot,
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      const response = await axios.put(url, data, config);

      if (response.status === 201) {
        navigate('../teacherzone');
      }
    } catch (err) {
      console.log(err);
    }
  };

  
  const [hoveredHour, setHoveredHour] = useState(null);
  const [hoveredHourPM, setHoveredHourPM] = useState(null);


  const [hoverName,setHovername] = useState(null)
  return (
    <div className={styles.rightsidecontainer}>
      <div className={styles.rightsidecontainerDiv}>
        <h4 className={styles.h4text}>
        Select the time slot from:
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
            : null}
        </span>
        </h4>

        <div className={styles.hoursmaincontainer}>
          <div className={styles.hourscontainer}>
            <div className={styles.column}>
              <h4 className={styles.h4text}>AM</h4>

              
              {[...Array(12)].map((_, index) => {
               const amHour = index;
     

               const hour = index 
                 const selectedHour = new Date(selectedDay);


                selectedHour.setHours(hour);

                      const isSelected = savedSlot.includes(
                  Math.floor(selectedHour.getTime()).toString()
                );


                const isReserved = teacherreservedSlots.includes(
                  Math.floor(selectedHour.getTime()).toString()
                );

                const isHovered = hoveredHour === amHour;

                return (
                  <div
                    className={
                      isReserved
                        ? styles.reservedHour
                        : isSelected
                        ? styles.hourBoxSelected
                        : styles.hourBox
                    }
                    key={index}
                    onClick={!isReserved ? () => handleHourClick(hour) : null}
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
                    {isHovered && ( isReserved && isSelected) && (
                      <>
                      <div className={styles.reservedBubble}>Reserved</div>
                      <div className={styles.reservedBubbleStudent}>
                          {fetchedLessonArray.map((lesson, index) => (
                                
                                <Fragment key={index}>
                                        
                                { lesson.idTeacher === auth.user._id &&

                            <Fragment>
                              {lesson.timeSlot.includes(hoverName.toString()) && (
                                <div className={styles.hoverDiv}>
                                  <p key={lesson.id}>{lesson.studentFirstName}</p>
                                  <div className={styles.imgDiv}>
                                    <img src={lesson.studentProfile} className={styles.img} alt={lesson.studentFirstName} />
                                  </div>
                                </div>
                              )}
                            </Fragment>

                              }
                        </Fragment>

                          ))}
                        </div>


                      </>
                          )}
                  </div>
                );
              })
              
              }
            </div>
            <div className={styles.column}>
              <h4 className={styles.h4text}>PM</h4>
              {[...Array(12)].map((_, index) => {
                    const pmHour = index + 12;
                    const hour = index + 12;
                const selectedHour = new Date(selectedDay);
                selectedHour.setHours(hour);

                const isSelected = savedSlot.includes(
                  Math.floor(selectedHour.getTime()).toString()
                );


                const isReserved = teacherreservedSlots.includes(
                  Math.floor(selectedHour.getTime()).toString()
                );

                const isHovered = hoveredHourPM === pmHour;
                return (
                  <div
                          className={
                      isReserved
                        ? styles.reservedHour
                        : isSelected
                        ? styles.hourBoxSelected
                        : styles.hourBox
                    }
                    key={index+13}
                    onClick={!isReserved ? () => handleHourClick(hour) : null}
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
                      setHoveredHourPM(pmHour);
                    }}
                    
                    onMouseLeave={() => setHoveredHourPM(null)}
                  >
                    {formatHour(pmHour)} - {formatHour(pmHour +1)}
                    {isHovered && ( isReserved && isSelected) && (
                      <>
                      <div className={styles.reservedBubble}>Reserved</div>
                      <div className={styles.reservedBubbleStudent}>
                          {fetchedLessonArray.map((lesson, index) => (
                            <Fragment key={index}>
                                                              
                            { lesson.idTeacher === auth.user._id &&

                            <Fragment>
                              {lesson.timeSlot.includes(hoverName.toString()) && (
                                <div className={styles.hoverDiv}>
                                  <p key={lesson.id}>{lesson.studentFirstName}</p>
                                  <div className={styles.imgDiv}>
                                    <img src={lesson.studentProfile} className={styles.img} alt={lesson.studentFirstName} />
                                  </div>
                                </div>
                              )}
                            </Fragment>
                    
                             }
                         </Fragment>
                          ))}
                        </div>

                      </>
                          )}
                    
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={showHours ? styles.buttons : styles.nobuttons}>
        <button className={styles.saveButton} onClick={saveTimeSlotFunction}>
          Save
        </button>
        <button className={styles.cancelButton} onClick={() => setShowHours(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}


function SchedulePage() {
  return (
    <div className={styles.maincontainer}>
      <Calendar />
    </div>
  );
}

export default SchedulePage;
