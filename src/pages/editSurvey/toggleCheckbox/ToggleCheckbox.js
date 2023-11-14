import React from 'react';
import './toggleCheckbox.css';

const ToggleCheckbox = ({ id, isChecked, handleClickRequired }) => {
  const handleCheckboxChange = () => {
    handleClickRequired(id, !isChecked);
  };

  return (
    <label className="switch" htmlFor={id}>
      <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} id={id} />
      <span className="slider" />
    </label>
  );
};

export default ToggleCheckbox;
