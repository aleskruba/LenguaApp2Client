import React, { useEffect, useState } from 'react';
import moment from 'moment';
import styles from './schedulestudent.module.css';
import { useParams } from 'react-router-dom';
import BASE_URL from '../../config';
import axios from 'axios';

function CalendarStudent() {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showHours, setShowHours] = useState(false);
  const [teacher,setTeacher] = useState(null)

  const { idTeacher } = useParams();

useEffect(()=>{

  console.log(idTeacher)

  const fetchData = async () => {
    const url = `${BASE_URL}/findteachers`
     
    try {
      const response = await axios.get(url, { withCredentials: true });
      const data = response.data.teachers;

      const teacherObject = data.find(teacher => teacher._id === idTeacher);

      setTeacher(teacherObject)
    

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    };
  

  fetchData();
},[idTeacher])



  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'month'));
  };

  const handleDayClick = (day) => {
    if (day.isSameOrAfter(moment(), 'day')) {
      setSelectedDay(day);
      setShowHours(true);
      console.log(day.format('YYYY-MM-DD')); // Log the selected day in YYYY-MM-DD format
    }
  };

  return (
    
<div className={styles.maincontainer}>
      <div className={styles.maindiv}>
      <h3 className={styles.maindivH3}>Book lesson with {teacher?.firstName  }</h3>
        <div className={styles.calendartop}>
          
           <button className={styles.prevbutton} onClick={handlePrevMonth}>
            Prev
          </button>
          <h2 className={styles.months}>{currentMonth.format('YYYY')}</h2>
          <button className={styles.nextbutton} onClick={handleNextMonth}>
            Next
          </button>
        </div>
        <Month month={currentMonth} selectedDay={selectedDay} onDayClick={handleDayClick} />
      </div>
      <div>{showHours && <Hours selectedDay={selectedDay} />}</div>
    </div>
     );
}

function Month({ month, selectedDay, onDayClick }) {
  const daysInMonth = month.daysInMonth();
  const monthStart = month.startOf('month');
  const firstDay = monthStart.day();

  const handleDayClick = (day) => {
    onDayClick(day);
  };

  const renderWeekdays = () => {
    const weekdays = moment.weekdaysShort();
    return weekdays.map((weekday) => <th key={weekday}>{weekday}</th>);
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
            const currentDate = moment(monthStart).date(day);
            if (currentDate.isSameOrBefore(moment(), 'day')) {
              classNames.push(styles.pastDay);
            }
            if (selectedDay && currentDate.isSame(selectedDay, 'day')) {
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
          <th className={styles.th} colSpan="7">
            {month.format('MMMM')}
          </th>
        </tr>
        <tr>{renderWeekdays()}</tr>
      </thead>
      <tbody>{renderDays()}</tbody>
    </table>
  );
}

function Hours({ selectedDay }) {
  const [selectedHour, setSelectedHour] = useState(null);

  const handleHourClick = (hour) => {
    if (selectedHour === hour) {
      setSelectedHour(null); // Deselect the hour
      console.log(null); // Log the deselected hour
    } else {
      setSelectedHour(hour); // Select the hour
      console.log(formatHour(hour)); // Log the selected hour
    }
  };

  const formatHour = (hour) => {
    if (hour === 0) {
      return '12AM';
    } else if (hour === 12) {
      return '12PM';
    } else if (hour > 12) {
      return `${hour - 12}PM`;
    } else {
      return `${hour}AM`;
    }
  };

  return (
    <div className={styles.rightsidecontainer}>
      <div className={styles.rightsidecontainerDiv}>
        <h4 className={styles.h4text}>Select the time slot</h4>
        <div className={styles.hoursmaincontainer}>
          <div className={styles.hourscontainer}>
            <div className={styles.column}>
              <h4 className={styles.h4text}>AM</h4>
              {[...Array(12)].map((_, index) => (
                <div
                  className={
                    selectedHour === index + 1 ? styles.hourBoxSelected : styles.hourBox
                  }
                  key={index}
                  onClick={() => handleHourClick(index + 1)}
                >
                  {formatHour(index + 1)} - {formatHour(index + 2)}
                </div>
              ))}
            </div>
            <div className={styles.column}>
              <h4 className={styles.h4text}>PM</h4>
              {[...Array(12)].map((_, index) => (
                <div
                  className={
                    selectedHour === index + 13 ? styles.hourBoxSelected : styles.hourBox
                  }
                  key={index}
                  onClick={() => handleHourClick(index + 13)}
                >
                  {formatHour(index + 1 + 12)} - {formatHour(index + 2 + 12)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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
