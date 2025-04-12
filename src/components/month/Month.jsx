import React, { useState, useEffect } from 'react';

const Month = ({ onDateChange, loading }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    onDateChange(currentMonth);
  }, [currentMonth, onDateChange]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const formatMonth = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <div className="month-selector">
      <button className="btn btn-primary mx-2" onClick={handlePreviousMonth} disabled={loading}>&lt;</button>
      <label className="form-label">{formatMonth(currentMonth)}</label>
      <button className="btn btn-primary mx-2" onClick={handleNextMonth} disabled={loading}>&gt;</button>
    </div>
  );
};

export default Month;
