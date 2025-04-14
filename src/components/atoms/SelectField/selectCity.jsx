import React from "react";
import Select from "react-dropdown-select";

const SelectCity = ({ cities, value, onChange, disabled }) => {
  // Convert cities array into react-dropdown-select format
  const cityOptions = cities?.map((city) => ({
    value: city?.id,
    label: city?.name,
  }));

  // Find the selected option
  const selectedOption = cityOptions.find((option) => option.value ===  parseInt(value));

  const handleChange = (selected) => {
    const selectedValue = selected.length > 0 ? selected[0].value : "";
    onChange({ target: { name: "city", value: selectedValue } });
  };

  return (
    <Select
    className="w-full custome-react-select" 
      options={cityOptions}
      values={selectedOption ? [selectedOption] : []}
      onChange={handleChange}
      disabled={disabled} 
      searchable
      placeholder="Search and select a city..."
      labelField="label"
      valueField="value"

    />
  );
};

export default SelectCity;
