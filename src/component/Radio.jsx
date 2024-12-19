import React from 'react';

const Radio = ({ label, name, value, onChange, checked = false, className }) => {
    return (
        <label className={`flex items-center space-x-2 ${className}`}>
            <input
                type="radio"
                name={name}
                value={value}
                onChange={onChange}
                checked={checked}
                className="form-radio text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-gray-700">{label}</span>
        </label>
    );
};

export default Radio;
