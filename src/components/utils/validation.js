// src/utils/validation.js

export const validateRequired = (value, fieldName) =>
  value ? null : `${fieldName} is required.`;

  
  export const validateEmail = (value) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Enter a valid email address.";
  
  export const validatePhone = (value) => {
    if (!value) return "Phone number is required";
    if (!/^\d+$/.test(value)) return "Only numbers are allowed";
    if (value.length !== 10) return "Must be exactly 10 digits";
    return null;
  };
  
  export const validateZipcode = (value) => {
    if (!value) return "Pincode is required";
    if (!/^\d+$/.test(value)) return "Only numbers are allowed";
    if (value.length !== 6) return "Must be 6 digits";
    return null;
  };

  export const validateNumeric = (value, fieldName) => 
    /^\d+$/.test(value) ? null : `${fieldName} must contain only numbers`;
  
  export const validateExactLength = (value, length, fieldName) =>
    value.length === length ? null : `${fieldName} must be ${length} digits`;
  
  export const validateMinLength = (value, min) => 
    value && value.length >= min ? null : `Must be at least ${min} characters.`;
  
  export const validateMaxLength = (value, max) => 
    value && value.length <= max ? null : `Must be no more than ${max} characters.`;
  
  export const validatePattern = (value, pattern, errorMessage = "Invalid format.") => 
    pattern.test(value) ? null : errorMessage;
  