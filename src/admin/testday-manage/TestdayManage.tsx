import React, { useState, useEffect, useCallback } from "react";
import MiniMenu from "../../component/MiniMenu.jsx";
import Table from "../../component/Table.jsx";
import Button from "../../component/Button.jsx";
import Modal from "../../component/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faFileImport } from "@fortawesome/free-solid-svg-icons";
import FontGroup from "./FontGroup.tsx";
import TextFieldGroup from "./TextFieldGroup.jsx";
import { getAllExambyBlockSemesterYearSpecialization, createExamScheduleAPI, updateExamScheduleAPI, importExcelExamScheduleAPI } from "../../api/examSchedule.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getAllYearAPI } from "../../api/years.js";
import { getAllBlocksAPI } from "../../api/Block.js";
import { getAllSemesterAPI } from "../../api/Semester.js";
import { getAllSpecializationsAPI } from "../../api/Specialization.js";
import { getAllClazzAPI } from '../../api/clazzs.js'
import Modal2 from "../../component/Modal2.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { examScheduleValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";

interface ExamSchedule {
  exam_id: number;
  exam_date: string;
  clazz_code: string;
  clazzId: number;
  subject_code: number;
  shift_id: number;
  instructor_code: string;
  room_name: string;
  roomId: number;
  batch_exam: string;
  subject_name: string;
  last_name: string;
  first_name: string;
  start_time: string;
  end_time: string;
  building_name: string;
}

