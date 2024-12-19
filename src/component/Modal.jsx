import React, { useState } from "react";
import Button from "./Button"; // Đảm bảo đường dẫn đúng

const Modal = ({ isOpen, onClose, children, className, label ,showHead=true}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50 modal-overlay"
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white px-6 pb-6 rounded shadow-lg relative ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showHead && <>
        <div className="flex items-center justify-between bg-white md:static sticky top-0 h-[80px] border-b border-b-gray-500">
          
          
          <h1 className="font-medium text-xl">{label}</h1>
          <Button
            onClick={onClose}
            label="X"
            className="w-[40px] bg-white flex justify-center text-center text-black hover:text-red-600 hover:bg-transparent font-medium text-[20px] p-1"
          />

        </div>
          </>}

        <div className="mb-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
