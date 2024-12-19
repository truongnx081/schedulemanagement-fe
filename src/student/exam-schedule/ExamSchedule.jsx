import Table from "../../component/Table";
import React, { useState, useEffect } from "react";
import { getExamSchedule } from "../../api/ExamScheduleStudent";
import { calculateDates } from "../../api/ScheduleStudent";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getCurrentProgressAPI } from "../../api/SemesterProgress.js";

function ExamSchedule() {
  const [selectedDay, setSelectedDay] = useState(7);
  const [examSchedule, setExamScheduleData] = useState([]);

  const handleDayChange = (event) => {
    const newSelectedDay = Number(event.target.value);
    if (isNaN(newSelectedDay)) {
      return;
    }
    setSelectedDay(newSelectedDay);
  };

  const numberSelectBox = [
    {
      options: [
        { value: 7, label: "7 ngày tới" },
        { value: 14, label: "14 ngày tới" },
        { value: 30, label: "30 ngày tới" },
      ],
      onChange: handleDayChange,
      value: selectedDay,
      className: "mr-1 w-[200px] pt-4 md:pt-4",
      nameSelect: "Chọn thời gian",
      nameSelectValue: 7,
    },
  ];

  // CALL API CURRENT PROGRESS
  const [currentProgress, setCurrentProgress] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getCurrentProgressAPI();
        setCurrentProgress(response.data);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };
    fetchSchedule();
  }, []);
  console.log(currentProgress);

  useEffect(() => {
    const fetchExamSchedule = async () => {
      try {
        const { startTime, endTime } = calculateDates(selectedDay);
        const response = await getExamSchedule(startTime, endTime);
        if (response && response.data) {
          setExamScheduleData(response.data);
        }
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };
    fetchExamSchedule();
  }, [selectedDay]);

  const headers = [
    "Ngày",
    "Phòng",
    "Mã môn học",
    "Tên môn học",
    "Lớp",
    "Giảng viên",
    "Ca",
    "Thời Gian",
    "Lý do cấm thi",
  ];

  const header1s = [
    "Ngày",
    "Phòng",
    "Mã môn học",
    "Lớp",
    "Ca",
    "Lý do cấm thi",
  ];

  const renderRow = (item) => [
    <td key={`item-examDate-${item.id}`} className="px-6 py-4">
      {item.examDate}
    </td>,
    <td key={`item-roomName-${item.id}`} className="px-6 py-4">
      {item.roomName}
    </td>,
    <td key={`item-subjectCode-${item.id}`} className="px-6 py-4">
      {item.subjectCode}
    </td>,
    <td key={`item-subjectName-${item.id}`} className="px-6 py-4">
      {item.subjectName}
    </td>,
    <td key={`item-clazzCode-${item.id}`} className="px-6 py-4">
      {item.clazzCode}
    </td>,
    <td key={`item-instructorCode-${item.id}`} className="px-6 py-4">
      {item.instructorCode}
    </td>,
    <td key={`item-shiftId-${item.id}`} className="px-6 py-4">
      {item.shiftId}
    </td>,
    <td key={`item-time-${item.id}`} className="px-6 py-4">
      {`${item.startTime} - ${item.endTime}`}
    </td>,
  ];

  const renderRow1 = (item) => [
    <td key={`item-examDate-${item.id}`} className="px-6 py-4">
      {item.examDate}
    </td>,
    <td key={`item-roomName-${item.id}`} className="px-6 py-4">
      {item.roomName}
    </td>,
    <td key={`item-subjectCode-${item.id}`} className="px-6 py-4">
      {item.subjectCode}
    </td>,
    <td key={`item-clazzCode-${item.id}`} className="px-6 py-4">
      {item.clazzCode}
    </td>,
    <td key={`item-shiftId-${item.id}`} className="px-6 py-4">
      {item.shiftId}
    </td>,
  ];

  const [desktop, setDesktop] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 783) {
        setMobile(true);
        setDesktop(false);
      } else {
        setMobile(false);
        setDesktop(true);
      }
    };
    window.addEventListener("resize", handleResize);
    // Kiểm tra kích thước màn hình khi component được mount
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobile, desktop]);

  const flag =
    currentProgress.currentProgress === "first-part" ||
    currentProgress.currentProgress === "second-part";
  const scheduleNull = [];

  return (
    <Container>
      <TitleHeader title={"LỊCH THI"} />
      {!flag ? (
        <>
          <div className="py-4 min-h-[600px]">
            <Table
              DefaultTable={true}
              showTurnPage={false}
              headers={headers}
              renderRow={renderRow}
              data={scheduleNull}
              maxRow={10}
              nullData="Hiện tại chưa có lịch học"
            />
          </div>
        </>
      ) : (
        <>
          <div className="py-4 min-h-[600px]">
            {desktop && (
              <>
                <Table
                  DefaultTable={true}
                  showOptions={true}
                  showSelectBox={true}
                  optionsValue={numberSelectBox}
                  headers={headers}
                  renderRow={renderRow}
                  data={examSchedule}
                  maxRow={10}
                />
              </>
            )}
            {mobile && (
              <>
                <Table
                  DefaultTable={true}
                  showOptions={true}
                  showSelectBox={true}
                  optionsValue={numberSelectBox}
                  headers={header1s}
                  renderRow={renderRow1}
                  data={examSchedule}
                  maxRow={10}
                />
              </>
            )}
          </div>
        </>
      )}
    </Container>
  );
}
export default ExamSchedule;
