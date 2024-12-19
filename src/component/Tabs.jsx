import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label); // Đặt tab đầu tiên là tab hoạt động mặc định

  return (
    <div className="tabs">
      {/* Tiêu đề Tab */}
      <ul className="flex border-b">
        {tabs.map((tab) => (
          <li
            key={tab.label}
            className={`cursor-pointer px-4 py-2 ${
              activeTab === tab.label ? "border-b-2 border-black font-bold" : ""
            }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </li>
        ))}
      </ul>

      {/* Nội dung Tab */}
      <div className="">
        {tabs.map(
          (tab) =>
            activeTab === tab.label && <div key={tab.label}>{tab.content}</div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
