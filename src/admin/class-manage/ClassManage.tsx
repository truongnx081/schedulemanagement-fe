import { semesters, year, blocks } from "./DataSelect.js";
import { getAllYearAPI } from "../../api/years.js";
import { getAllClazzsByBlockAndSemesterAndYearAPI } from "../../api/clazzs.js";
import MiniMenu from "../../component/MiniMenu.jsx";
import React, { useState, useEffect, useCallback } from "react";
import Table from "../../component/Table.jsx";
import Button from "../../component/Button.jsx";
import Button2 from "../../component/Button2.tsx";
import Modal from "../../component/Modal.jsx";
import Modal2 from "../../component/Modal2.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faFileImport,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import FontGroup from "./FontGroup.tsx";
import {
  createClazzAPI,
  updateClazzAPI,
  deleteClazzAPI,
  importExcelClazzAPI,
} from "../../api/clazzs.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { clazzValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import { useDispatch } from "react-redux";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";
import TextFieldGroup from "./TextFieldGroup.jsx";

interface Clazz {
  id: number;
  code: string;
  onlineLink: string;
  quantity: number;
  block: number;
  semester: string;
  year: number;
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  instructorId: number;
  instructorCode: string;
  instructorLastName: string;
  instructorFirstName: string;
  shiftId: number;
  roomName: string;
  roomId: number;
  building: string;
  weekdays: string;
}

