import React from "react";
import Label from "../../atoms/Labels/Labels"; // Assuming Label is a simple wrapper for a <label> element
import SelectField from "../../atoms/SelectField/SelectField"; // Assuming SelectField is a styled <select> element
import InputField from "../../atoms/InputField/InputFields"; // Assuming InputField is a styled <input> element

const FormGroup = ({
  label,
  type,
  name,
  value,
  onChange,
  options = [], // Default to an empty array if no options are passed
  placeholder,
  required = false, // Default to false if not provided
  disabled = false, // Default to false if not provided
}) => {
  return (
    <div className="form-group">
      {/* Label for accessibility */}
      <Label htmlFor={name}>{label}</Label>

      {/* Conditionally render either InputField or SelectField based on the type */}
      {/* Conditionally render fields based on type or label */}
      {type === "select" ? (
        <SelectField
          name={name}
          value={value}
          onChange={onChange}
          options={options}
          disabled={disabled}
          required={required}
        />
      ) : label === "Birth Date" ? (
        <InputField
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          max={new Date().toISOString().split("T")[0]} // Only allow past dates
        />
      ) : (
        <InputField
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default FormGroup;
