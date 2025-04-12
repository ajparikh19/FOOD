import React from "react";

const CheckboxField = ({ label, name, checked, onChange }) => {
  return (
    <div className="col-md-4 mt-2 mb-2 d-flex align-items-center">
    <div className="form-check mt-4 ">
      <input
        className="form-check-input "
        type="checkbox"
        name={name}
        id={name}
        checked={checked}
        onChange={onChange}
        />
      <label className="form-check-label" htmlFor={name}>
        {label}
      </label>
    </div>
       </div>
  );
};

export default CheckboxField;
