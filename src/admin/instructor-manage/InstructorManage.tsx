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
import { specializationOption } from "./DataSelect.js";
import {
  getAllInstructorBySpecializationIdAPI,
  createInstructorAPI,
  updateInstructorAPI,
  deleteInstructorAPI,
  importExcelInstructorAPI,
} from "../../api/Instructor.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { instructorValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";
import { getAllSpecializationsAPI } from "../../api/Specialization.js";

interface Instructor {
  id: number;
  code: string;
  lastName: string;
  firstName: string;
  gender: boolean;
  birthday: string;
  phone: string;
  address: string;
  description: string;
  avatar: string;
  schoolEmail: string;
  privateEmail: string;
  specializationId: string;
}

function InstructorManage() {
  const headers = [
    "Mã giảng viên",
    "Họ và tên",
    "Giới tính",
    "Ngày sinh",
    "Số điện thoại",
    "",
  ];

  const [selectedInstructor, setSelectedInstructor] = useState<Instructor>();
  const [editInstructor, setEditInstructor] = useState<Instructor>();
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
  const [isInstructor, setIsInstructor] = useState<Instructor | null>(null);
  const [isReLoadTable, setIsReLoadTable] = useState(false);
  const [specialization, setSpecialization] = useState([]);

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
  // Call API
  const [selectedSpecialization, setSelectedSpecialization] = useState(1);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  const handleEditClick = useCallback((Instructor) => {
    setEditInstructor(Instructor);
    setIsEditDisabled(true);
  }, []);

  // const openModal = (Instructor) => setSelectedInstructor(Instructor);
  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedInstructor(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    } else if (id === "delete") {
      setIsInstructor(item);
      setIsModalConfirmOpen(true);
    }
  };
  const closeModal = () => {
    setSelectedInstructor("");
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
    <td key={`item-birthday-${item.id}`} className=" border-b">
      {item.birthday}
    </td>,
    <td key={`item-phone-${item.id}`} className=" border-b">
      {item.phone}
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

  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  // Fetch Instructors whenever course or major is selected
  useEffect(() => {
    if (selectedSpecialization) {
      getAllInstructorBySpecializationIdAPI(selectedSpecialization)
        .then((data) => {
          setInstructors(data.data);
        })
        .catch((error) => {
          console.error("Error fetching Instructors:", error);
        });
    }
  }, [selectedSpecialization, isReLoadTable]);

  const selectBoxs = [
    {
      name: "Bộ môn:",
      options: specializations,
      nameSelect: "Bộ môn",
      onChange: handleSpecializationChange,
      value: selectedSpecialization,
      className: "mr-1 w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
  ];

  const defaultValues = {
    id: 0,
    code: "",
    lastName: "",
    firstName: "",
    schoolEmail: "",
    privateEmail: "",
    gender: "true",
    birthday: "",
    phone: "",
    address: "",
    avatar: "",
    description: "",
    specializationId: "1",
  };

  const formikInstructor = useFormik({
    initialValues: {
      id: editInstructor ? editInstructor.id : 0,
      code: editInstructor ? editInstructor.code : "",
      lastName: editInstructor ? editInstructor.lastName : "",
      firstName: editInstructor ? editInstructor.firstName : "",
      schoolEmail: editInstructor ? editInstructor.schoolEmail : "",
      privateEmail: editInstructor ? editInstructor.privateEmail : "",
      gender: editInstructor
        ? editInstructor.gender
          ? "true"
          : "false"
        : "true",
      birthday: editInstructor ? editInstructor.birthday : "",
      phone: editInstructor ? editInstructor.phone : "",
      address: editInstructor ? editInstructor.address : "",
      avatar: editInstructor ? editInstructor.avatar : "",
      description: editInstructor ? editInstructor.description : "",
      specializationId: editInstructor ? editInstructor.specializationId : "1",
    },
    enableReinitialize: true,
    validationSchema: instructorValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      const formattedInstructor = { ...values };

      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createInstructorAPI(formattedInstructor);
            if (response && response.data) {
              if (response.data.statusCode !== 200)
                toast.error(response.data.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới giảng viên thành công");
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
            const response = await updateInstructorAPI(
              values.id,
              formattedInstructor
            );
            if (response && response.data) {
              if (response.data.statusCode !== 200)
                toast.error(response.data.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật giảng viên thành công");
                setEditInstructor(defaultValues);
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
        ? openConfirm(action, "Bạn có chắc muốn thêm giảng viên này?")
        : openConfirm(
          action,
          `Bạn có chắc muốn cập nhật giảng viên ${editInstructor?.code}?`
        );
    },
  });

  // Xóa giảng viên
  const handleDelete = async () => {
    if (isInstructor) {
      try {
        let response = await deleteInstructorAPI(isInstructor.id);
        if (response && response) {
          if (response.statusCode === 200) {
            toast.success("Xóa giảng viên thành công");
            setIsReLoadTable(!isReLoadTable);
          }
        } else {
          toast.error("Xóa giảng viên không thành công");
        }
        closeModal();
      } catch (error) {
        toast.error("Xóa giảng viên không thành công");
      }
    }
  };

  // Excel
  const extractedData = instructors.map((item) => ({
    code: item.code,
    lastName: item.lastName,
    firstName: item.firstName,
    schoolEmail: item.schoolEmail,
    privateEmail: item.privateEmail,
    gender: item.gender ? "Nam" : "Nữ",
    birthday: item.birthday,
    phone: item.phone,
    address: item.address,
    specializationId: item.specializationId,
    description: item.description,
  }));

  // Excel template
  const dataTemplate = [
    {
      STT: "1",
      code: "GV14121",
      last_name: "Nguyễn Trung",
      first_name: "Thanh",
      gender: "Nam",
      birthday: "1992-03-03",
      phone: "0938592811",
      schoolEmail: "thanhnt@fpt.edu.vn",
      privateEmail: "nguyenthanhtrung@gmail.com",
      address: "Ho Chi Minh City",
      specialization: "Quản trị kinh doanh",
      description: "Nguyễn Trung Thanh - Ho Chi Minh City",
    },
    {
      STT: "2",
      code: "GV11131",
      last_name: "Phan Thị",
      first_name: "Thanh",
      gender: "Nữ",
      birthday: "1995-08-11",
      phone: "0935030223",
      schoolEmail: "thanhpt@fpt.edu.vn",
      privateEmail: "thanhphan@gmail.com",
      address: "Ho Chi Minh City",
      specialization: "Công nghệ thông tin",
      description: "Phan Thị Thanh - Ho Chi Minh City",
    },
  ];

  // call api
  const callAPI = async () => {
    try {
      const response = await getAllSpecializationsAPI();
      if (response && response.data) {
        if (response.statusCode === 200) {
          const formattedSpecialization = response.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setSpecialization(formattedSpecialization);
        }
      }
    } catch (error) {
      console.log("lỗi:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ GIẢNG VIÊN" />
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
            data={instructors} // Pass the fetched Instructors data
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedInstructor && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              label={`${selectedInstructor.code} - ${selectedInstructor.lastName} ${selectedInstructor.firstName}`}
            >
              <div>
                <div className="w-[700px] py-2">
                  <TextFieldGroup
                    schoolEmail={selectedInstructor.schoolEmail}
                    privateEmail={selectedInstructor.privateEmail}
                    phone={selectedInstructor.phone}
                    address={selectedInstructor.address}
                    birthday={selectedInstructor.birthday}
                    code={selectedInstructor.code}
                    firstName={selectedInstructor.firstName}
                    lastName={selectedInstructor.lastName}
                    gender={selectedInstructor.gender}
                    description={selectedInstructor.description}
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
            onClick={() => formikInstructor.submitForm()}
            formik={formikInstructor}
            loading={loading}
            setEditInstructor={setEditInstructor}
            setIsEditDisabled={setIsEditDisabled}
            specialization={specializations}
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
              exportFileName="Danh sách giảng viên"
              exportFileNamePattern="Danh sách giảng viên mẫu để import"
              sheetName="DSGV"
              importExcelAPI={importExcelInstructorAPI}
              isReLoadTable={isReLoadTable}
              setIsReLoadTable={setIsReLoadTable}
            />
          }
          isOpen={isModalOpenExcel}
          onClose={closeModal}
        />

        {/* Xóa giảng viên */}
        <Modal2
          id={"denyConfirmModal"}
          width="max-w-xl"
          title={`Bạn muốn xóa giảng viên ${isInstructor?.code}?`}
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
export default InstructorManage;
