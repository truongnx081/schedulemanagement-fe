import MiniMenu from "../../component/MiniMenu.jsx";
import React, { useState, useEffect, useCallback } from "react";
import Table from "../../component/Table.jsx";
import Button from "../../component/Button.jsx";
import Modal from "../../component/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faFileImport } from "@fortawesome/free-solid-svg-icons";
import FontGroup from "./FontGroup.tsx";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import TextFieldGroup from "./TextFieldGroup.jsx";
import {
  getAllByBlockAndSemesterAndYear,
  updateScheduleAPI,
  createScheduleAPI,
  importExcelScheduleAPI,
} from "../../api/Schedule.js";
import { getAllBlocksAPI } from "../../api/Block.js";
import { getAllSemesterAPI } from "../../api/Semester.js";
import { getAllYearAPI } from "../../api/years.js";
import { format } from "date-fns";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { scheduleValidationSchema } from "./FontGroup.tsx";
import Modal2 from "../../component/Modal2.tsx";

interface Schedule {
  id: number;
  clazzId: number;
  clazz_code: string;
  date_schedule: string;
  instructor_code: string;
  room_name: string;
  specialization_name: string;
  status: boolean;
  subject_code: string;
  shift_id: number;
  subject_name: string;
  instructor_lastName: string;
  instructor_firstName: string;
  building_name: string;
  start_time: string;
  end_time: string;
}

function ScheduleManage() {
  const headers = ["Mã lớp", "Mã Môn", "Ngày", "Trạng thái", ""];

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
  const [editSchedule, setEditSchedule] = useState<Schedule>();
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

  // Call API useState<Number>(2024)
  const [selectedBlock, setSelectedBlock] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState("Spring");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);

  const handleEditClick = useCallback((schedule) => {
    setEditSchedule(schedule);
    setIsEditDisabled(true);
  }, []);

  // const openModal = (schedule) => setSelectedSchedule(schedule);
  // const closeModal = () => setSelectedSchedule(null);

  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedSchedule(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    }
    // else if (id === "delete") {
    //   setIsSubject(item);
    //   setIsModalConfirmOpen(true);
    // }
  };

  const closeModal = () => {
    setSelectedSchedule("");
    setIsModalOpenExcel(false);
    // setIsModalConfirmOpen(false);
  };

  const renderRow = (item: Schedule) => [
    <td key={`item-clazz_code-${item.id}`} className=" border-b">
      {item.clazz_code}
    </td>,
    <td key={`item-subject_code-${item.id}`} className=" border-b">
      {item.subject_code}
    </td>,
    <td key={`item-date_schedule-${item.id}`} className=" border-b">
      {format(item.date_schedule, "dd-MM-yyyy")}
    </td>,
    <td key={`item-status-${item.id}`} className=" border-b">
      {item.status}
      <input type="checkbox" checked={item.status} />
    </td>,
    <td key={`item-case-${item.id}`}>
      <div className="flex justify-center items-center">
        <MiniMenu
          classNameBtn="text-2xl p-4"
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

  const handleBlockChange = (event) => {
    setSelectedBlock(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Fetch schedule whenever course or major is selected
  useEffect(() => {
    if (selectedBlock && selectedSemester && selectedYear) {
      getAllByBlockAndSemesterAndYear(
        selectedBlock,
        selectedSemester,
        selectedYear
      )
        .then((data) => {
          setSchedules(data);
        })
        .catch((error) => {
          console.error("Error fetching schedule:", error);
        });
    }
  }, [selectedBlock, selectedSemester, selectedYear, isReLoadTable]);

  // GET API VALUE CB BLOCK
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

  const selectBoxs = [
    {
      options: blocks,
      name: "Block:",
      nameSelect: "Block",
      onChange: handleBlockChange,
      value: selectedBlock,
      className: "mr-1 w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      name: "Học kỳ:",
      options: semesters,
      nameSelect: "Kỳ",
      onChange: handleSemesterChange,
      value: selectedSemester,
      className: "w-full md:w-[150px] mr-1 pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      name: "Năm học:",
      options: years,
      nameSelect: "Năm",
      onChange: handleYearChange,
      value: selectedYear,
      className: "w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
  ];

  const formikSchedule = useFormik({
    initialValues: {
      id: editSchedule ? editSchedule.id : 0,
      date: editSchedule ? editSchedule.date_schedule : "",
      clazzId: editSchedule ? editSchedule.clazzId : "0",
      status: editSchedule ? editSchedule.status : true,
    },
    enableReinitialize: true,
    validationSchema: scheduleValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      const formattedSchedule = { ...values };
      console.log("formattedSchedule:", formattedSchedule);
      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createScheduleAPI(formattedSchedule);
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới lịch học thành công");
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
            const response = await updateScheduleAPI(
              formattedSchedule,
              values.id
            );
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật lịch học thành công");
                resetForm();
                setEditSchedule(null);
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
        ? openConfirm(action, `Bạn có chắc muốn thêm lịch học này?`)
        : openConfirm(action, `Bạn có chắc muốn cập nhật lịch học này?`);
    },
  });

  // Excel
  const extractedData = schedules.map((item) => ({
    subject_code: item.subject_code,
    subject_name: item.subject_name,
    clazz_code: item.clazz_code,
    instructor_code: item.instructor_code,
    instructor_name: item.instructor_lastName + " " + item.instructor_firstName,
    date_schedule: item.date_schedule,
    shift_id: item.shift_id,
    room_name: item.room_name,
    specialization_name: item.specialization_name,
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
      year: 2024,
      semester: "Spring",
      block: 1,
      subjectCode: "COM203",
    },
    {
      STT: "2",
      date: new Date("2025-01-06"),
      clazzCode: "SD18303",
      year: 2024,
      semester: "Spring",
      block: 2,
      subjectCode: "SOF203",
    },
  ];

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ LỊCH HỌC" />
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
            data={schedules}
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedSchedule && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              className=""
              label={
                <>
                  {selectedSchedule.clazz_code} -{" "}
                  {selectedSchedule.subject_code} -{" "}
                  {format(selectedSchedule.date_schedule, "dd/MM/yyyy")}
                </>
              }
            >
              <div>
                <div className="w-[700px] py-2">
                  <TextFieldGroup
                    clazz_code={selectedSchedule.clazz_code}
                    date_schedule={format(
                      selectedSchedule.date_schedule,
                      "dd-MM-yyyy"
                    )}
                    instructor_code={selectedSchedule.instructor_code}
                    room_name={selectedSchedule.room_name}
                    shift_id={selectedSchedule.shift_id}
                    specialization_name={selectedSchedule.specialization_name}
                    status={selectedSchedule.status}
                    subject_code={selectedSchedule.subject_code}
                    subject_name={selectedSchedule.subject_name}
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
            onClick={() => formikSchedule.submitForm()}
            formik={formikSchedule}
            loading={loading}
            setEditSchedule={setEditSchedule}
            setIsEditDisabled={setIsEditDisabled}
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
              exportFileName="Danh sách lịch học"
              exportFileNamePattern="Danh sách lịch học mẫu để import"
              sheetName="DSLH"
              importExcelAPI={importExcelScheduleAPI}
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
export default ScheduleManage;
