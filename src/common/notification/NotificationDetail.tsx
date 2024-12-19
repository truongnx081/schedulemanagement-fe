import React from "react";
import { useLocation } from "react-router-dom";
import Container from "../../component/Container.tsx";

function NotificationDetail() {
  const location = useLocation();
  const { notification } = location.state || {};

  if (!notification) {
    return <div>No notification data available</div>;
  }

  return (
    <Container>
      <div className="mb-8 p-6 border border-gray-300 rounded-md shadow-lg bg-white">
        <div className="mb-6 text-center">
          {/* Content */}
          <h1 className="font-bold text-[50px] text-red-700 mb-4">{notification.content}</h1>
          {/* Sender and Date */}
          <div className="text-gray-500 text-[20px] italic">
            <p className="mb-2">Người gửi: <span className="font-medium">{notification.sender}</span></p>
            <p>Ngày: <span className="font-medium">{notification.date}</span></p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default NotificationDetail;
