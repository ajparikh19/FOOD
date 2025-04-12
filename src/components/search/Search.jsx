import React, { useState } from "react";
import PropTypes from "prop-types";

const Search = ({ addFilter, filterOptions, searchKey, setSearchKey }) => {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]?.value || "All");

  const handleSearchKeyChange = (e) => {
      setSearchKey(e.target.value.trimStart());
  };

  const handleFilterAdd = () => {
      if (selectedFilter !== "All" && searchKey.trim() !== "") {
          const filterEntry = `${selectedFilter} : ${searchKey}`;
          addFilter(filterEntry);
          setSearchKey(""); // Clear the search input
      }
  };

  return (
      <div className="d-flex align-items-center">
          <div className="me-2 mt-2">
              <select
                  className="form-select"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
              >
                  {filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                          {option.label}
                      </option>
                  ))}
              </select>
          </div>
          <div className="d-flex align-items-center mt-2">
              <input
                  className="form-control me-2"
                  type="text"
                  placeholder={`Search by ${selectedFilter.toLowerCase()}`}
                  value={searchKey}
                  onChange={handleSearchKeyChange}
              />
              <button
                  type="button"
                  className="btn btn-primary mx-1"
                  onClick={handleFilterAdd}
                  disabled={searchKey === ""}
              >
                  <i className="ri-search-line" />
              </button>
          </div>
      </div>
  );
};

Search.propTypes = {
  addFilter: PropTypes.func.isRequired, // Function to add a filter
  filterOptions: PropTypes.arrayOf(PropTypes.string).isRequired, // Dropdown filter options
};

export default Search;
