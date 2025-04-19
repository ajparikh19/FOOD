import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Button = ({ label, icon, onClick, to, variant = "primary", size = "sm", className = "", children,...props }) => {
  const buttonClass = `btn btn-${size} btn-${variant} ${className}`.trim();

  const content = (
    <>
      {icon && <i className={`${icon} me-1 align-middle`}></i>}
      {label || children}
    </>
  );

  if (to) {
    // If the 'to' prop is provided, render a Link component
    return (
      <Link to={to} className={buttonClass} {...props}>
        {content}
        {icon && <i className={`${icon} ms-1 align-middle`}></i>}
      </Link>
    );
  }

  // Otherwise, render a standard button
  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {content}
      {icon && <i className={`${icon} ms-1 align-middle`}></i>}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string, // Button label
  icon: PropTypes.string, // Optional icon class (e.g., 'ri-add-line')
  onClick: PropTypes.func, // Callback for button click
  to: PropTypes.string, // If provided, renders a Link instead of a button
  variant: PropTypes.oneOf(["primary", "secondary", "success", "danger", "warning", "light", "dark", "primary-light"]), // Button variant
  size: PropTypes.oneOf(["sm", "md", "lg"]), // Button size
  className: PropTypes.string, // Additional classes
};

export default Button;
