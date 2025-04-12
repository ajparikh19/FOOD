import React from 'react';
// import './Dropdown.module.css';

const Dropdown = ({ id, children }) => (
    <div className="dropdown">
    <button
      className="btn btn-icon waves-effect waves-light"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      title="Actions"
    >
      <i className="ri-more-2-fill text-black"></i>
    </button>
        <ul className="dropdown-menu" aria-labelledby={id}>
            {children}
        </ul>
    </div>
);

export default Dropdown;

