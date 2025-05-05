import React, { useState, useMemo } from 'react';
import '../Style/Availability.css';

function Availability({ availability = [] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Convert array to map for fast lookup: { "YYYY-MM-DD": "Status" }
  const availabilityMap = useMemo(() => {
    const map = {};
    availability.forEach(item => {
      if (item.date && item.status) {
        map[item.date] = item.status;
      }
    });
    return map;
  }, [availability]);

  const getFormattedDate = (year, month, day) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const generateCalendar = () => {
    const calendar = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    let week = new Array(firstDayOfMonth).fill('');
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = getFormattedDate(currentYear, currentMonth, day);
      const status = availabilityMap[dateStr] || '';
      week.push({ day, status, dateStr });

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) week.push('');
      calendar.push(week);
    }

    return calendar;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-dark btn-sm" onClick={handlePrevMonth}>← Prev</button>
        <h5 className="mb-0">{monthNames[currentMonth]} {currentYear}</h5>
        <button className="btn btn-outline-dark btn-sm" onClick={handleNextMonth}>Next →</button>
      </div>

      <table className="table text-center calendar-table">
        <thead className="table-light">
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generateCalendar().map((week, i) => (
            <tr key={i}>
              {week.map((cell, j) =>
                typeof cell === 'object' ? (
                  <td key={j}
                      className={
                        cell.status === 'Booked' ? 'bg-danger text-white'
                        : cell.status === 'Available' ? 'bg-success text-white'
                        : ''
                      }>
                    <div>{cell.day}</div>
                    <div className="small">{cell.status}</div>
                  </td>
                ) : (
                  <td key={j}></td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-2">
        ✅ Green = Available, ❌ Red = Booked.
      </p>
      {/* <button className="btn btn-danger">Request Date</button> */}
    </div>
  );
}

export default Availability;