function ClassManage() {
  const [selectedClazz, setSelectedClazz] = useState<Clazz>();
  const [editClazz, setEditClazz] = useState<Clazz>();
  const [isEditDisabled, setIsEditDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    isConfirmOpen,
    openConfirm,
    closeConfirm,
    confirmAction,
    confirmQuestion,
  } = useConfirm();
  const [isModalOpenConfirm, setIsModalConfirmOpen] = useState(false);
  const [isModalOpenExcel, setIsModalOpenExcel] = useState(false);
  const [isClazz, setIsClazz] = useState<Clazz | null>(null);
  const [isReLoadTable, setIsReLoadTable] = useState(false);
  const headers = [
    "Mã lớp",
    "Mã môn",
    "Giảng viên",
    "Phòng",
    "Ca",
    "Ngày trong tuần",
    "Link online",
    "",
  ];
  const [editExam, setEditExam] = useState(null);
  const [years, setYears] = useState([]);
  // Call API
  const [selectedYear, setSelectedYear] = useState<Number>(2024);
  const [selectedSemester, setSelectedSemester] = useState('Spring');
  const [selectedBlock, setSelectedBlock] = useState(1);
  const [clazzs, setClazzs] = useState<Clazz[]>([]);
  const [instructorValue, setInstructorValue] = useState("");
  const [subjectValue, setSubjectValue] = useState("");
  const dispatch = useDispatch();

  const handleEditClick = useCallback((Clazz) => {
    setInstructorValue(Clazz.instructorCode);
    setSubjectValue(Clazz.subjectId);
    setEditClazz(Clazz);
    setIsEditDisabled(true);
  }, []);

  // const openModal = (Clazz) => setSelectedClazz(Clazz);
  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedClazz(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    }
    // else if (id === 'delete') {
    //   setIsClazz(item);
    //   setIsModalConfirmOpen(true);
    // }
  };
  const closeModal = () => {
    setSelectedClazz("");
    setIsModalOpenExcel(false);
    setIsModalConfirmOpen(false);
  };

  const renderRow = (item: Clazz) => [
    <td key={`item-code-${item.id}`} className=" border-b">
      {item.code}
    </td>,
    <td key={`item-subjectCode-${item.id}`} className=" border-b">
      {item.subjectCode}
    </td>,
    <td key={`item-instructorCode-${item.id}`} className=" border-b">
      {item.instructorCode}
    </td>,
    <td key={`item-roomName-${item.id}`} className=" border-b">
      {item.building + " (" + item.roomName + ")"}
    </td>,
    <td key={`item-shiftId-${item.id}`} className=" border-b">
      {item.shiftId}
    </td>,
    <td key={`item-weekday-${item.id}`} className=" border-b">
      {item.weekdays}
    </td>,
    <td key={`item-onlineLink-${item.id}`} className=" border-b">
      {item.onlineLink}
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
            // {
            //   text: "Xóa",
            //   onClick: () => openModal(item, 'delete'),
            // },
          ]}
        />
      </div>
    </td>,
  ];

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleBlockChange = (event) => {
    setSelectedBlock(event.target.value);
  };

  // call api
  const callAPI = async () => {
    try {
      const response = await getAllYearAPI();
      if (response && response.data) {
        if (response.statusCode === 200) {
          const formattedYears = response.data.map((item) => ({
            value: item.year,
            label: item.year,
          })).reverse();
          setYears(formattedYears);
        }
      }
    } catch (error) {
      console.log("lỗi:", error);
    }
  };

  useEffect(() => {
    callAPI();
    setSelectedYear(new Date().getFullYear()); // Đặt năm hiện tại làm mặc định
  }, []);

  // Fetch exam whenever Year or major is selected
  useEffect(() => {
    if (selectedYear && selectedSemester && selectedBlock) {
      getAllClazzsByBlockAndSemesterAndYearAPI(
        selectedBlock,
        selectedSemester,
        selectedYear
      )
        .then((response) => {
          setClazzs(response.data);
        })
        .catch((error) => {
          console.error("Error fetching clazz:", error);
        });
    }
  }, [selectedYear, selectedSemester, selectedBlock, isReLoadTable]);

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
      className: "w-full md:w-[150px] mr-1 pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      name: "Năm học:",
      options: years ? years : year,
      nameSelect: "Năm học",
      onChange: handleYearChange,
      value: selectedYear,
      className: "w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
  ];

  const formikClazz = useFormik({
    initialValues: {
      id: editClazz ? editClazz.id : 0,
      code: editClazz ? editClazz.code : "",
      onlineLink: editClazz ? editClazz.onlineLink : "",
      quantity: editClazz ? editClazz.quantity : "",
      block: editClazz ? editClazz.block : "1",
      semester: editClazz ? editClazz.semester : "Spring",
      year: editClazz ? editClazz.year : selectedYear,
      subjectId: editClazz ? editClazz.subjectId : "1",
      subjectName: editClazz ? editClazz.subjectName : "",
      instructorId: editClazz ? editClazz.instructorId : "0",
      shiftId: editClazz ? editClazz.shiftId : "1",
      roomId: editClazz ? editClazz.roomId : "1",
      weekdays: editClazz ? editClazz.weekdays : "2, 4, 6",
    },
    enableReinitialize: true,
    validationSchema: clazzValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      // Loại bỏ thuộc tính 'subjectId' và giữ các thuộc tính khác
      const { roomId, ...value } = values;

      // Tạo đối tượng mới với 'rest' và giá trị mới của 'x'
      let formattedClazz;
      if (roomId == "") formattedClazz = { ...values, roomId: 0 };
      else formattedClazz = { ...values };

      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createClazzAPI(formattedClazz);
            if (response && response.data) {
              if (response.data.statusCode !== 200)
                toast.error(response.data.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới lớp học thành công");
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
            const response = await updateClazzAPI(values.id, formattedClazz);
            if (response && response.data) {
              if (response.data.statusCode !== 200)
                toast.error(response.data.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật lớp học thành công");
                resetForm();
                setEditClazz(null);
                setIsReLoadTable(!isReLoadTable);
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
        ? openConfirm(action, "Bạn có chắc muốn thêm lớp học này?")
        : openConfirm(action, "Bạn có chắc muốn cập nhật lớp học này?");
    },
  });

  // Xóa lớp học
  const handleDelete = async () => {
    if (isClazz) {
      try {
        let response = await deleteClazzAPI(isClazz.id);
        if (response && response.data) {
          if (response.statusCode === 200) {
            // Lấy danh sách lớp học mới
            if (selectedYear && selectedSemester && selectedBlock) {
              getAllClazzsByBlockAndSemesterAndYearAPI(
                selectedBlock,
                selectedSemester,
                selectedYear
              )
                .then((response) => {
                  setClazzs(response.data);
                })
                .catch((error) => {
                  console.error("Error fetching clazz:", error);
                });
            }
            toast.success("Xóa lớp học thành công");
          }
        } else {
          toast.error("Lớp học này đã và đang hoạt động, không thể xóa");
        }
        closeModal();
      } catch (error) {
        toast.error("Lớp học này đã và đang hoạt động, không thể xóa");
      }
    }
  };

  // Excel
  const extractedData = clazzs.map((item) => ({
    code: item.code,
    onlineLink: item.onlineLink,
    quantity: item.quantity,
    block: item.block,
    semester: item.semester,
    year: item.year,
    subjectCode: item.subjectCode,
    subjectName: item.subjectName,
    instructorCode: item.instructorCode,
    shiftId: item.shiftId,
    roomName: item.roomName,
    weekday: item.weekdays,
  }));

  // Excel template
  const dataTemplate = [
    {
      STT: "1",
      code: "SD18305", // Lấy mã chương trình học
      onlineLink: "",
      quantity: 35,
      block: 1,
      semester: "Spring",
      year: 2025,
      subjectCode: "COM101",
      instructorCode: "IN11114",
      shiftId: 2,
      roomName: "F.201",
      weekDays: "2, 4, 6",
    },
    {
      STT: "2",
      code: "SD18306", // Lấy mã chương trình học
      onlineLink: "http://linkmau",
      quantity: 40,
      block: 2,
      semester: "Fall",
      year: 2025,
      subjectCode: "COM101",
      instructorCode: "IN11114",
      shiftId: 5,
      roomName: "",
      weekDays: "3, 5, 7",
    },
  ];

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ LỚP HỌC" />
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
            data={clazzs} // Pass the fetched Clazzs data
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedClazz && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              className=""
              label={<>
                Lớp: {selectedClazz.code} - Năm: {selectedClazz.year} - Học kỳ: {selectedClazz.semester} - Block: {selectedClazz.block}
              </>}
            >
              <div>
                <div className="w-[700px] py-2">
                  <TextFieldGroup
                    code={selectedClazz.code}
                    onlineLink={selectedClazz.onlineLink}
                    quantity={selectedClazz.quantity}
                    block={selectedClazz.block}
                    semester={selectedClazz.semester}
                    year={selectedClazz.year}
                    subjectCode={selectedClazz.subjectCode}
                    subjectName={selectedClazz.subjectName}
                    instructorLastName={selectedClazz.instructorLastName}
                    instructorFirstName={selectedClazz.instructorFirstName}
                    instructorCode={selectedClazz.instructorCode}
                    shiftId={selectedClazz.shiftId}
                    roomName={selectedClazz.roomName}
                    building={selectedClazz.building}
                    weekdays={selectedClazz.weekdays}
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
            onClick={() => formikClazz.submitForm()}
            formik={formikClazz}
            loading={loading}
            setEditClazz={setEditClazz}
            setIsEditDisabled={setIsEditDisabled}
            years={years}
            instructorValue={instructorValue}
            setInstructorValue={setInstructorValue}
            subjectValue={subjectValue}
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
              exportFileName="Danh sách lớp học"
              exportFileNamePattern="Danh sách lớp học mẫu để import"
              sheetName="DSLH"
              importExcelAPI={importExcelClazzAPI}
              isReLoadTable={isReLoadTable}
              setIsReLoadTable={setIsReLoadTable}
            />
          }
          isOpen={isModalOpenExcel}
          onClose={closeModal}
        />

        {/* Xóa sinh viên */}
        <Modal2
          id={"denyConfirmModal"}
          width="max-w-xl"
          title={"Bạn muốn xóa sinh viên này?"}
          content={<></>}
          iconPopup={
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-yellow-600 w-24 h-24"
            />
          }
          positionButton="center"
          buttonCancel={
            <Button2
              onClick={closeModal}
              hiddenParent="demoDate"
              variant="btn-secondary"
              type="button"
              size="text-sm px-6 py-3"
            >
              Hủy
            </Button2>
          }
          buttonConfirm={
            <Button2
              variant="btn-primary"
              type="button"
              size="text-sm px-6 py-3"
              onClick={handleDelete}
            >
              Xác Nhận
            </Button2>
          }
          isOpen={isModalOpenConfirm}
          onClose={closeModal}
          type="message"
        ></Modal2>
      </div>
    </Container>
  );
}

export default ClassManage;
