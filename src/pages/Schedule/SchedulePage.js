import React, { useState } from 'react';
import moment from 'moment';
import styles from './schedulepageteacher.module.css';
import { useEffect } from 'react';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showHours, setShowHours] = useState(false);

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
        <div className={styles.calendartop}>
          <button className={styles.prevbutton} onClick={handlePrevMonth}>
            Prev
          </button>
          <h2 className={styles.months}>{currentMonth.format('YYYY')}</h2>
          <button className={styles.nextbutton} onClick={handleNextMonth}>
            Next
          </button>
        </div>
        <Month month={currentMonth}  selectedDay={selectedDay} onDayClick={handleDayClick} />
      </div>
      <div>{showHours && <Hours selectedDay={selectedDay} showHours={showHours}  setShowHours={setShowHours}/>}</div>
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


function Hours({ selectedDay,showHours,setShowHours }) {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const handleHourClick = (hour) => {
    const selectedHour = selectedDay.clone().hour(hour);
    const isSelected = selectedSlots.some((slot) => slot.isSame(selectedHour));

    if (isSelected) {
      setSelectedSlots((prevSlots) => prevSlots.filter((slot) => !slot.isSame(selectedHour)));
    } else {
      setSelectedSlots((prevSlots) => [...prevSlots, selectedHour]);
    }
  };

  useEffect(() => {
    const formattedSlots = selectedSlots.map((slot) =>
      slot.format('YYYY-MM-DD HH:mm')
    );
    console.log(formattedSlots);
  }, [selectedSlots]);

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
              {[...Array(12)].map((_, index) => {
                const hour = index + 1;
                const selectedHour = selectedDay.clone().hour(hour);
                const isSelected = selectedSlots.some((slot) => slot.isSame(selectedHour));

                return (
                  <div
                    className={isSelected ? styles.hourBoxSelected : styles.hourBox}
                    key={index}
                    onClick={() => handleHourClick(hour)}
                  >
                    {formatHour(hour)} - {formatHour(hour + 1)}
                  </div>
                );
              })}
            </div>
            <div className={styles.column}>
              <h4 className={styles.h4text}>PM</h4>
              {[...Array(12)].map((_, index) => {
                const hour = index + 13;
                const selectedHour = selectedDay.clone().hour(hour);
                const isSelected = selectedSlots.some((slot) => slot.isSame(selectedHour));

                return (
                  <div
                    className={isSelected ? styles.hourBoxSelected : styles.hourBox}
                    key={index}
                    onClick={() => handleHourClick(hour)}
                  >
                    {formatHour(hour - 12)} - {formatHour(hour - 11)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={showHours ? styles.buttons : styles.nobuttons} >
        <button className={styles.saveButton}>save</button>
        <button className={styles.cancelButton} onClick={()=>setShowHours(false)}>cancel</button>
    </div>
 
    </div>
  );
}

  

function SchedulePage() {
return (
<>
    <div className={styles.maincontainer}>
    <Calendar />
    </div>
    </>
);
}

export default SchedulePage;