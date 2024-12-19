import React, { useState } from "react";
import PropTypes from "prop-types";

const Tooltip = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div className="relative w-full inline-block ">
      <div
        className="cursor-pointer"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div className=" absolute top-1/2 left-full transform -translate-y-1/2 ml-2 p-2 pr-6 rounded-e-3xl border-r-4 border-t-2 border-b-2 border-blue-100 bg-white text-black text-base font-medium rounded z-50 inline-block whitespace-nowrap tooltip-slide-in">
          {text}
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

export default Tooltip;
