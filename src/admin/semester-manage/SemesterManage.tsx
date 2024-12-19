import MiniMenu from "../../component/MiniMenu.jsx";
import React, { useState, useEffect, useCallback } from "react";
import Table from "../../component/Table.jsx";
import Button from "../../component/Button.jsx";
import Modal from "../../component/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faFileImport } from "@fortawesome/free-solid-svg-icons";
import FontGroup from "./FontGroup.tsx";
import {
  getAllSemesterProgressByAdmin,
  updateDefaultSemesterProgress,
  createSemesterProgressAPI,
  updateSemesterProgressAPI,
  importExcelSemesterProgressAPI,
} from "../../api/SemesterProgress.js";
import { dates } from "./dates.js";
import TextFieldGroup from "./TextFieldGroup.jsx";
import CheckBox from "../../component/CheckBox.jsx";
import { getAllStudentbyCourseAndMajor } from "../../api/Student.js";
import { format } from "date-fns";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { toast } from "react-toastify";

import Button2 from "../../component/Button2.tsx";
import Modal2 from "../../component/Modal2.tsx";
import { useFormik } from "formik";
import { semesterProgressValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";
import { getAllSpecializationsAPI } from "../../api/Specialization.js";

interface SemesterProgress {
  id: number;
  block: number;
  semester: string;
  year: number;
  isActive: boolean;
  createDateStart: string;
  createDateEnd: string;
  repaireDateStart: string;
  repaireDateEnd: string;
  firstPartStart: string;
  firstPartEnd: string;
  secondPartStart: string;
  secondPartEnd: string;
}

function SemesterManage() {
  const headers = ["Block", "Học kỳ", "Năm học", "Trạng thái", ""];
  const [selectedSemesterProgress, setSelectedSemesterProgress] =
    useState<SemesterProgress | null>(null);
  const [editSemesterProgress, setEditSemesterProgress] =
    useState<SemesterProgress>();
  const [isEditDisabled, setIsEditDisabled] = useState(false);
  const [isReLoadTable, setIsReLoadTable] = useState(false);
  // Call API
  const [semesterProgresss, setSemesterProgresss] = useState<
    SemesterProgress[]
  >([]);

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
  const [isSemesterProgress, setIsSemesterProgress] =
    useState<SemesterProgress | null>(null);
  const [specialization, setSpecialization] = useState([]);
  // Call API
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [specializations, setSpecializations] = useState([]);

  const handleEditClick = useCallback((semesterProgress) => {
    setEditSemesterProgress(semesterProgress);
    setIsEditDisabled(true);
    console.log("check", semesterProgress);
  }, []);

  // Đặt làm học kỳ mặc định
  const handleDefaultSemesterProgress = async (semesterProgressId) => {
    try {
      const response = await updateDefaultSemesterProgress(semesterProgressId);
      if (response) {
        if (response.statusCode === 200) {
          toast.success("Đặt giá trị mặt định thành công!");
          setIsReLoadTable(!isReLoadTable);
        }
      } else {
        toast.error("Đặt giá trị mặt định không thành công!");
      }
    } catch (error) {
      toast.error("Đặt giá trị mặt định không thành công!");
    }
  };

  // const openModal = (semesterProgress) => setSelectedSemesterProgress(semesterProgress);
  // const closeModal = () => setSelectedSemesterProgress(null);

  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedSemesterProgress(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    }
    // else if (id === "delete") {
    //   setIsSubject(item);
    //   setIsModalConfirmOpen(true);
    // }
  };

  const closeModal = () => {
    setSelectedSemesterProgress("");
    setIsModalOpenExcel(false);
    setIsModalConfirmOpen(false);
  };

  const renderRow = (item: SemesterProgress) => [
    <td key={`item-block-${item.id}`} className=" border-b">
      {item.block}
    </td>,
    <td key={`item-semester-${item.id}`} className=" border-b">
      {item.semester}
    </td>,
    <td key={`item-year-${item.id}`} className=" border-b">
      {item.year}
    </td>,
    <td
      key={`item-active-${item.id}`}
      className={`border-b font-bold ${item.isActive ? "text-green-500" : "text-red-500"
        }`}
    >
      {item.isActive ? "Đang hoạt động" : "Không hoạt động"}
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
              text: "Đặt làm mặc định",
              onClick: () => handleDefaultSemesterProgress(item.id),
            },
          ]}
        />
      </div>
    </td>,
  ];

  useEffect(() => {
    getAllSemesterProgressByAdmin()
      .then((data) => {
        setSemesterProgresss(data);
      })
      .catch((error) => {
        console.error("Error fetching semesterProgress:", error);
      });
  }, [isReLoadTable]);

  const formikSemesterProgress = useFormik({
    initialValues: {
      id: editSemesterProgress ? editSemesterProgress.id : 0,
      block: editSemesterProgress ? editSemesterProgress.block : "0",
      semester: editSemesterProgress ? editSemesterProgress.semester : "0",
      year: editSemesterProgress ? editSemesterProgress.year : "",
      createDateStart: editSemesterProgress
        ? editSemesterProgress.createDateStart
        : "",
      createDateEnd: editSemesterProgress
        ? editSemesterProgress.createDateEnd
        : "",
      repaireDateStart: editSemesterProgress
        ? editSemesterProgress.repaireDateStart
        : "",
      repaireDateEnd: editSemesterProgress
        ? editSemesterProgress.repaireDateEnd
        : "",
      firstPartStart: editSemesterProgress
        ? editSemesterProgress.firstPartStart
        : "",
      firstPartEnd: editSemesterProgress
        ? editSemesterProgress.firstPartEnd
        : "",
      secondPartStart: editSemesterProgress
        ? editSemesterProgress.secondPartStart
        : "",
      secondPartEnd: editSemesterProgress
        ? editSemesterProgress.secondPartEnd
        : "",
      isActive: editSemesterProgress ? editSemesterProgress.isActive : false,
    },

    enableReinitialize: true,
    validationSchema: semesterProgressValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      console.log("submit");
      const formattedSemesterProgress = { ...values };
      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createSemesterProgressAPI(
              formattedSemesterProgress
            );
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới tiến trình thành công");
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
            const response = await updateSemesterProgressAPI(
              formattedSemesterProgress,
              values.id
            );
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật tiến trình thành công");
                resetForm();
                setEditSemesterProgress(null);
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
        ? openConfirm(action, `Bạn có chắc muốn thêm tiến trình này?`)
        : openConfirm(action, `Bạn có chắc muốn cập nhật tiến trình này?`);
    },
  });

  // Excel
  const extractedData = semesterProgresss.map((item) => ({
    year: item.year,
    semester: item.semester,
    block: item.block,
    createDateStart: item.createDateStart,
    createDateEnd: item.createDateEnd,
    repaireDateStart: item.repaireDateStart,
    repaireDateEnd: item.repaireDateEnd,
    firstPartStart: item.firstPartStart,
    firstPartEnd: item.firstPartEnd,
    secondPartStart: item.secondPartStart,
    secondPartEnd: item.secondPartEnd,
    isActive: item.isActive,
  }));

  // Excel template
  const dataTemplate = [
    {
      STT: "1",
      year: 2025,
      semester: "Spring",
      block: 1,
      createDateStart: new Date("2025-01-03"),
      createDateEnd: new Date("2025-01-13"),
      repaireDateStart: new Date("2025-01-07"),
      repaireDateEnd: new Date("2025-01-23"),
      firstPartStart: new Date("2025-02-03"),
      firstPartEnd: new Date("2025-02-13"),
      secondPartStart: new Date("2025-02-22"),
      secondPartEnd: new Date("2025-02-30"),
    },
    {
      STT: "2",
      year: 2025,
      semester: "Summer",
      block: 2,
      createDateStart: new Date("2025-05-03"),
      createDateEnd: new Date("2025-05-13"),
      repaireDateStart: new Date("2025-05-07"),
      repaireDateEnd: new Date("2025-05-23"),
      firstPartStart: new Date("2025-06-03"),
      firstPartEnd: new Date("2025-06-13"),
      secondPartStart: new Date("2025-06-22"),
      secondPartEnd: new Date("2025-06-30"),
    },
  ];

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ HỌC KỲ" />
      <div className={`flex flex-col md:flex-row min-h-svh`}>
        <div className="p-2 flex-1">
          <Table
            DefaultTable={true}
            showOptions={true}
            showSearch={true}
            showSelectBox={true}
            headers={headers}
            renderRow={renderRow}
            data={semesterProgresss}
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedSemesterProgress && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              label={
                <>
                  Khóa {selectedSemesterProgress.block} - Kỳ{" "}
                  {selectedSemesterProgress.semester} - Năm{" "}
                  {selectedSemesterProgress.year}
                </>
              }
            >
              <div>
                <div className="w-full py-2">
                  <TextFieldGroup
                    createDateStart={selectedSemesterProgress.createDateStart}
                    createDateEnd={selectedSemesterProgress.createDateEnd}
                    repaireDateStart={selectedSemesterProgress.repaireDateStart}
                    repaireDateEnd={selectedSemesterProgress.repaireDateEnd}
                    firstPartStart={selectedSemesterProgress.firstPartStart}
                    firstPartEnd={selectedSemesterProgress.firstPartEnd}
                    secondPartStart={selectedSemesterProgress.secondPartStart}
                    secondPartEnd={selectedSemesterProgress.secondPartEnd}
                    block={selectedSemesterProgress.block}
                    semester={selectedSemesterProgress.semester}
                    year={selectedSemesterProgress.year}
                    isActive={
                      selectedSemesterProgress.isActive
                        ? "Đang hoạt động"
                        : "Không hoạt động"
                    }
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
            onClick={() => formikSemesterProgress.submitForm()}
            formik={formikSemesterProgress}
            loading={loading}
            setEditSubject={setEditSemesterProgress}
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
              exportFileName="Danh sách môn học"
              exportFileNamePattern="Danh sách tiến trình mẫu để import"
              sheetName="DSTT"
              importExcelAPI={importExcelSemesterProgressAPI}
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
export default SemesterManage;
