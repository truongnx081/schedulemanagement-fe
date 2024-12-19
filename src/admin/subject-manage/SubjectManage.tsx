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
  getAllSubjectBySpecializationIdAPI,
  createSubjectAPI,
  updateSubjectAPI,
  deleteSubjectAPI,
  importExcelSubjectAPI,
} from "../../api/Subject.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { subjectValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";
import { getAllSpecializationsAPI } from "../../api/Specialization.js";
import { getSubjectMarkBySubjectIdAPI } from "../../api/SubjectMark.js";
import { getAllMarkColumnAPI } from "../../api/MarkColumn.js";
import CheckboxGroup from "../../component/CheckBoxGroup.tsx";

interface Subject {
  id: number;
  code: string;
  name: string;
  credits: number;
  total_hours: number;
  mission: string;
  description: string;
  note: string;
  offline: boolean;
  status: boolean;
  requiredId: number;
  specializationId: number;
}

interface CheckboxItem {
  id: string;
  name: string;
  percentage: number;
  part: number;
}

interface SelectedItem {
  id: string;
  percentage: number;
  part: number;
}

interface MarkColumn {
  id: string;
  name: string;
}

function SubjectManage() {
  const headers = ["Mã môn", "Tên môn", "Tín chỉ", "Tổng giờ học", ""];

  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [editSubject, setEditSubject] = useState<Subject>();
  const [isEditDisabled, setIsEditDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CheckboxItem[]>([]);
  const {
    isConfirmOpen,
    openConfirm,
    closeConfirm,
    confirmAction,
    confirmQuestion,
  } = useConfirm();
  const [isModalOpenConfirm, setIsModalConfirmOpen] = useState(false);
  const [isModalOpenExcel, setIsModalOpenExcel] = useState(false);
  const [isSubject, setIsSubject] = useState<Subject | null>(null);
  const [isReLoadTable, setIsReLoadTable] = useState(false);
  const [specialization, setSpecialization] = useState([]);
  // Call API
  const [selectedSpecialization, setSelectedSpecialization] = useState(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [markColumns, setMarkColumns] = useState<MarkColumn[]>([]);
  const [specializations, setSpecializations] = useState([]);
  const [isModalMarkColumn, setIsModalMarkColumn] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [itemss, setItemss] = useState<Set<SelectedItem>>(new Set());

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

  const handleEditClick = useCallback((subject) => {
    setEditSubject(subject);
    setIsEditDisabled(true);

    getSubjectMarkBySubjectIdAPI(subject.id)
      .then((data) => {
        const markColumnItem = data.data?.map((markColumn) => ({
          id: `${markColumn.mark_column_id}`,
          name: `${markColumn.mark_column_name}`,
          percentage: `${markColumn.percentage}`,
          part: `${markColumn.part}`,
        }));
        setSelectedItem(markColumnItem);
      })
      .catch((error) => {
        console.error("Error fetching markColumn:", error);
      });
  }, []);

  // const openModal = (Subject) => setSelectedSubject(Subject);
  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedSubject(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    } else if (id === "delete") {
      setIsSubject(item);
      setIsModalConfirmOpen(true);
    }
    else if (id === "mark-column") {
      setIsModalMarkColumn(true);
    }
  };

  const closeModal = () => {
    setSelectedSubject("");
    setIsModalOpenExcel(false);
    setIsModalConfirmOpen(false);
    setIsModalMarkColumn(false);
  };

  const renderRow = (item: Subject) => [
    <td key={`item-code-${item.id}`} className=" border-b">
      {item.code}
    </td>,
    <td key={`item-name-${item.id}`} className=" border-b">
      {item.name}
    </td>,
    <td key={`item-credits-${item.id}`} className=" border-b">
      {item.credits}
    </td>,
    <td key={`item-total_hours-${item.id}`} className=" border-b">
      {item.total_hours}
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

  // Fetch Subjects whenever course or major is selected
  useEffect(() => {
    if (selectedSpecialization) {
      getAllSubjectBySpecializationIdAPI(selectedSpecialization)
        .then((data) => {
          setSubjects(data.data);
        })
        .catch((error) => {
          console.error("Error fetching Subjects:", error);
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

  const formikSubject = useFormik({
    initialValues: {
      id: editSubject ? editSubject.id : 0,
      code: editSubject ? editSubject.code : "",
      name: editSubject ? editSubject.name : "",
      credits: editSubject ? editSubject.credits : "",
      total_hours: editSubject ? editSubject.total_hours : "",
      mission: editSubject ? editSubject.mission : "",
      note: editSubject ? editSubject.note : "",
      requiredId: editSubject
        ? editSubject.requiredId
          ? editSubject.requiredId
          : "0"
        : "0",
      description: editSubject ? editSubject.description : "",
      specializationId: editSubject ? editSubject.specializationId : "1",
    },
    enableReinitialize: true,
    validationSchema: subjectValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      const subjectDTO = { ...values };
      const items = Array.from(itemss);

      let message = '';
      let sumPercentage = 0.0
      items.forEach((item) => {
        if (typeof item.percentage == 'undefined' || typeof item.part == 'undefined') {
          message = "Vui lòng nhập đầy đủ tỉ lệ phần trăm và đợt cho cột điểm!";
          return;
        }
        else if (item.part < 1 || item.part > 2) {
          message = `Đợt không thể là ${item.part}. Vui lòng nhập đúng đợt cho cột điểm!`;
          return;
        }
        else if (item.percentage < 0.0 || item.percentage > 100.0) {
          message = `Tỉ lệ phần trăm không thể là ${item.percentage}. Vui lòng nhập đúng tỉ lệ phần trăm cho cột điểm!`;
          return;
        }
        sumPercentage += Number(item.percentage);
      })

      if (message) {
        toast.error(message);
        return;
      }
      if (sumPercentage > 100.0) {
        toast.error(`Tổng tỉ lệ phần trăm đã nhập là ${sumPercentage}. Vui lòng nhập tổng tỉ lệ phần trăm của các cột điểm là 100!`);
        return;
      }
      else if (sumPercentage < 100.0) {
        toast.error(`Tổng tỉ lệ phần trăm đã nhập là ${sumPercentage}. Vui lòng nhập tổng tỉ lệ phần trăm của các cột điểm là 100!`);
        return;
      }
      if (items.length <= 0) {
        toast.error(`Vui lòng chọn cột điểm cho môn học!`);
        return;
      }

      const formData = {
        items,
        subjectDTO,
      };

      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createSubjectAPI(formData);
            if (response) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới môn học thành công");
                resetForm();
                setIsReLoadTable(!isReLoadTable);
                setSelectedItem([]);
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
            const response = await updateSubjectAPI(
              formData,
              values.id
            );
            if (response) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật môn học thành công");
                resetForm();
                setEditSubject(null);
                setIsReLoadTable(!isReLoadTable);
                setSelectedItem([]);
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
        ? openConfirm(action, `Bạn có chắc muốn thêm môn học ${values?.code}?`)
        : openConfirm(
          action,
          `Bạn có chắc muốn cập nhật môn học ${editSubject?.code}?`
        );
    },
  });

  // Xóa môn học
  const handleDelete = async () => {
    if (isSubject) {
      try {
        let response = await deleteSubjectAPI(isSubject.id);
        if (response) {
          if (response.statusCode === 200) {
            toast.success("Xóa môn học thành công");
            setIsReLoadTable(!isReLoadTable);
          }
        } else {
          toast.error("Xóa môn học không thành công");
        }
      } catch (error) {
        toast.error("Xóa môn học không thành công");
      }
      closeModal();
    }
  };

  // Excel
  const extractedData = subjects.map((item) => ({
    code: item.code,
    name: item.name,
    credits: item.credits,
    total_hours: item.total_hours,
    specializationId: item.specializationId,
    requiredId: item.requiredId,
    mission: item.mission,
    note: item.note,
    description: item.description,
  }));

  // Excel template
  const dataTemplate = [
    {
      STT: "1",
      code: "GAME303",
      name: "Lập trình game",
      credits: 3,
      total_hours: 80,
      specialization: "Công nghệ thông tin",
      requiredCode: "PDP201",
      mission: `Nhiệm vụ:
                1. Hoàn thành tất cả các bài tập, nhiệm vụ giảng viên đã giao.
                2. Không được phép vắng quá 30% tổng số buổi học.`,
      note: `Điều kiện thi: 
            -Tham gia tối thiểu 80% các buổi học.
            Điều kiện qua môn:
            - Điểm trung bình >=5
            - Các cột điểm không được bỏ trống`,
      description: "Lập trình game là môn học rất tuyệt vời",
    },
    {
      STT: "2",
      code: "MOBILE502",
      name: "Lập trình mobile",
      credits: 4,
      total_hours: 88,
      specialization: "Công nghệ thông tin",
      requiredCode: "",
      mission: `Nhiệm vụ:
                1. Hoàn thành tất cả các bài tập, nhiệm vụ giảng viên đã giao.
                2. Không được phép vắng quá 30% tổng số buổi học.`,
      note: `Điều kiện thi: 
            -Tham gia tối thiểu 80% các buổi học.
            Điều kiện qua môn:
            - Điểm trung bình >=5
            - Các cột điểm không được bỏ trống`,
      description: "Lập trình mobile là môn học rất tuyệt vời",
    },
  ];

  // call api
  const callAPI = async () => {
    try {
      const response = await getAllSpecializationsAPI();
      const response2 = await getAllMarkColumnAPI();
      if (response && response.data) {
        if (response.statusCode === 200) {
          const formattedSpecialization = response.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setSpecialization(formattedSpecialization);
        }
      }

      if (response2 && response2.data) {
        if (response2.statusCode === 200) {
          // const formattedSpecialization = response2.data.map((item) => ({
          //   value: item.id,
          //   label: item.name,
          // }));
          setMarkColumns(response2.data);
        }
      }
    } catch (error) {
      console.log("lỗi:", error);
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  // Tạo cột điểm cho môn học
  const items = markColumns.map((markColumn) => ({
    id: `${markColumn.id}`,
    label: `${markColumn.name}`,
  }));

  const handleCheckboxSubmit = (
    selectedItems: { id: string; name: string }[]
  ) => {
    setSelectedItem((prevArray) => {
      // Lọc các phần tử trong selectedItems mà id chưa tồn tại trong prevArray
      const filteredArray = selectedItems.filter(
        (newItem) => !prevArray.some((existingItem) => existingItem.id === newItem.id)
      );
      // Thêm các phần tử hợp lệ vào array hiện tại
      return [...prevArray, ...filteredArray];
    });
    setIsModalMarkColumn(false);
  };

  // set lại các cột điểm đã chọn
  useEffect(() => {
    if (selectedItem) {
      // Trích xuất các `id` và tạo Set
      const idsSet = new Set(selectedItem.map((item) => item.id));
      const item = new Set(selectedItem.map((item) => item));
      setSelected(idsSet);
      setItemss(item)
    }
  }, [selectedItem]);

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ MÔN HỌC" />
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
            data={subjects} // Pass the fetched Subjects data
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedSubject && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              label={
                <>
                  {selectedSubject.code + " - "}
                  {selectedSubject.name}
                </>
              }
            >
              <div>
                <div className="w-[900px] py-2">
                  <TextFieldGroup
                    name={selectedSubject.name}
                    credits={selectedSubject.credits}
                    total_hours={selectedSubject.total_hours}
                    mission={selectedSubject.mission}
                    note={selectedSubject.note}
                    code={selectedSubject.code}
                    requiredId={selectedSubject.requiredId}
                    description={selectedSubject.description}
                    specializationId={selectedSubject.specializationId}
                    specialization={specialization}
                    subjects={subjects}
                  />
                </div>
              </div>
            </Modal>
          )}

          {/* Modal subject */}
          {isModalMarkColumn && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              label={`Chọn cột điểm cho môn học`}
            >
              <div>
                <div className="w-[700px] py-2">
                  <CheckboxGroup
                    items={items}
                    onSubmit={handleCheckboxSubmit}
                    selected={selected}
                    setSelected={setSelected}
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
            onClick={() => formikSubject.submitForm()}
            formik={formikSubject}
            loading={loading}
            setEditSubject={setEditSubject}
            setIsEditDisabled={setIsEditDisabled}
            specialization={specializations}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            onClickAddMarkColumn={() => openModal("", "mark-column")}
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
              exportFileNamePattern="Danh sách môn học mẫu để import"
              sheetName="DSMH"
              importExcelAPI={importExcelSubjectAPI}
              isReLoadTable={isReLoadTable}
              setIsReLoadTable={setIsReLoadTable}
            />
          }
          isOpen={isModalOpenExcel}
          onClose={closeModal}
        />

        {/* Xóa môn học */}
        <Modal2
          id={"denyConfirmModal"}
          width="max-w-xl"
          title={`Bạn muốn xóa môn học ${isSubject?.code}?`}
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
export default SubjectManage;
