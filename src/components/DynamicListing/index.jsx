import React, { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import "../../../public/assets/flatpickr/flatpickr.min.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Month from "../../components/month/Month.jsx";
import Day from '../day/Day.jsx';
import Week from '../week/Week.jsx';
import { toast } from 'react-toastify';
import API from '../../http/api';

const validationSchema = yup.object().shape({
  start_date: yup.string().required("Start Date is required"),
  end_date: yup.string().required("End Date is required"),
});
const DynamicListing = ({  loading,setDateInParent,setSelectedOptionKey ,setFilterDate ,setDates }) => {
  const [selectedOption, setSelectedOption] = useState('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => {
    if (setDateInParent) {
      setDateInParent(currentDate); // Only update if function is passed
    }
  }, [currentDate, setDateInParent]);
  setSelectedOptionKey(selectedOption);
  const tabOptions = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Custom', value: 'custom' },
  ];

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    // resolver: yupResolver(validationSchema),
  });



  const onSubmit = async (formValue) => {
    let startDate, endDate;
    const formData = new FormData();
    if (selectedOption == 'day') {
      startDate = currentDate.toISOString().split('T')[0];
      endDate = startDate; // Single day for both start and end
    } else if (selectedOption == 'week') {
      // Calculate start and end of current week
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      startDate = startOfWeek.toISOString().split('T')[0];
      endDate = endOfWeek.toISOString().split('T')[0];
    } else if (selectedOption == 'month') {
      // First and last day of current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      startDate = startOfMonth.toISOString().split('T')[0];
      endDate = endOfMonth.toISOString().split('T')[0];
    } else {
      startDate = formValue.start_date;
      endDate = formValue.end_date;
    }
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
  
     const params = {
      start_date: startDate,
      end_date: endDate,
      date_type:"custom"
    };
    
    setFilterDate(
      selectedOption === "custom"
      ? {
          date_type: selectedOption,
          start: startDate,
          end: endDate,
        }
      : {
          date_type: selectedOption,
          date: startDate, // Single date for other types
        }
    )
    setDates(
      selectedOption === "custom"
        ? {
            date_type: selectedOption,
            start: startDate,
            end: endDate,
          }
        : {
            date_type: selectedOption,
            date: startDate, // Single date for other types
          }
    );
    
  };

  return (
    <div className='d-flex align-items-center gap-2'>
      <div className="card m-0">
        <ul className="nav nav-tabs nav-tabs-header mb-0 d-flex flex-row" role="tablist">
          {tabOptions.map(option => (
            <li
              className="nav-item m-1"
              role="presentation"
              key={option.value}
              onClick={() => setSelectedOption(option.value)}
            >
              <a  className={`nav-link ${selectedOption === option.value ? 'active' : ''}`}
                role="tab" >
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {selectedOption === 'day' && <Day onDateChange={setCurrentDate} loading={loading} />}
      {selectedOption === 'week' && <Week onDateChange={setCurrentDate} loading={loading} />}
      {selectedOption === 'month' && <Month onDateChange={setCurrentDate} loading={loading} />}

      {selectedOption === 'custom' && (
       <div className="form-group">
         <div className="input-group align-items-center">
           <div className="fw-semibold me-2">From:</div>
           <div className="input-group-text text-muted"><i className="ri-calendar-line"></i></div>
          <input
          type="date"
          className="form-control me-2"
          id="start_date"
          {...register("start_date")}
          style={{
            maxWidth: '100px',
            // color: 'transparent', // Hide placeholder text
            // textIndent: '-9999px', // Prevent visible default text
            // caretColor: 'black' // Keep the caret visible
          }}/>

           <div className="fw-semibold me-2">To:</div>
           <div className="input-group-text text-muted"><i className="ri-calendar-line"></i></div>
           <input
             type="date"
             className="form-control me-2"
             id="end_date"
            //  placeholder="End date"
             {...register("end_date")}
             style={{
              maxWidth: '100px',
              // color: 'transparent', // Hide placeholder text
              // textIndent: '-9999px', // Prevent visible default text
              // caretColor: 'black' // Keep the caret visible
            }}
          
           />
          
           </div>
          </div>
      )}

      <button onClick={handleSubmit(onSubmit)} className="btn btn-primary ml-2">Submit</button>
    </div>
  );
};

export default DynamicListing;
