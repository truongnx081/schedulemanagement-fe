import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

function Notify({ menuNotifys = [], iconNotify = "" }) {
  const [notify, setNotify] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setNotify(!notify);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setNotify(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        label={<FontAwesomeIcon icon={iconNotify} size={'sm'} />}
        onClick={toggleMenu}
        className="p-2 block text-black text-3xl bg-transparent"
      />

      {/* Conditional rendering for the mini-menu */}
      {notify && (
        <div className="absolute right-0 p-1 mt-3 w-[250px] bg-white border rounded shadow-md z-50">
          {menuNotifys.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={"w-full px-2 py-1 text-left hover:bg-[#fff1f1]"}
            >
              <p className="font-medium text-[14px]">{item.title}</p>
              <p className="font-medium text-[10px] truncate">{item.des}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notify;
