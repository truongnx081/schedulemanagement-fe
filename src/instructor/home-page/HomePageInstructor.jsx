import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEvent } from "../../api/Event";
import { getRoleFromToken } from "../../api/DecodeToken";
import { format } from "date-fns";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";

function HomePageInstructor() {
  const navigate = useNavigate();

  const [className, setClassName] = useState("w-1/4");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 783) {
        setClassName("w-1/2 ");
      } else {
        setClassName("w-1/4");
      }
    };
    window.addEventListener("resize", handleResize);
    // Kiểm tra kích thước màn hình khi component được mount
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [className]);

  const [userRole, setUserRole] = useState(null);
  const [eventInfo, setEventInfo] = useState([]);
  useEffect(() => {
    const role = getRoleFromToken();
    setUserRole(role);
    getEvent()
      .then((response) => {
        setEventInfo(response);
      })
      .catch((error) => {
        console.error("Failed to fetch event info:", error);
      });
  }, []);

  const baseUrl =
    "https://res.cloudinary.com/dc06mgef2/image/upload/v1734324086/";

  return (
    <Container>
      <TitleHeader title="SỰ KIỆN" />
      <div className="min-h-[700px]">
        {eventInfo.map((event) => (
          <div key={event.id} className={`w-1/2 md:w-1/4 p-4 inline-block`}>
            <button
              className="w-full rounded-md overflow-hidden bg-slate-100"
              onClick={() => {
                navigate(`/su-kien/${encodeURIComponent(event.name)}`, {
                  state: { event },
                });
              }}
            >
              <img
                className="w-full h-32 object-cover"
                src={`${baseUrl}${event.image}`}
                alt={event.name}
              />
              <div className="px-4">
                <p className="text-left font-medium text-lg truncate my-1">
                  {event.name}
                </p>
                <p className="text-left truncate my-1">{event.place}</p>
                <p className="text-right text-slate-500 my-1">
                  {format(new Date(event.date), "dd-MM-yyyy")}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default HomePageInstructor;
