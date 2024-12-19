import Table from "../../../component/Table";
import Button from "../../../component/Button";
import React, { useState, useEffect } from "react";
import { getClazzByStudent } from "../../../api/ClazzStudent";
import { registerClass } from "../../../api/StudyIn";
import { toast } from "react-toastify";

function NotYetSubject() {
  const [getclazz, setGetClazz] = useState([]);

  const headers = [
    "Mã môn",
    "Tên môn",
    "Số tín chỉ",
    "Lớp",
    "Số lượng",
    "Còn lại",
    "Ca",
    "Thứ",
    "Thời gian",
    " ",
  ];

  const header1s = ["Môn", "Lớp", "Ca", "Thứ", "Còn lại", " "];

  // Call API to get class data
  useEffect(() => {
    const fetchClazzByStudent = async () => {
      try {
        const response = await getClazzByStudent();
        if (response) {
          setGetClazz(response.data);
          //console.log("data", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchClazzByStudent();
  }, []);

  const handleRegister = async (clazzId) => {
    try {
      const response = await registerClass(clazzId);
      toast.success("Đăng ký lớp học thành công!");
      console.log("Registration successful:", response);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error(error.data.message);
      console.error("Registration error:", error);
    }
  };

  const renderRow = (item) => [
    <td key={`item-code-${item.id}`} className="px-6 py-4">
      {item.subjectCode}
    </td>,
    <td key={`item-name-${item.id}`} className="px-4 py-4">
      {item.subject_name}
    </td>,
    <td key={`item-credit-${item.id}`} className="px-6 py-4">
      {item.credits}
    </td>,
    <td key={`item-clazz-${item.id}`} className="px-6 py-4">
      {item.code}
    </td>,
    <td key={`item-amount-${item.id}`} className="px-6 py-4">
      {item.quantity}
    </td>,
    <td key={`item-available-${item.id}`} className="px-6 py-4">
      {item.quantity - item.amout}
    </td>,
    <td key={`item-shift-${item.id}`} className="px-6 py-4">
      {item.shift}
    </td>,
    <td key={`item-day_of_week-${item.id}`} className="px-4 py-4">
      {item.study_day}
    </td>,
    <td key={`item-time-${item.id}`} className="px-6 py-4">
      {item.start_time} - {item.end_time}
    </td>,
    <td key={`item-menu-${item.id}`} className="px-6 py-4">
      <Button
        label="Đăng ký"
        onClick={() => handleRegister(item.id)}
        className="bg-white font-bold text-blue-600 hover:bg-white hover:text-blue-700"
      />
    </td>,
  ];

  const renderRow1 = (item) => [
    <td key={`subject-name-${item.id}`} className="px-2 py-4">
      {item.subject_name}
    </td>,
    <td key={`class-code-${item.id}`} className="px-2 py-4">
      {item.code}
    </td>,
    <td key={`shift-${item.id}`} className="px-2 py-4">
      {item.shift}
    </td>,
    <td key={`study-day-${item.id}`} className="px-1 py-4">
      {item.study_day}
    </td>,
    <td key={`item-available-${item.id}`} className="px-0 py-4">
      {item.quantity - item.amout}
    </td>,
    <td key={`action-${item.id}`} className="px-6 py-4">
      <Button
        label="Đăng ký"
        onClick={() => handleRegister(item.id)}
        className="bg-white font-bold text-blue-600 hover:bg-white hover:text-blue-700"
      />
    </td>,
  ];

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 783) {
        setIsDesktop(false);
      } else {
        setIsDesktop(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Check screen size on component mount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {isDesktop ? (
        <Table
          DefaultTable={true}
          showOptions={true}
          showSearch={true}
          showSelectBox={true}
          showBtnEnd={true}
          headers={headers}
          renderRow={renderRow}
          data={getclazz}
          maxRow={10}
        />
      ) : (
        <Table
          DefaultTable={true}
          showOptions={true}
          showSearch={true}
          showSelectBox={true}
          headers={header1s}
          renderRow={renderRow1}
          data={getclazz}
          maxRow={10}
        />
      )}
    </div>
  );
}

export default NotYetSubject;
