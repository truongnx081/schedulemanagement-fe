import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CheckBox = ({ label, id, name, value, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    onChange(name, event.target.checked);
  };

  return (
    <div>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        onChange={handleChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

CheckBox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

CheckBox.defaultProps = {
  value: "",
  checked: false,
};

export default CheckBox;
