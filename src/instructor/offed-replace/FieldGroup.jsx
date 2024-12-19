import TextField from "../../component/TextField";
import { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox";
import Button from "../../component/Button";
import { getAllShiftAvailableAPI } from "../../api/Shift.js";
import { format } from "date-fns";
import { getAllRoomAvailableAPI } from "../../api/rooms.js";
import { createRetakeScheduleAPI } from "../../api/RetakeSchedule.js";
import { toast } from "react-toastify";
import { countStudentCannotPresent } from "../../api/Student.js";
import { useFormik } from "formik";

function FieldGroup({ thisDay, onFieldChange }) {
  const handleChange = (field) => (event) => {
    onFieldChange(field, event.target.value);
  };

  // console.log(thisDay);
  // GET API ALL Shift
  const [cbShift, setCbShift] = useState([]);
  const [studentsCannotAttend, setStudentsCannotAttend] = useState(0);
  const clazzId = thisDay.clazzId;
  const [selectedShift, setSelectedShift] = useState(null);
  const date = format(new Date(thisDay.date), "yyyy-MM-dd");

  useEffect(() => {
    if (date) {
      getAllShiftAvailableAPI(date)
        .then((response) => {
            // console.log("API response:", response);
          if (Array.isArray(response)) {
            setCbShift(response);
          } else {
            console.error("API response is not an array:", response);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch all shifts:", error);
        });
    }
  }, [date]);
  useEffect(() => {
    if (thisDay.scheduleId && selectedShift && date) {
      countStudentCannotPresent(thisDay.scheduleId, date, selectedShift)
        .then((response) => {
          if (response.data) {
            setStudentsCannotAttend(response.data); 
          }
        })
        .catch((error) => {
          console.error("Failed to fetch student count:", error);
        });
    }
  }, [thisDay.scheduleId, selectedShift, date]);
  
  const handleChangeShift = (event) => {
    // console.log("Selected Shift:", event.target.value); 
    setSelectedShift(event.target.value);
  };

  const optioncb = Array.isArray(cbShift)
    ? cbShift.map((shift) => ({
        value: shift.id,
        label: "Ca " + shift.id,
      }))
    : [];

  const [cbRoom, setCbRoom] = useState([]);
  // const [shift, setShift] = useState(1);

  useEffect(() => {
    if (selectedShift  && date) {
      getAllRoomAvailableAPI(selectedShift , date)
        .then((response) => {
          console.log("API response:", response);
          if (Array.isArray(response)) {
            setCbRoom(response);
          } else {
            console.error("API response is not an array:", response);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch all rooms:", error);
        });
    }
  }, [selectedShift , date]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const handleChangeRoom = (event) => {
    setSelectedRoom(event.target.value);
  };

  const optionRoom = Array.isArray(cbRoom)
    ? cbRoom.map((room) => ({
        value: room.room_name,
        label: room.room_name,
      }))
    : [];

  const formData = {
    date: date,
    scheduleId: thisDay.scheduleId,
    shiftId: selectedShift,
    roomName: selectedRoom,
  };
  // console.log("Form Data:", formData);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRetakeScheduleAPI(formData);
      toast.success("ĐẶT LỊCH THÀNH CÔNG!");
      // console.log("Response:", response);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("ĐẶT LỊCH THẤT BẠI");
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response error status:", error.response.status);
        console.error("Response error headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <>
      <div className="w-full flex md:flex-row flex-col mt-1">
        <div className="flex-1">
          <TextField
            onField={true}
            label="Lớp"
            value={thisDay.clazzCode}
            className="pt-4 px-4"
            disabled={true}
          />
          <TextField
            type="date"
            onField={true}
            label="Ngày"
            value={date}
            className="pt-4 px-4"
            onChange={handleChange("date")}
          />
          <SelectBox
            options={optioncb}
            name={"Ca"}
            nameSelect={"Chọn Ca"}
            onChange={handleChangeShift}
            value={selectedShift}
            className={"mt-8 px-4"}
          />
        </div>
        <div className="flex-1">
          <TextField
            onField={true}
            label="Môn"
            value={thisDay.subjectName}
            className="pt-4 px-4"
            disabled={true}
          />
          <SelectBox
            options={optionRoom}
            name={"Phòng"}
            nameSelect={"Chọn Phòng"}
            onChange={handleChangeRoom}
            value={selectedRoom}
            className={"mt-9 px-4"}
          />
          <div className="pb-2 px-4 h-[80px] flex items-end text-red-500">
            <p>Số lượng sinh viên không thể tham dự:</p>
            <span className="ml-4 font-medium">{studentsCannotAttend}</span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end pr-4 mt-10 pt-8 border-t">
        <Button
          label={"Đặt lịch"}
          className="w-full md:w-[150px] h-10 p-1 text-white justify-center"
          onClick={handleSubmit}
          disabled={thisDay.isRetake}
        />
      </div>
    </>
  );
}

export default FieldGroup;
