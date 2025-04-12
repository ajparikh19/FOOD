import React, { useState, useEffect } from 'react';

const Day = ({ onDateChange, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    onDateChange(currentDate);
  }, [currentDate, onDateChange]);

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  return (
    <div className="day-selector">
      <button className="btn btn-primary mx-2" onClick={handlePreviousDay} disabled={loading}>&lt;</button>
      <label className="form-label">{formatDate(currentDate)}</label>
      <button className="btn btn-primary mx-2" onClick={handleNextDay} disabled={loading}>&gt;</button>
    </div>
  );
};

export default Day;
