// frontend/src/components/MonthSelectorDropdown.js
import React from 'react';

const MonthSelectorDropdown = ({ selectedMonth, handleMonthChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="month-selector">
      <label htmlFor="month">Select Month:</label>
      <select id="month" value={selectedMonth} onChange={handleMonthChange}>
        {months.map((month, index) => (
          <option key={index} value={month}>{month}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelectorDropdown;
