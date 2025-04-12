import React from 'react';

const ActiveFiltersDisplay = ({ activeFilters, removeFilter }) => {
  return (
    <div className="mt-2 mx-2">
      {activeFilters.length > 0 ? (
        <div className="d-flex flex-wrap">
          {activeFilters.map((filter) => (
            <div
              key={filter}
              className="badge bg-primary bg-opacity-10 text-primary me-2 mb-2"
              style={{ fontWeight: '800' }} // Optional: Make text a bit bold for better readability
            >
              {filter}
              <span
                className="ms-2 cursor-pointer"
                onClick={() => removeFilter(filter)}
              >
                <i className="ri-close-line" />
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted"></p>
      )}
    </div>
  );
};

export default ActiveFiltersDisplay;
