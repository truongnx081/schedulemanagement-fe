import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Table from "../../component/Table";
import MiniMenu from "../../component/MiniMenu";
import Accordion from "../../component/Accordion";
import Button from "../../component/Button";
import { getTeacherSchedule } from "../../api/Teacher";
import { addDays, format, parseISO } from "date-fns";

import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { cancelSchedule, getScheduleById } from "../../api/Schedule.js";
import { toast } from "react-toastify";
import { getRetakeSchedule } from "../../api/RetakeSchedule.js";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import Modal from "../../component/Modal.jsx";
import Modal2 from "../../component/Modal2.tsx";

function TeachDay() {
  const navigate = useNavigate();
  const [desktop, setDesktop] = useState(true);
  const [mobile, setMobile] = useState(false);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setMobile(true);
        setDesktop(false);
      } else {
        setDesktop(true);
        setMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAttendanceClick = useCallback(
    (clazz) => {
      navigate(
        `/diem-danh/${encodeURIComponent(clazz.code)}/${encodeURIComponent(
          clazz.subjectCode
        )}`,
        { state: { item: clazz } }
      );
    },
    [navigate]
  );

  const headers = ["Ngày", "Ca 1", "Ca 2", "Ca 3", "Ca 4", "Ca 5", "Ca 6"];

  // State management
  const [selectedDay, setSelectedDay] = useState(7); // Default to 7 days
  const [teach, setTeach] = useState([]);
  const [retake, setRetake] = useState([]);

  const updatedTeach = teach.map((item) => ({
    ...item,
    retakescheduleId: null,
  }));
  const teachDays = [...updatedTeach, ...retake];

  //const [teachDays, setTeachDays] = useState([]);

  const [today] = useState(new Date()); // Today's date
  // Log the current date to verify it's correct
  //console.log("Current Date:", today);
  const formattedToday = format(today, "yyyy-MM-dd");
  // Handle day selection change
  const handleDayChange = (event) => {
    setSelectedDay(parseInt(event.target.value));
  };

  // Fetch teacher's schedule
  useEffect(() => {
    if (selectedDay) {
      const selectedDate = addDays(today, selectedDay);
      const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");

      getTeacherSchedule(formattedToday, formattedSelectedDate)
        .then((data) => {
          setTeach(data);
          //console.log("Fetched Teach Days:", data);
        })
        .catch((error) => {
          console.error("Error fetching teach days:", error);
        });
    }
  }, [selectedDay]);

  useEffect(() => {
    if (selectedDay) {
      const selectedDate = addDays(today, selectedDay);
      const formattedSelectedDate = format(selectedDate, "yyyy-MM-dd");

      getRetakeSchedule(formattedToday, formattedSelectedDate)
        .then((data) => {
          setRetake(data);
          //console.log("Fetched Teach Days:", data);
        })
        .catch((error) => {
          console.error("Error fetching teach days:", error);
        });
    }
  }, [selectedDay]);

  const selectBoxs = [
    {
      options: [
        { value: 14, label: "14 ngày tới" },
        { value: 30, label: "30 ngày tới" },
      ],
      nameSelect: "7 Ngày tới",
      nameSelectValue: 7,
      onChange: handleDayChange,
      value: selectedDay,
      className: "mr-1 w-[200px] pt-4 md:pt-4",
    },
  ];

  //console.log("Teach Days:", teachDays);

  // Grouping classes by date
  const groupedByDate = teachDays.reduce((acc, current) => {
    if (!acc[current.date]) {
      acc[current.date] = [];
    }
    acc[current.date].push(current);
    return acc;
  }, {});

  // Update the handleCancelSchedule function
  const handleCancelSchedule = async (clazz) => {
    try {
      // Fetch schedule details based on the class scheduleId
      const scheduleData = await getScheduleById(clazz.scheduleId);
      console.log("Schedule Data:", scheduleData); // Log fetched schedule data

      // Call the cancelSchedule API with the correct data
      const response = await cancelSchedule(clazz.scheduleId, scheduleData);
      console.log("Lịch dạy đã được huỷ thành công:", response);

      // Success toast
      toast.success("HUỶ THÀNH CÔNG");

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi huỷ lịch dạy:", error);
      // Show error toast
      const scheduleData = await getScheduleById(clazz.scheduleId);
      console.log("Schedule Data:", scheduleData);
      toast.error("HUỶ THẤT BẠI");
    }
  };
  console.log(teachDays);
  // Render the class information for each Ca
  const renderShiftId = (clazz) => {
    //console.log("Rendering Class:", clazz); // Log each class
    return clazz ? (
      <div className="w-24 h-22 flex flex-col items-start justify-center p-2 rounded-md shadow-inner border relative">
        <div className="w-full text-left">
          <h3 className="text-[0.9rem] font-medium py-1">{clazz.roomName}</h3>
          <h3 className="text-[0.8rem]">{clazz.code}</h3>
          <h3 className="text-[0.8rem] truncate">{clazz.subjectName}</h3>
          <h3 className="text-[0.8rem]">{clazz.subjectCode}</h3>
        </div>
        <div className="absolute bottom-0 right-0">
          <MiniMenu
            classNameBtn={"text-[20px] h-[25px] w-[25px]"}
            classNameMiniBox={"mt-1"}
            iconMenu={faCaretDown}
            menuItems={[
              {
                text: "Điểm danh",
                onClick: () => handleAttendanceClick(clazz),
              },
              {
                text: "Huỷ lịch dạy",
                disabled: clazz.retakescheduleId != null,
                onClick: () => handleCancelSchedule(clazz),
              },
            ]}
          />
        </div>
      </div>
    ) : (
      <div className="w-24 h-22"></div>
    );
  };

  // Render table rows for each date
  const renderRow = (date, classes) => {
    const shiftIdArray = Array(6).fill(null);

    classes.forEach((clazz) => {
      //console.log("Class in renderRow:", clazz);
      if (clazz.shiftId >= 1 && clazz.shiftId <= 6) {
        shiftIdArray[clazz.shiftId - 1] = clazz;
      }
    });

    return [
      <td key={`item-date-${date}`} className="px-4 py-2">
        {date}
      </td>,
      ...shiftIdArray.map((clazz, index) => (
        <td
          key={`item-shiftId${index + 1}-${date}`}
          className="px-2 pl-12 py-2"
        >
          {renderShiftId(clazz)}
        </td>
      )),
    ];
  };

  // const tableData = Object.entries(groupedByDate).map(([date, classes]) => ({
  //   date,
  //   classes,
  // }));

  // Chuyển đổi và sắp xếp các ngày trong tableData
  const tableData = Object.entries(groupedByDate)
    .map(([date, classes]) => ({
      date,
      classes,
    }))
    .sort((a, b) => parseISO(a.date) - parseISO(b.date)); // Sắp xếp theo ngày tăng dần

  //console.log("Table Data:", tableData);
  const thatDate = format(today, "dd-MM-yyyy");

  console.log(tableData);

  return (
    <Container>
      <TitleHeader
        title={
          <>
            <p className="upper-case">DANH SÁCH LỊCH DẠY TỪ NGÀY {thatDate}</p>
          </>
        }
      />
      <div className="min-h-[600px]">
        {desktop && (
          <Table
            DefaultTable={true}
            showOptions={true}
            showSelectBoxes={true}
            numberSelectBox={selectBoxs}
            headers={headers}
            renderRow={(row) => renderRow(row.date, row.classes)}
            data={tableData}
            maxRow={7}
          />
        )}

        {mobile && (
          <Accordion
            items={tableData.map((item) => ({
              title: item.date,
              content: item.classes.map((clazz) => (
                <div
                  className="flex items-center justify-between border py-3 px-2 my-2"
                  key={clazz.clazzId}
                >
                  <div className="flex flex-col">
                    <div>
                      <span className="text-[18px] font-medium">
                        Ca {clazz.Ca}
                      </span>{" "}
                      -
                      <span className="text-[18px] font-medium">
                        {clazz.room}
                      </span>
                    </div>
                    <h3 className="text-[16px]">{clazz.code}</h3>
                    <h3 className="text-[16px] truncate">
                      {clazz.subjectName}
                    </h3>
                  </div>
                  <div className="flex">
                    <Button
                      key={clazz.clazzId}
                      label="Điểm danh"
                      onClick={() => handleAttendanceClick(clazz)}
                      className="text-white p-1 mx-1 text-[16px]"
                    />
                    <Button
                      key={clazz.clazzId}
                      label="X"
                      onClick={() => handleCancelSchedule(clazz)}
                      className="text-white p-2 px-4 mx-1 text-[16px] bg-red-700"
                    />
                  </div>
                </div>
              )),
            }))}
            maxRow={7}
          />
        )}
      </div>
    </Container>
  );
}

export default TeachDay;
