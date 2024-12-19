import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TextField = ({
  label,
  id,
  name,
  value,
  icon,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  onField = false,
  sideField = false,
  className,
  className1 = "",
  className2 = "",
  min, // Add min prop
  max, // Add max prop
  required = true,
}) => {
  const handleFocus = (event) => {
    event.target.select(); // Selects all text inside the input field
  };

  return (
    <div className={`${className}`}>
      {onField && (
        <>
          {label && (
            <label className="block text-sm text-gray-500 mb-1">{label}</label>
          )}
          <div
            className={`flex items-center border border-gray-300 rounded-lg p-2 w-full ${className1} ${disabled ? "bg-gray-50" : ""
              } focus-within:ring-2 focus-within:ring-blue-500`}
          >
            {icon && (
              <FontAwesomeIcon
                icon={icon}
                className="text-gray-500 text-xl mr-2"
              />
            )}
            <input
              type={type}
              id={id}
              name={name}
              required={required}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              disabled={disabled}
              className={`flex-grow focus:outline-none ${className2} ${disabled ? "bg-gray-50 cursor-default" : ""
                }`}
              min={type === "number" ? min : undefined} // Set min if type is number
              max={type === "number" ? max : undefined} // Set max if type is number
              onFocus={handleFocus}
            />
          </div>
        </>
      )}
      {sideField && (
        <>
          <div className="flex items-center w-full">
            <span className="text-[16px] text-gray-500 mr-2 min-w-[50px] w-[50px] max-w-[200px] text-left">
              {label}
            </span>
            <div
              className={`flex items-center border border-gray-300 rounded-lg p-2 w-full ${disabled ? "bg-gray-50" : ""
                } focus-within:ring-2 focus-within:ring-blue-500`}
            >
              {icon && (
                <FontAwesomeIcon
                  icon={icon}
                  className="text-gray-500 text-xl mr-2"
                />
              )}
              <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`flex-grow focus:outline-none ${disabled ? "bg-gray-50 cursor-default" : ""
                  } `}
                min={type === "number" ? min : undefined} // Set min if type is number
                max={type === "number" ? max : undefined} // Set max if type is number
                onFocus={handleFocus}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TextField;
