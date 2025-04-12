import React, { useState, useRef, useEffect } from "react";

const MultiSelectField = ({
  name,
  value=[],
  onChange,
  options,
  disabled = false,
  label = "Select Options", // Label for the field
  placeholder = "Select Options", // Placeholder for the dropdown
  removeButton = true,
  multiple = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
 
  // Handle removing individual options from selection
  const handleRemove = (valueToRemove) => {
    const newValue = value?.filter((val) => val !== valueToRemove);

    onChange({ target: { name, value: newValue } });
  };
;
  // Get the label for a given value
  const getLabel = (value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // Handle change in the multi-select field
  const handleSelectChange = (selectedValue) => {
    let newValue = [...value];
    if (newValue?.includes(selectedValue)) {
      newValue = newValue?.filter((val) => val !== selectedValue); // Unselect if already selected
    } else {
      newValue?.push(selectedValue); // Add to selected if not already selected
    }
    onChange({ target: { name, value: newValue } });
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prevState) => !prevState);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="multi-select-wrapper" ref={dropdownRef}>
      {/* Display heading as the main label */}
      {label && <h4 className="form-label">{label}</h4>}

      {/* Dropdown field */}
      <div
        className={`custom-dropdown form-select ${isOpen ? "open" : ""} ${
          disabled ? "disabled" : ""
        }`}
        onClick={toggleDropdown}
      >
        <div className="selected-box">
          {/* Show selected items as badges or placeholder */}
          {value?.length > 0 ? (
            <div className="selected-options">
              {value?.map((selectedItem) => (
                <span
                  key={selectedItem}
                  className="badge bg-primary-transparent d-inline-flex align-items-center p-1 me-2 position-relative"
                >
                  {getLabel(selectedItem)}
                  {removeButton && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing dropdown on remove click
                        handleRemove(selectedItem);
                      }}
                      className="btn-close ms-2"
                      aria-label="Remove"
                    />
                  )}
                </span>
              ))}
            </div>
          ) : (
            <span className="placeholder-text">{placeholder}</span>
          )}
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <ul className="dropdown-list list-unstyled">
            {options.map((option) => (
              <li
                key={option.value}
                className={`dropdown-item ${
                  value?.includes(option.value) ? "selected" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent toggle of dropdown when selecting option
                  handleSelectChange(option.value);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultiSelectField;
