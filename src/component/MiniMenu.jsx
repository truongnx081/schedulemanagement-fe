import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";

function MiniMenu({
  menuItems = [{}],
  iconMenu,
  classNameBtn = "",
  classNameMiniBox = "",
}) {
  const [miniMenu, setMiniMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMiniMenu(!miniMenu);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMiniMenu(false);
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
        label={<FontAwesomeIcon icon={iconMenu} size={"xs"} />}
        onClick={toggleMenu}
        className={`block text-black text-3xl bg-transparent focus:outline-none ${classNameBtn}`}
      />

      {/* Conditional rendering for the mini-menu */}
      {miniMenu && (
        <div
          className={`absolute right-0 min-w-max bg-white border rounded shadow-md z-50 px-1 ${classNameMiniBox}`}
        >
          {menuItems.map((item, index) => (
            <Button
              key={index}
              disabled={item.disabled}
              label={
                <>
                  {item.icon && (
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                  )}
                  {item.text}
                </>
              }
              onClick={() => {
                item.onClick();
                setMiniMenu(false); // Close the menu after clicking
              }}
              className="justify-center text-white w-full p-1 px-[10.5px] my-1"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MiniMenu;
