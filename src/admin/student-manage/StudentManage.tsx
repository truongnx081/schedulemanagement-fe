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
import TextFieldGroup from "./TextFieldGroup.jsx";
import {
  getAllStudentbyCourseAndMajor,
  createStudentAPI,
  updateStudentByAdminAPI,
  importExcelStudentAPI,
  deleteStudentAPI,
} from "../../api/Student.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { studentValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";
import { useDispatch } from "react-redux";
import { setCourse } from "../../reducers/courseSlice.tsx";
import { setMajor } from "../../reducers/majorSlice.tsx";
import { getAllSpecializationsAPI } from "../../api/Specialization.js";
import { getAllCourse } from "../../api/Student.js";

interface Student {
  id: number;
  majorId: number;
  course: string;
  code: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: boolean;
  birthday: string;
  phone: string;
  address: string;
  educationProgramId: number;
  year: number;
  semester: string;
  description: string;
  avatar: string;
}

function StudentManage() {
  const headers = ["Mã sinh viên", "Họ và tên", "Giới tính", ""];

  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [editStudent, setEditStudent] = useState<Student>();
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
  const [isStudent, setIsStudent] = useState<Student | null>(null);
  const [isReLoadTable, setIsReLoadTable] = useState(false);

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

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getAllCourse(); // Fetch the Courses
      const formattedCourses = data.map((course) => ({
        value: course.course,
        label: course.course,
      })); // Format data with value and label
      setCourses(formattedCourses);
      if (formattedCourses.length > 0) {
        setSelectedCourse(formattedCourses[0].value); // Set the first course as default
      }
    };
    fetchCourses(); // Call the API function
  }, []);
  console.log(selectedCourse);

  // Call API

  const [selectedMajor, setSelectedMajor] = useState(1);
  console.log(selectedCourse);
  console.log(selectedMajor);

  const [students, setStudents] = useState<Student[]>([]);
  const dispatch = useDispatch();
  const handleEditClick = useCallback((student) => {
    setEditStudent(student);
    setIsEditDisabled(true);
  }, []);

  // const openModal = (student) => setSelectedStudent(student);
  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedStudent(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    } else if (id === "delete") {
      setIsStudent(item);
      setIsModalConfirmOpen(true);
    }
  };
  const closeModal = () => {
    setSelectedStudent("");
    setIsModalOpenExcel(false);
    setIsModalConfirmOpen(false);
  };

  const renderRow = (item) => [
    <td key={`item-code-${item.id}`} className=" border-b">
      {item.code}
    </td>,
    <td key={`item-name-${item.id}`} className=" border-b">
      {item.lastName} {item.firstName}
    </td>,
    <td key={`item-gender-${item.id}`} className=" border-b">
      {item.gender ? "Nam" : "Nữ"}
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
            {
              text: "Xóa",
              onClick: () => openModal(item, "delete"),
            },
          ]}
        />
      </div>
    </td>,
  ];

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    dispatch(
      setCourse({
        course: event.target.value,
      })
    );
  };

  const handleMajorChange = (event) => {
    setSelectedMajor(event.target.value);
    dispatch(
      setMajor({
        major: event.target.value,
      })
    );
  };

  // Tìm giá trị course lớn nhất trong options
  // const getMaxValue = () => {
  //   return course
  //     .reduce((max, option) => {
  //       const currentValue = parseFloat(option.value); // Chuyển giá trị về kiểu số
  //       return currentValue > max ? currentValue : max;
  //     }, Number.MIN_VALUE)
  //     .toString(); // Đổi lại thành chuỗi
  // };

  // useEffect(() => {
  //   let courseMax = getMaxValue();
  //   setSelectedCourse(courseMax); // Đặt giá trị lớn nhất làm mặc định
  //   dispatch(
  //     setCourse({
  //       course: courseMax,
  //     })
  //   );
  // }, []);

  // Fetch students whenever course or major is selected
  useEffect(() => {
    if (selectedCourse && selectedMajor) {
      getAllStudentbyCourseAndMajor(selectedCourse, selectedMajor)
        .then((data) => {
          setStudents(data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });
    }
  }, [selectedCourse, selectedMajor, isReLoadTable]);
  const selectBoxs = [
    {
      name: "Khóa học:",
      options: courses,
      nameSelect: "Khoá",
      onChange: handleCourseChange,
      value: selectedCourse,
      nameSelectValue: null,
      className: "mr-1 w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      name: "Bộ môn:",
      options: specializations,
      nameSelect: "Bộ môn",
      onChange: handleMajorChange,
      value: selectedMajor,
      nameSelectValue: null,
      className: "mr-1 w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
  ];

  const defaultValues = {
    id: 0,
    majorId: "1",
    course: "18.3",
    code: "",
    lastName: "",
    firstName: "",
    email: "",
    gender: "true",
    birthday: "",
    phone: "",
    address: "",
    educationProgramId: "1",
    avatar: "",
    description: "",
  };

  const formikStudent = useFormik({
    initialValues: {
      id: editStudent ? editStudent.id : 0,
      majorId: editStudent ? editStudent.majorId : "1",
      course: editStudent ? editStudent.course : "18.3",
      code: editStudent ? editStudent.code : "",
      lastName: editStudent ? editStudent.lastName : "",
      firstName: editStudent ? editStudent.firstName : "",
      email: editStudent ? editStudent.email : "",
      gender: editStudent ? (editStudent.gender ? "true" : "false") : "true",
      birthday: editStudent ? editStudent.birthday : "",
      phone: editStudent ? editStudent.phone : "",
      address: editStudent ? editStudent.address : "",
      educationProgramId: editStudent ? editStudent.educationProgramId : "1",
      // semester: editStudent ? editStudent.semester : '',
      // year: editStudent ? editStudent.year : '',
      avatar: editStudent ? editStudent.avatar : "",
      description: editStudent ? editStudent.description : "",
    },
    enableReinitialize: true,
    validationSchema: studentValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      // Tạo FormData
      const formData = new FormData();

      // Chuyển object student thành JSON và thêm vào FormData
      const studentJson = JSON.stringify({
        ...values,
      });
      formData.append(
        "student",
        new Blob([studentJson], { type: "application/json" })
      );

      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createStudentAPI(formData);
            if (response && response.data) {
              if (response.data.statusCode !== 200)
                toast.error(response.data.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới sinh viên thành công");
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
            const response = await updateStudentByAdminAPI(values.id, formData);
            if (response && response.data) {
              if (response.data.statusCode !== 200)
                toast.error(response.data.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật sinh viên thành công");
                setEditStudent(defaultValues);
                resetForm();
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
        ? openConfirm(action, "Bạn có chắc muốn thêm sinh viên này?")
        : openConfirm(action, "Bạn có chắc muốn cập nhật sinh viên này?");
    },
  });

  // Xóa sinh viên
  const handleDelete = async () => {
    if (isStudent) {
      try {
        let response = await deleteStudentAPI(isStudent.id);
        if (response && response.data) {
          if (response.statusCode === 200) {
            // Lấy danh sách sinh viên mới
            if (selectedCourse && selectedMajor) {
              getAllStudentbyCourseAndMajor(selectedCourse, selectedMajor)
                .then((data) => {
                  setStudents(data);
                })
                .catch((error) => {
                  console.error("Error fetching students:", error);
                });
            }
            toast.success("Xóa thêm sinh thành công");
          }
        } else {
          toast.error("Xóa thêm sinh không thành công");
        }
        closeModal();
      } catch (error) {
        toast.error("Xóa thêm sinh không thành công");
      }
    }
  };

  // Excel
  const extractedData = students.map((item) => ({
    code: item.code, // Lấy mã chương trình học
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    gender: item.gender ? "Nam" : "Nữ",
    birthday: item.birthday,
    phone: item.phone,
    address: item.address,
    course: item.course,
    majorId: item.majorId,
    semester: item.semester,
    year: item.year,
    educationProgramId: item.educationProgramId,
    avatar: item.avatar,
    description: item.description,
  }));

  // Excel template
  const dataTemplate = [
    {
      STT: "1",
      code: "PS14120", // Lấy mã chương trình học
      first_name: "Thanh",
      last_name: "Nguyễn Trung",
      birthday: new Date("02-02-2000"),
      gender: "Nam",
      address: "Ho Chi Minh City",
      email: "1@gmail.com",
      phone: "0938592811",
      description: "Nguyễn Trung Thanh - Ho Chi Minh City",
      course: "18.1",
      major: "Phát Triển Phầm Mềm",
      semester: "Spring",
      year: 2024,
      education_program: "Chương Trinh Đào Tạo: Phát Triển Phần Mềm",
    },
    {
      STT: "2",
      code: "PS14121", // Lấy mã chương trình học
      first_name: "Thanh",
      last_name: "Phan Thị",
      birthday: new Date("02-02-2002"),
      gender: "Nữ",
      address: "Ho Chi Minh City",
      email: "2@gmail.com",
      phone: "0935030291",
      description: "Phan Thị Thanh - Ho Chi Minh City",
      course: "18.3",
      major: "Phát Triển Phầm Mềm",
      semester: "Spring",
      year: 2024,
      education_program: "Chương Trinh Đào Tạo: Phát Triển Phần Mềm",
    },
  ];

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ SINH VIÊN" />
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
            data={students} // Pass the fetched students data
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedStudent && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              label={`${selectedStudent.code} - ${selectedStudent.lastName} ${selectedStudent.firstName}`}
            >
              <div>
                <div className="w-[700px] py-2">
                  <TextFieldGroup
                    email={selectedStudent.email}
                    phone={selectedStudent.phone}
                    address={selectedStudent.address}
                    birthday={selectedStudent.birthday}
                    course={selectedStudent.course}
                    code={selectedStudent.code}
                    firstName={selectedStudent.firstName}
                    lastName={selectedStudent.lastName}
                    semester={selectedStudent.semester}
                    year={selectedStudent.year}
                    gender={selectedStudent.gender}
                    description={selectedStudent.description}
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
            onClick={() => formikStudent.submitForm()}
            formik={formikStudent}
            loading={loading}
            setEditStudent={setEditStudent}
            setIsEditDisabled={setIsEditDisabled}
            specialization={specializations}
            courses={courses}
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
              // setListAPI={setStudents}
              dataTemplate={dataTemplate}
              exportFileName="Danh sách sinh viên"
              exportFileNamePattern="Danh sách sinh viên mẫu để import"
              sheetName="DSSV"
              // getAllObject={getAllStudentbyCourseAndMajor}
              importExcelAPI={importExcelStudentAPI}
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
export default StudentManage;
