import React from "react";

const SelectField = ({ name, value, onChange, options, disabled = false, placeholder = "Select" }) => {
  return (
    <select
      className="form-select"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {/* Optional placeholder */}
      <option value="">{placeholder} {name}</option>

      {/* Render options */}
      {options && options?.map((option) => {
        // If option is an object, use its value and label properties
        if (typeof option === "object" && option.value && option.label) {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        }

        // If option is a string, just display it
        return (
          <option key={option} value={option}>
            {option}
          </option>
        );
      })}
    </select>
  );
};

export default SelectField;
