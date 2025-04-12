import React, { useState, useEffect } from 'react';

const Week = ({ onDateChange, loading }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    onDateChange(currentDate);
  }, [currentDate, onDateChange]);

  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const formatWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start on Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6); // End on Sunday
    const options = { day: 'numeric', month: 'short' };
    return `${startOfWeek.toLocaleDateString('default', options)} - ${endOfWeek.toLocaleDateString('default', options)}`;
  };

  return (
    <div className="week-selector">
      <button className="btn btn-primary mx-2" onClick={handlePreviousWeek} disabled={loading}>&lt;</button>
      <label className="form-label">{formatWeek(currentDate)}</label>
      <button className="btn btn-primary mx-2" onClick={handleNextWeek} disabled={loading}>&gt;</button>
    </div>
  );
};

export default Week;
