import Table from "../../component/Table";
import Button from "../../component/Button";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { toast } from "react-toastify";
import { getAllIdOfStudyInByBlockAndSemesterAndYearOfStudent2API } from "../../api/StudyIn.js";
import { getCurrentProgressAPI } from "../../api/SemesterProgress.js";

function CurrentSubject() {
  const navigate = useNavigate();
  const [subjects, setsSubjects] = useState([]);

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
  //console.log(currentProgress);

  const flag = currentProgress.currentProgress === "prepaire";

  console.log(flag);
  // Lấy môn học hiện tại
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        let response =
          await getAllIdOfStudyInByBlockAndSemesterAndYearOfStudent2API();
        if (response && response.statusCode == 200) {
          setsSubjects(response.data);
        }
      } catch (error) {
        toast.error(
          "Lấy danh sách môn học hiện tại của sinh viên không thành công!"
        );
      }
    };
    fetchClasses();
  }, []);

  // const handleUnregisterClick = (subject) => {
  //   setSelectedSubject(subject);
  //   setModalOpen(true);
  // };

  // const handleModalClose = () => {
  //   setModalOpen(false);
  //   setSelectedSubject(null);
  // };

  // const handleConfirmUnregistration = () => {
  //   console.log(`Đã đăng ký môn: ${selectedSubject.name}`);
  //   handleModalClose();
  // };

  const headers = [
    "Mã môn",
    "Tên môn",
    "Mã lớp",
    "Tín chỉ",
    "Giảng viên",
    "Ca",
    "Thứ",

    " ",
  ];

  const handlePost = useCallback((item) => {
    if (flag) {
      navigate(`/doi-lich-hoc/${encodeURIComponent(item.subjectCode)}`, {
        state: { item }, // Pass both item and studentList in the state
      });
    } else {
      toast.error("Không phải thời gian đổi ca học");
    }
  });

  const renderRow = (item) => [
    <td key={`item-code_subject-${item.id}`} className="px-6 py-4">
      {item.subjectCode}
    </td>,
    <td key={`item-name_subject-${item.id}`} className="px-6 py-4">
      {item.subjectName}
    </td>,
    <td key={`item-code_clazz-${item.id}`} className="px-6 py-4">
      {item.clazzCode}
    </td>,
    <td key={`item-credit_subject-${item.id}`} className="px-6 py-4">
      {item.credits}
    </td>,
    <td key={`item-instructor-${item.id}`} className="px-6 py-4">
      {item.instructorCode} - {item.lastName} {item.firstName}
    </td>,
    <td key={`item-shift-${item.id}`} className="px-6 py-4">
      {item.shift}
    </td>,
    <td key={`item-study_day-${item.id}`} className="px-6 py-4">
      {item.study_day}
    </td>,

    <td key={`item-menu-${item.id}`} className="px-4 py-4">
      <Button
        label="Đổi lịch học"
        className="bg-white font-bold text-blue-500 "
        onClick={() => handlePost(item)}
      />
    </td>,
  ];

  return (
    <Container>
      <TitleHeader title={"MÔN HỌC HIỆN TẠI"} />
      <div className="min-h-[600px]">
        <Table
          DefaultTable={true}
          showOptions={true}
          showSearch={true}
          showSelectBox={true}
          showBtnEnd={true}
          headers={headers}
          renderRow={renderRow}
          data={subjects}
          maxRow={10}
        />

        {/* <Modal isOpen={isModalOpen} onClose={handleModalClose} label="X">
          <h2 className="text-center font-medium text-xl">Xác nhận hủy môn</h2>
          <div className="h-28 p-2">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="h-full w-full text-[#FFD43B]"
            />
          </div>
          <p>
            Bạn có chắc chắn muốn hủy môn:{" "}
            <strong className="text-sm">{selectedSubject?.name}</strong>?
          </p>
          <div className="flex justify-center font-xs font-semibold mt-4">
            <Button
              label="Hủy"
              onClick={handleModalClose}
              className="mr-2 bg-gray-300 hover:bg-gray-400"
            />
            <Button
              label="Xác nhận"
              onClick={handleConfirmUnregistration}
              className="bg-red-500 text-white hover:bg-red-600"
            />
          </div>
        </Modal> */}
      </div>
    </Container>
  );
}

export default CurrentSubject;
