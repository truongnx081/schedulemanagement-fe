import MiniMenu from "../../component/MiniMenu.jsx";
import React, { useState, useEffect, useCallback } from "react";
import Table from "../../component/Table.jsx";
import Modal from "../../component/Modal.jsx";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import FontGroup from "./FontGroup.tsx";
import TextFieldGroup from "./TextFieldGroup.jsx";
import {
  getAllEducationProgramAPI,
  createApplyForEducationAPI,
  updateApplyForEducationAPI,
} from "../../api/EducationProgram.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { iducationProgramValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import { getAllYearAPI } from "../../api/years.js";
import { getAllByEducationProgramId } from "../../api/Subject.js";
import CheckboxGroup from "../../component/CheckBoxGroup.tsx";
import SelectBox from "../../component/SelectBox.jsx";
import { getAllSpecializationsAPI } from "../../api/Specialization.js";
import { getAllSubjectBySpecializationIdAPI } from "../../api/Subject.js";

interface EducationProgram {
  id: number;
  name: string;
  semester: string;
  year: number;
  privateMajorId: number;
}

interface Subject {
  id: number;
  code: string;
  name: string;
}

interface CheckboxItem {
  id: string;
  name: string;
}

function EducationProgramManage() {
  const headers = [
    "Tên chương trình",
    "Năm triển khải",
    "Học kỳ triển khai",
    "",
  ];

  const [selectedEducationProgram, setSelectedEducationProgram] =
    useState<EducationProgram>();
  const [editEducationProgram, setEditEducationProgram] =
    useState<EducationProgram>();
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
  const [isReLoadTable, setIsReLoadTable] = useState(false);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState<Number>(2024);
  const [listSubject, setListSubject] = useState<Subject[]>([]);
  const [isModalSubject, setIsModalSubject] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CheckboxItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [privateMajorValue, setPrivateMajorValue] = useState("");
  const [educationPrograms, setEducationPrograms] = useState<
    EducationProgram[]
  >([]);
  const [isHidden, setIsHidden] = useState("hidden");

  const handleEditClick = useCallback((educationProgram) => {
    setEditEducationProgram(educationProgram);
    setIsEditDisabled(true);

    setPrivateMajorValue(educationProgram.privateMajorId);

    getAllByEducationProgramId(educationProgram.id)
      .then((data) => {
        // setSelectedItem(data.data);
        // Trích xuất các `id` và tạo Set
        // const idsSet = new Set(data.data.map((item) => item.id));
        // Tạo option subject
        const privateMajorItem = data.data?.map((privateMajor) => ({
          id: `${privateMajor.id}`,
          name: `${privateMajor.name}`,
        }));
        setSelectedItem(privateMajorItem);
      })
      .catch((error) => {
        console.error("Error fetching EducationPrograms:", error);
      });
  }, []);

  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedEducationProgram(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    }
    // else if (id === 'delete') {
    //   setIsEducationProgram(item);
    //   setIsModalConfirmOpen(true);
    // }
    else if (id === "subject-modal") {
      setIsModalSubject(true);
      // handleSpecializationChange(1);
    }
  };
  const closeModal = () => {
    setSelectedEducationProgram("");
    setIsModalOpenExcel(false);
    setIsModalConfirmOpen(false);
    setIsModalSubject(false);
  };

  const renderRow = (item: EducationProgram) => [
    <td key={`item-name-${item.id}`} className=" border-b">
      {item.name}
    </td>,
    <td key={`item-year-${item.id}`} className=" border-b">
      {item.year}
    </td>,
    <td key={`item-semester-${item.id}`} className=" border-b">
      {item.semester}
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

  // Fetch EducationPrograms whenever isReLoadTable value is change
  useEffect(() => {
    getAllEducationProgramAPI()
      .then((data) => {
        setEducationPrograms(data.data);
      })
      .catch((error) => {
        console.error("Error fetching EducationPrograms:", error);
      });
  }, [isReLoadTable]);

  useEffect(() => {
    if (selectedItem) {
      // Trích xuất các `id` và tạo Set
      const idsSet = new Set(selectedItem.map((item) => item.id));
      setSelected(idsSet);
    }
  }, [selectedItem]);

  // Tạo môn học cho chương trình đào tạo
  const items = listSubject.map((subject) => ({
    id: `${subject.id}`,
    label: `${subject.code + " - " + subject.name}`,
  }));

  const handleCheckboxSubmit = (
    selectedItems: { id: string; name: string }[]
  ) => {
    console.log("Selected Items:", selectedItems);
    setSelectedItem(selectedItems);
    setIsModalSubject(false);
  };

  const formikEducationProgram = useFormik({
    initialValues: {
      id: editEducationProgram ? editEducationProgram.id : 0,
      name: editEducationProgram ? editEducationProgram.name : "",
      semester: editEducationProgram ? editEducationProgram.semester : "Spring",
      year: editEducationProgram ? editEducationProgram.year : selectedYear,
      privateMajorId: editEducationProgram
        ? editEducationProgram.privateMajorId
        : "0",
    },
    enableReinitialize: true,
    validationSchema: iducationProgramValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      const educationProgramDTO = { ...values };
      const ids = Array.from(selected);

      const formData = {
        ids,
        educationProgramDTO,
      };
      console.log("chẹc", ids)
      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createApplyForEducationAPI(formData);
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới chương trình đào tạo thành công");
                resetForm();
                setIsReLoadTable(!isReLoadTable);
                setSelectedItem([]);
                setIsHidden("hidden");
              }
            } else {
              toast.error("Thêm mới chương trình đào tạo không thành công");
            }
          } catch (error) {
            console.log("lỗi:", error);
            toast.error(error.data.message);
          }
          setLoading(false); // Kết thúc loading
        } else {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await updateApplyForEducationAPI(
              formData,
              values.id
            );
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật chương trình đào tạo thành công");
                resetForm();
                setEditEducationProgram(null);
                setIsReLoadTable(!isReLoadTable);
                setSelectedItem([]);
                setIsHidden("hidden");
              }
            } else {
              toast.error("Cập nhật chương trình đào tạo không thành công");
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
        ? openConfirm(action, "Bạn có chắc muốn thêm chương trình đào tạo này?")
        : openConfirm(
            action,
            `Bạn có chắc muốn cập nhật ${editEducationProgram?.name}?`
          );
    },
  });

  // call api
  const callAPI = async () => {
    // get years
    try {
      const response = await getAllYearAPI();
      if (response && response.data) {
        if (response.statusCode === 200) {
          const formattedYears = response.data
            .map((item) => ({
              value: item.year,
              label: item.year,
            }))
            .reverse();
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

  // bien bo mon
  const [specializations, setSpecializations] = useState([]);
  console.log(specializations);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  console.log(selectedSpecialization);
  //GET API VALUE CB SPECIALIZATION

  useEffect(() => {
    const fetchSpecializations = async () => {
      const data = await getAllSpecializationsAPI().then((data) => {
        const formattedSpecializations = data.map((specialization) => ({
          value: specialization.id,
          label: specialization.name,
        })); // Format data with value and label
        setSpecializations(formattedSpecializations);
        setSelectedSpecialization(formattedSpecializations[7].value);
      }); // Fetch the specializations
    };

    fetchSpecializations(); // Call the API function
  }, []);

  // thao tac doi bo mon
  const handleSpecializationChange = async (event) => {
    setSelectedSpecialization(event.target.value);
    // let response = await getAllSubjectBySpecializationIdAPI(event.target.value);
    // if (response && response.data) {
    //   setListSubject(response.data);
    //   setIsHidden("");
    //   // setSelectedSpecialization(response.data[0].value);
    //   // console.log(response.data);
    // }
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getAllSubjectBySpecializationIdAPI(
          selectedSpecialization
        );
        setListSubject(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [selectedSpecialization]);

  console.log(listSubject);

  // const selectBoxs = [
  //   {
  //     options: specializations,
  //     nameSelect: "Bộ môn",
  //     onChange: handleSpecializationChange,
  //     value: selectedSpecialization,
  //     className: "mr-1 w-full md:w-[150px] pt-4 md:pt-4",
  //   },
  // ];

  return (
    <Container>
      <TitleHeader title="QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO" />
      <div className={`flex flex-col md:flex-row min-h-svh`}>
        <div className="p-2 flex-1">
          <Table
            DefaultTable={true}
            showOptions={true}
            showSearch={true}
            // showSelectBoxes={true}
            // numberSelectBox={selectBoxs}
            headers={headers}
            renderRow={renderRow}
            data={educationPrograms} // Pass the fetched EducationPrograms data
            maxRow={10}
            showSelectBox={true}
          />
          {selectedEducationProgram && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              className=""
              label={<>{selectedEducationProgram.name}</>}
            >
              <div>
                <div className="w-[500px] h-auto py-2">
                  <TextFieldGroup
                    name={selectedEducationProgram.name}
                    semester={selectedEducationProgram.semester}
                    year={selectedEducationProgram.year}
                    years={years}
                  />
                </div>
              </div>
            </Modal>
          )}

          {/* Modal subject */}
          {isModalSubject && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              label={`Chọn môn học cho chương trình đào tạo`}
            >
              <div>
                <SelectBox
                  name={"Bộ môn"}
                  options={specializations}
                  avaiableNameSelect={false}
                  onChange={handleSpecializationChange}
                  value={selectedSpecialization}
                  className={"mr-1 w-full md:w-[150px] pt-4 md:pt-4"}
                />
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
          <FontGroup
            isEditDisabled={isEditDisabled}
            onClick={() => formikEducationProgram.submitForm()}
            onClickAddSubject={() => openModal("", "subject-modal")}
            formik={formikEducationProgram}
            loading={loading}
            setEditEducationProgram={setEditEducationProgram}
            setIsEditDisabled={setIsEditDisabled}
            years={years}
            // setListSubject={setListSubject}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            privateMajorValue={privateMajorValue}
            setIsHidden={setIsHidden}
            isHidden={isHidden}
          />
          <ModalConfirm
            isOpen={isConfirmOpen}
            onClose={closeConfirm}
            onConfirm={confirmAction}
            question={confirmQuestion}
          />
        </div>
      </div>
    </Container>
  );
}
export default EducationProgramManage;
