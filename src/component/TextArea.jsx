import React from "react";

const TextArea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className,
  className1,
  disabled = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm text-gray-500 mb-1">{label}</label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 ${className1} ${disabled ? "bg-gray-50 cursor-not-allowed" : "focus:ring-blue-500"
          }`}
        style={{ resize: "vertical" }} // Cho phép thay đổi kích thước chiều cao
      />
    </div>
  );
};

export default TextArea;
