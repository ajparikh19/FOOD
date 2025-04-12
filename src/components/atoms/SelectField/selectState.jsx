import React from "react";
import Select from "react-dropdown-select";

const SelectState = ({ states, value, onChange, disabled }) => {
  // Convert states array into react-dropdown-select format
  const stateOptions = states.map((state) => ({
    value: state?.id,
    label: state?.name,
  }));

  // Find the selected option
  const selectedOption = stateOptions.find((option) => option.value === parseInt(value));

  const handleChange = (selected) => {
    // Ensure at least one item is selected
    const selectedValue = selected.length > 0 ? selected[0].value : "";
    onChange({ target: { name: "state", value: selectedValue } });
  };

  return (
    <Select
      options={stateOptions}
      values={selectedOption ? [selectedOption] : []}
      onChange={handleChange}
      searchable
      disabled={disabled} 
      placeholder="Search and select a state..."
      className="w-full custome-react-select" // Adjust width if needed
    />
  );
};

export default SelectState;
