import React, { useState, useEffect } from "react";
import Table from "../../component/Table";
import Button from "../../component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getScheduleStatusFalse } from "../../api/Schedule.js";
import { format } from "date-fns";
import Modal from "../../component/Modal.jsx";
import FieldGroup from "./FieldGroup.jsx";

function OffedReplace() {
  //Biến responsive
  const [desktop, setDesktop] = useState(true);
  const [mobile, setMobile] = useState(false);

  // call API
  const [offdays, setOffdays] = useState([]);
  console.log(offdays);
  useEffect(() => {
    getScheduleStatusFalse()
      .then((response) => {
        setOffdays(response);
      })
      .catch((error) => {
        console.error("Failed to fetch all schedule Status False:", error);
      });
  }, []);

  const headers = ["Lớp", "Mã Môn", "Tên Môn", "Ngày", ""];

  const renderRow = (item) => [
    <td key={`item-code-${item.id}`} className="px-6 py-4">
      {item.clazzCode}
    </td>,
    <td key={`item-subjectCode-${item.id}`} className="px-6 py-4">
      {item.codeSubject}
    </td>,
    <td key={`item-subjectName-${item.id}`} className="px-6 py-4">
      {item.subjectName}
    </td>,
    <td key={`item-date-${item.id}`} className="px-6 py-4">
      {item.date ? format(new Date(item.date), "dd-MM-yyyy") : ""}
    </td>,
    <td
      key={`item-option-${item.id}`}
      className="px-6 py-4 flex justify-center"
    >
      <div className="flex justify-center w-full">
        <Button
          onClick={() => {
            openModal(item);
            console.log(item);
          }}
          label={
            <>
              {item.isRetake == true ? (
                <>
                  <FontAwesomeIcon icon={faSquareCheck} className="mr-4" /> Đã
                  đặt
                </>
              ) : (
                <>
                  {<FontAwesomeIcon icon={faCircleInfo} className="mr-2" />}
                  Chưa bù
                </>
              )}
            </>
          }
          className="w-full md:w-[150px] flex items-center justify-center p-3 text-white "
          disabled={item.isRetake}
        />
      </div>
    </td>,
  ];

  const [selectedDay, setSelectedDay] = useState(null);

  const openModal = (day) => setSelectedDay(day);
  const closeModal = () => setSelectedDay(null);

  const handleFieldChange = (field, value) => {
    setSelectedDay((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const header1s = ["Lớp", "Tên Môn", "Ngày", ""];

  const renderRow1 = (item) => [
    <td key={`item-code-${item.id}`} className="px-6 py-4">
      {item.clazzCode}
    </td>,
    <td key={`item-subjectName-${item.id}`} className="px-6 py-4">
      {item.subjectName}
    </td>,
    <td key={`item-date-${item.id}`} className="px-6 py-4">
      {item.date ? format(new Date(item.date), "dd-MM-yyyy") : ""}
    </td>,
    <td key={`item-option-${item.id}`} className="px-6 py-4">
      <div className="flex justify-center w-full">
        <Button
          onClick={() => {
            openModal(item);
            console.log(item);
          }}
          label={
            <>
              <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
              Đặt lịch
            </>
          }
          className="w-full md:w-[150px] flex items-center justify-center p-3 text-white "
          disabled={item.isRetake}
        />
      </div>
    </td>,
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 783) {
        setDesktop(false);
        setMobile(true);
      } else {
        setDesktop(true);
        setMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    // Kiểm tra kích thước màn hình khi component được mount
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [desktop, mobile]);

  return (
    <Container>
      <TitleHeader title="DANH SÁCH NGÀY ĐÃ NGHỈ" />
      <div className="min-h-[600px]">
        {desktop && (
          <Table
            DefaultTable={true}
            showOptions={true}
            showSearch={true}
            showSelectBox={true}
            showBtnEnd={true}
            headers={headers}
            renderRow={renderRow}
            data={offdays}
            maxRow={10}
          />
        )}
        {mobile && (
          <Table
            DefaultTable={true}
            showOptions={true}
            showSearch={true}
            headers={header1s}
            renderRow={renderRow1}
            data={offdays}
            maxRow={10}
          />
        )}
      </div>
      {selectedDay && (
        <Modal
          className={"md:w-[50%]"}
          isOpen={true}
          onClose={closeModal}
          label={`Đặt lịch bù lớp: ${selectedDay.clazzCode} `}
        >
          <div className=" mt-1 pt-2 pb-4 h-10/12 md:h-auto">
            <FieldGroup
              thisDay={selectedDay}
              onFieldChange={handleFieldChange}
            />
          </div>
        </Modal>
      )}
    </Container>
  );
}

export default OffedReplace;
