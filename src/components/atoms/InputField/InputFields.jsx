import React from "react";

const InputField = ({ type, name, value, onChange, placeholder, required = false }) => {
  return (
    <input
      className="form-control"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  );
};

export default InputField;
