import React, { useState ,useContext} from 'react';
import moment from 'moment';
import styles from './schedulepageteacher.module.css';
import { useEffect } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from 'axios';
import BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';

function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showHours, setShowHours] = useState(false);

  const { savedSlot, setSavedSlot } = useContext(AuthContext);

  const [loading,setLoading] = useEffect(true)

  useEffect(() => {
    setLoading(true)
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
        
        // Convert the array of Unix timestamps to an array of Moment objects
        const convertedData = responseData.map(timestamp => moment.unix(parseInt(timestamp)));
        
        setSavedSlot(convertedData)
        setLoading(false)
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchData();
  }, []);
  



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
    //  console.log(day.format('YYYY-MM-DD')); // Log the selected day in YYYY-MM-DD format
    }
  };

  return (
    <>
    {loading ? <p>...loading </p> : 
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
       }
 </>
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
  const { savedSlot, setSavedSlot } = useContext(AuthContext);

  const savedSlotDates = savedSlot.map(dateString => moment(dateString));



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
            
            const hasTimeslot = savedSlotDates.some(slotDate =>
                slotDate.isSame(currentDate, 'day')
              );
              if (hasTimeslot) {
                classNames.push(styles.activeDay);
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
 // const [selectedSlots, setSelectedSlots] = useState([]);
  const { savedSlot, setSavedSlot } = useContext(AuthContext);

  

  const handleHourClick = (hour) => {
    const selectedHour = selectedDay.clone().hour(hour);
    const isSelected = savedSlot.some((slot) => slot.isSame(selectedHour));

    if (isSelected) {
        setSavedSlot((prevSlots) => prevSlots.filter((slot) => !slot.isSame(selectedHour)));
    } else {
        setSavedSlot((prevSlots) => [...prevSlots, selectedHour]);
    }
  };

  

/*   useEffect(() => {
    const formattedSlots = savedSlot.map((slot) =>
      slot.format('YYYY-MM-DD HH:mm')
    );

     const utcFormat = formattedSlots.map((formattedSlot) => {
        const milliseconds = moment(formattedSlot).valueOf();
        return milliseconds.toString(); // Convert to string
      });
      console.log('utc:',utcFormat)
    //  setSavedSlot(utcFormat)

    console.log('selectedSlots',savedSlot)
   
    const commonFormat = savedSlot.map(slot => slot.unix().toString());
   console.log(commonFormat)

    const momentObjects = commonFormat.map(timestamp => moment.unix(parseInt(timestamp)));
    console.log('momentObjects',momentObjects);
 

 
}, [savedSlot]); */

const navigate = useNavigate()

const saveTimeSlotFunction = async () => {



    const commonFormat = savedSlot.map(slot => slot.unix().toString());
  console.log(commonFormat)

    try {
      const url = `${BASE_URL}/teachersavescheduleslot`;
      const data = {
        datesArray: commonFormat,
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      const response = await axios.put(url, data, config);
      console.log(response);
      if (response.status == 201) { navigate('../teacherzone')} 
    } catch (err) {
      console.log(err);
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
              {[...Array(12)].map((_, index) => {
                const hour = index + 1;
                const selectedHour = selectedDay.clone().hour(hour);
                const isSelected = savedSlot.some((slot) => slot.isSame(selectedHour));

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
                const isSelected = savedSlot.some((slot) => slot.isSame(selectedHour));

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
        <button className={styles.saveButton} onClick={saveTimeSlotFunction}>save</button>
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