import React from "react";
import PropTypes from "prop-types";

const ToggleSwitch = ({ status, onToggle, id }) => {
  const handleToggle = () => {
    // Toggle the status and call the onToggle function with id and the current status
    onToggle(id, status);
  };

  return (
    <div
      className="toggle-switch-container d-flex justify-content-start align-items-center"
      onClick={handleToggle} // Trigger the onToggle function passed as a prop
    >
      <div className={`toggle ${status === "1" ? "on" : ""} mb-3`}>
        <span></span>
      </div>
    </div>
  );
};

ToggleSwitch.propTypes = {
  status: PropTypes.number.isRequired, // 1 or 0 representing active or inactive status
  onToggle: PropTypes.func.isRequired, // Function to handle the toggle action
  id: PropTypes.number.isRequired, // The ID of the item to toggle
};

export default ToggleSwitch;