function TestdayManage() {
  const headers = ["Mã môn", "Mã lớp", "Giảng viên", "Ngày thi", "Đợt thi", "Ca", "Phòng", " "];

  const [selectedExamSchedule, setSelectedExamSchedule] = useState<ExamSchedule>();
  const [editExamSchedule, setEditExamSchedule] = useState<ExamSchedule>();
  const [isEditDisabled, setIsEditDisabled] = useState(false);
  const [isReLoadTable, setIsReLoadTable] = useState(false);
  const [isModalOpenExcel, setIsModalOpenExcel] = useState(false);
  const {
    isConfirmOpen,
    openConfirm,
    closeConfirm,
    confirmAction,
    confirmQuestion,
  } = useConfirm();

  // API Call
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSpecialization, setSelectedSpecialization] = useState(1);
  const [selectedBlock, setSelectedBlock] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState("Spring");
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [clazz, setClazz] = useState([]);

  const handleEditClick = useCallback((exam) => {
    setEditExamSchedule(exam);
    setIsEditDisabled(true);
  }, []);

  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedExamSchedule(item);
    }
    else if (id === "excel") {
      setIsModalOpenExcel(true);
    }
    // else if (id === "delete") {
    //   setIsSubject(item);
    //   setIsModalConfirmOpen(true);
    // }
  };

  const closeModal = () => {
    setSelectedExamSchedule("");
    setIsModalOpenExcel(false);
    // setIsModalConfirmOpen(false);
  };

  const renderRow = (item: ExamSchedule) => [
    <td key={`item-subject_code-${item.exam_id}`} className="border-b">
      {item.subject_code}
    </td>,
    <td key={`item-clazz_code-${item.exam_id}`} className="border-b">
      {item.clazz_code}
    </td>,
    <td key={`item-instructor_code-${item.exam_id}`} className="border-b">
      {item.instructor_code}
    </td>,
    <td key={`item-exam_date-${item.exam_id}`} className="border-b">
      {item.exam_date}
    </td>,
    <td key={`item-batch_exam-${item.exam_id}`} className="border-b">
      {item.batch_exam}
    </td>,
    <td key={`item-shift_id-${item.exam_id}`} className="border-b">
      {item.shift_id}
    </td>,
    <td key={`item-room_name-${item.exam_id}`} className="border-b">
      {item.room_name}
    </td>,
    <td key={`item-case-${item.exam_id}`}>
      <div className="flex justify-center items-center">
        <MiniMenu
          classNameBtn="text-xs p-4"
          iconMenu={faCaretDown}
          menuItems={[
            {
              text: "Chi tiết",
              onClick: () => openModal(item, "chi-tiet"),
            },
            {
              text: "Sửa đổi",
              onClick: () => handleEditClick(item),
            },
          ]}
        />
      </div>
    </td>,
  ];



  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };
  const handleBlockChange = (event) => {
    setSelectedBlock(event.target.value);
  };
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  useEffect(() => {
    if (
      selectedYear &&
      selectedSpecialization &&
      selectedBlock &&
      selectedSemester
    ) {
      getAllExambyBlockSemesterYearSpecialization(
        selectedBlock,
        selectedSemester,
        selectedYear,
        selectedSpecialization // Ensure this parameter matches "specializationId" in the API call
      )
        .then((data) => {
          setExams(data);
        })
        .catch((error) => {
          console.error("Error fetching exam schedules:", error);
        });
    }
  }, [selectedYear, selectedSpecialization, selectedBlock, selectedSemester, isReLoadTable]);

  // GET API VALUE CB BLOCK
  const [blocks, setBlocks] = useState([]);
  useEffect(() => {
    const fetchBlocks = async () => {
      const data = await getAllBlocksAPI();
      const formattedBlocks = data.map((block) => ({
        value: block.block,
        label: block.block,
      })); // Format data with value and label
      setBlocks(formattedBlocks);
    };

    fetchBlocks(); // Call the API function
  }, []);

  // GET API VALUE CB SEMESTER
  const [semesters, setSemesters] = useState([]);
  useEffect(() => {
    const fetchSemesters = async () => {
      const data = await getAllSemesterAPI();
      const formattedSemesters = data.map((semester) => ({
        value: semester.semester,
        label: semester.semester,
      })); // Format data with value and label
      setSemesters(formattedSemesters);
    };

    fetchSemesters(); // Call the API function
  }, []);

  // GET API VALUE CB YEAR
  const [years, setYears] = useState([]);
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await getAllYearAPI();
        const formattedYears = response.data
          .map((year) => ({
            value: year.year,
            label: year.year.toString(),
          }))
          .reverse();
        setYears(formattedYears);
      } catch (error) {
        console.error("Failed to fetch years:", error);
      }
    };

    fetchYears();
  }, []);

  //GET API VALUE CB SPECIALIZATION
  const [specializations, setSpecializations] = useState([]);
  useEffect(() => {
    const fetchSpecializations = async () => {
      const data = await getAllSpecializationsAPI(); // Fetch the specializations
      const formattedSpecializations = data.map((specialization) => ({
        value: specialization.id,
        label: specialization.name,
      })); // Format data with value and label
      setSpecializations(formattedSpecializations);
    };

    fetchSpecializations(); // Call the API function
  }, []);

  const selectBoxs = [
    {
      name: "Block:",
      options: blocks,
      nameSelect: "Block",
      onChange: handleBlockChange,
      value: selectedBlock,
      className: "w-full md:w-[150px] mr-1 pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      name: "Học kỳ:",
      options: semesters,
      nameSelect: "Học kỳ",
      onChange: handleSemesterChange,
      value: selectedSemester,
      className: "w-full mr-1 md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      name: "Năm học:",
      options: years,
      nameSelect: "Năm",
      onChange: handleYearChange,
      value: selectedYear,
      className: "mr-1 w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      name: "Bộ môn:",
      options: specializations,
      nameSelect: "Bộ môn",
      onChange: handleSpecializationChange,
      value: selectedSpecialization,
      className: "w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
  ];

  useEffect(() => {
    const fetchAllClazz = async () => {
      const response = await getAllClazzAPI(); // Fetch the clazz
      const formattedClazz = response.data.map((clazz) => ({
        value: clazz.id,
        label: `${clazz.code + ' - ' + clazz.semester + ' ' + clazz.year + ' - Block ' + clazz.block}`,
      })); // Format data with value and label
      setClazz(formattedClazz);
    };

    fetchAllClazz(); // Call the API function
  }, []);

  const formikExamSchedule = useFormik({
    initialValues: {
      id: editExamSchedule ? editExamSchedule.exam_id : 0,
      date: editExamSchedule ? editExamSchedule.exam_date : "",
      clazzId: editExamSchedule ? editExamSchedule.clazzId : "0",
      batch: editExamSchedule ? editExamSchedule.batch_exam : "0",
      roomId: editExamSchedule ? editExamSchedule.roomId : "0",
      shiftId: editExamSchedule ? editExamSchedule.shift_id : "0",
    },
    enableReinitialize: true,
    validationSchema: examScheduleValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      const formattedExamSchedule = { ...values };
      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createExamScheduleAPI(formattedExamSchedule);
            if (response && response.data) {
              if (response.statusCode !== 200)
                toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới lịch thi thành công");
                resetForm();
                setIsReLoadTable(!isReLoadTable);
              }
            }
          } catch (error) {
            console.log("lỗi:", error);
            toast.error(error.data.message);
          }
          setLoading(false); // Kết thúc loading
        } else {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await updateExamScheduleAPI(
              formattedExamSchedule,
              values.id
            );
            if (response && response.data) {
              if (response.statusCode !== 200)
                toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật lịch thi thành công");
                resetForm();
                setEditExamSchedule(null);
                setIsReLoadTable(!isReLoadTable);
                setIsEditDisabled(false);
              }
            }
          } catch (error) {
            console.log("lỗi:", error);
            toast.error(error.data.message);
          }
          setLoading(false); // Kết thúc loading
        }
        closeModal();

        // setIsReLoadTable(!isReLoadTable);
      };
      values.id === 0
        ? openConfirm(action, `Bạn có chắc muốn thêm lịch thi này?`)
        : openConfirm(
          action,
          `Bạn có chắc muốn cập nhật lịch thi này?`
        );
    },
  });

  // Excel
  const extractedData = exams.map((item) => ({
    subject_code: item.subject_code,
    subject_name: item.subject_name,
    clazz_code: item.clazz_code,
    instructor_code: item.instructor_code,
    instructor_name: item.last_name + ' ' + item.first_name,
    exam_date: item.exam_date,
    shift_id: item.shift_id,
    room_name: item.room_name,
    batch_exam: item.batch_exam,
    building_name: item.building_name,
    start_time: item.start_time,
    end_time: item.end_time,
  }));

  // Excel template
  const dataTemplate = [
    {
      STT: "1",
      date: new Date("2025-01-03"),
      clazzCode: "SD18301",
      batch: 2,
      roomName: 'F.204',
      shift: 3,
      year: 2024,
      semester: 'Spring',
      block: 1,
      subjectCode: 'COM203'
    },
    {
      STT: "2",
      date: new Date("2025-01-06"),
      clazzCode: "SD18303",
      batch: 3,
      roomName: 'F.206',
      shift: 2,
      year: 2024,
      semester: 'Spring',
      block: 2,
      subjectCode: 'SOF203'
    },
  ];

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ LỊCH THI" />
      <div className={`flex flex-col md:flex-row min-h-svh`}>
        <div className="p-2 flex-1">
          <Table
            DefaultTable={true}
            showOptions={true}
            showSearch={true}
            showSelectBoxes={true}
            numberSelectBox={selectBoxs}
            headers={headers}
            renderRow={renderRow}
            data={exams} // Pass the fetched exam data
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedExamSchedule && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              className=""
              label={
                <>
                  {selectedExamSchedule.clazz_code} - {selectedExamSchedule.subject_code} - {selectedExamSchedule.subject_name}
                </>
              }
            >
              <div>
                <div className="w-[700px] py-2">
                  <TextFieldGroup
                    exam_date={selectedExamSchedule.exam_date}
                    clazz_code={selectedExamSchedule.clazz_code}
                    subject_code={selectedExamSchedule.subject_code}
                    shift_id={selectedExamSchedule.shift_id}
                    instructor_code={selectedExamSchedule.instructor_code}
                    room_name={selectedExamSchedule.room_name}
                    batch_exam={selectedExamSchedule.batch_exam}
                    subject_name={selectedExamSchedule.subject_name}
                    last_name={selectedExamSchedule.last_name}
                    first_name={selectedExamSchedule.first_name}
                    start_time={selectedExamSchedule.start_time}
                    end_time={selectedExamSchedule.end_time}
                    building_name={selectedExamSchedule.building_name}
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
        <div className={`p-2 w-full md:w-[300px]`}>
          <div className="px-2 pt-4 mb-5">
            <Button
              className="w-full p-2 text-white justify-center"
              label={
                <>
                  <FontAwesomeIcon icon={faFileImport} className="mr-2" />
                  Nhập/Xuất Excel
                </>
              }
              onClick={() => openModal("", "excel")}
            ></Button>
          </div>
          <FontGroup
            isEditDisabled={isEditDisabled}
            onClick={() => formikExamSchedule.submitForm()}
            formik={formikExamSchedule}
            loading={loading}
            setEditExamSchedule={setEditExamSchedule}
            setIsEditDisabled={setIsEditDisabled}
            clazz={clazz}
          />
          <ModalConfirm
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={confirmAction}
            question={confirmQuestion}
          />
        </div>
        {/* Import excel */}
        <Modal2
          id="importExcel"
          title="Làm việc với excel"
          content={
            <UploadExcelModal
              onClose={closeModal}
              dataExport={extractedData}
              dataTemplate={dataTemplate}
              exportFileName="Danh sách lịch thi"
              exportFileNamePattern="Danh sách lịch thi mẫu để import"
              sheetName="DSLT"
              importExcelAPI={importExcelExamScheduleAPI}
              isReLoadTable={isReLoadTable}
              setIsReLoadTable={setIsReLoadTable}
            />
          }
          isOpen={isModalOpenExcel}
          onClose={closeModal}
        />
      </div>
    </Container>
  );
}
export default TestdayManage;
