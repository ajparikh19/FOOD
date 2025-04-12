import React from "react";
import Select from "react-dropdown-select";

const SelectCountry = ({ countries, value, onChange }) => {
  // Convert countries array into react-dropdown-select format
  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.name,
  }));

  // Find the selected option
  const selectedOption = countryOptions.find((option) => option.value ===  parseInt(value));

  const handleChange = (selected) => {
    // Ensure at least one item is selected
    const selectedValue = selected.length > 0 ? selected[0].value : "";
    onChange({ target: { name: "country", value: selectedValue } });
  };

  return (
    <Select
      options={countryOptions}
      values={selectedOption ? [selectedOption] : []}
      onChange={handleChange}
      searchable 
      placeholder="Search and select a country..."
      className="w-full custome-react-select"
    />
  );
};

export default SelectCountry;
