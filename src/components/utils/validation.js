// src/utils/validation.js

export const validateRequired = (value, fieldName) =>
  value ? null : `${fieldName} is required.`;

  
  export const validateEmail = (value) => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Enter a valid email address.";
  
  export const validatePhone = (value) => 
    /^\d{10}$/.test(value) ? null : "Enter a valid 10-digit phone number.";
  
  export const validateZipcode = (value) => 
    /^\d{5,6}$/.test(value) ? null : "Enter a valid ZIP code.";
  
  export const validateMinLength = (value, min) => 
    value && value.length >= min ? null : `Must be at least ${min} characters.`;
  
  export const validateMaxLength = (value, max) => 
    value && value.length <= max ? null : `Must be no more than ${max} characters.`;
  
  export const validatePattern = (value, pattern, errorMessage = "Invalid format.") => 
    pattern.test(value) ? null : errorMessage;
  