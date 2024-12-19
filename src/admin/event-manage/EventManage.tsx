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
import { areaOption } from "./DataSelect.js";
import {
  getAllEventByAreaAPI,
  createEventAPI,
  updateEventAPI,
  deleteEventAPI,
  importExcelEventAPI,
} from "../../api/Event.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { eventValidationSchema } from "./FontGroup.tsx";
import useConfirm from "../../hook/useConfirm.ts";
import ModalConfirm from "../../component/ModalConfirm.tsx";
import UploadExcelModal from "../../utils/UpLoadExcel.tsx";
import { getAllAreaAPI } from "../../api/Area.js";
import Spinner from "../../component/Spinner.tsx";
import { format } from "date-fns";
interface Event {
  id: number;
  name: string;
  date: string;
  place: string;
  content: boolean;
  image: string;
  adminId: number;
  areaId: number;
}

function EventManage() {
  const headers = ["Tên sự kiện", "Ngày triển khai", "Địa điểm", ""];

  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [editEvent, setEditEvent] = useState<Event>();
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
  const [isEvent, setIsEvent] = useState<Event | null>(null);
  const [isReLoadTable, setIsReLoadTable] = useState(false);
  const [area, setArea] = useState([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Call API
  const [selectedArea, setSelectedArea] = useState("1");
  const [events, setEvents] = useState<Event[]>([]);

  const handleEditClick = useCallback((Event) => {
    setEditEvent(Event);
    setIsEditDisabled(true);
  }, []);

  // const openModal = (Event) => setSelectedEvent(Event);
  const openModal = (item, id) => {
    if (id === "chi-tiet") {
      setSelectedEvent(item);
    } else if (id === "excel") {
      setIsModalOpenExcel(true);
    } else if (id === "delete") {
      setIsEvent(item);
      setIsModalConfirmOpen(true);
    }
  };
  const closeModal = () => {
    setSelectedEvent("");
    setIsModalOpenExcel(false);
    setIsModalConfirmOpen(false);
  };

  const renderRow = (item: Event) => [
    <td key={`item-name-${item.id}`} className=" border-b">
      <p className="truncate w-[300px]">{item.name}</p>
    </td>,
    <td key={`item-date-${item.id}`} className=" border-b">
      {format(item.date, "dd-MM-yyyy")}
    </td>,
    <td key={`item-place-${item.id}`} className=" border-b">
      <p className="truncate w-[300px]">{item.place}</p>
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

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
  };

  // Fetch events whenever course or major is selected
  useEffect(() => {
    if (selectedArea) {
      getAllEventByAreaAPI(selectedArea)
        .then((data) => {
          setEvents(data.data);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    }
  }, [selectedArea, isReLoadTable]);

  const selectBoxs = [
    {
      name: "Khu vực:",
      options: area ? area : areaOption,
      nameSelect: "Khu vực",
      onChange: handleAreaChange,
      value: selectedArea,
      className: "mr-1 w-full md:w-[150px] pt-4 md:pt-4",
      avaiableNameSelect: false,
      disable: true,
    },
  ];

  const defaultValues = {
    id: 0,
    name: "",
    date: "",
    place: "",
    content: "",
    image: "",
    adminId: "",
    areaId: "1",
  };

  const formikEvent = useFormik({
    initialValues: {
      id: editEvent ? editEvent.id : 0,
      name: editEvent ? editEvent.name : "",
      date: editEvent ? editEvent.date : "",
      place: editEvent ? editEvent.place : "",
      content: editEvent ? editEvent.content : "",
      image: editEvent ? editEvent.image : "",
      adminId: editEvent ? editEvent.adminId : "",
      areaId: editEvent ? editEvent.areaId : "1",
    },
    enableReinitialize: true,
    validationSchema: eventValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      // Tạo FormData
      const formData = new FormData();

      // // Chuyển đổi `event` thành chuỗi JSON và thêm vào formData
      const eventJson = JSON.stringify({
        ...values,
        image: "",
      });
      formData.append(
        "event",
        new Blob([eventJson], { type: "application/json" })
      );

      // Thêm file ảnh vào FormData nếu có
      if (values.image) {
        if (typeof values.image === "string") {
          formData.append("image", "");
        } else formData.append("image", values.image);
      } else {
        formData.append("image", "");
      }

      const action = async () => {
        if (values.id === 0) {
          setLoading(true); // Bắt đầu loading
          try {
            const response = await createEventAPI(formData);
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Thêm mới sự kiện thành công");
                resetForm();
                setIsReLoadTable(!isReLoadTable);
                setImagePreview(null);
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
            const response = await updateEventAPI(formData, values.id);
            if (response && response.data) {
              if (response.statusCode !== 200) toast.error(response.message);
              if (response.statusCode === 200) {
                toast.success("Cập nhật sự kiện thành công");
                setEditEvent(defaultValues);
                resetForm();
                setIsReLoadTable(!isReLoadTable);
                setImagePreview(null);
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
        ? openConfirm(action, "Bạn có chắc muốn thêm sự kiện này?")
        : openConfirm(action, `Bạn có chắc muốn cập nhật sự kiện này?`);
    },
  });

  // Xóa sự kiện
  const handleDelete = async () => {
    if (isEvent) {
      setLoading(true); // Bắt đầu loading
      try {
        let response = await deleteEventAPI(isEvent.id);
        if (response && response) {
          if (response.statusCode === 200) {
            toast.success("Xóa sự kiện thành công");
            setIsReLoadTable(!isReLoadTable);
          }
        } else {
          toast.error("Xóa sự kiện không thành công");
        }
        closeModal();
      } catch (error) {
        toast.error("Xóa sự kiện không thành công");
      }
      setLoading(false); // Kết thúc loading
    }
  };

  // Excel
  const extractedData = events.map((item) => ({
    name: item.name,
    date: item.date,
    place: item.place,
    content: item.content,
    areaId: item.areaId,
  }));

  // Excel template
  const dataTemplate = [
    {
      STT: "1",
      name: "Sự kiện 8/3",
      date: "2025-03-08",
      place:
        "Tòa nhà QTSC9 (toà T), đường Tô Ký, phường Tân Chánh Hiệp, quận 12, TP HCM.",
      content: "Tổ chức sự kiện mừng ngày quốc tế phụ nữ 8/3",
      area: " TP Hồ Chí Minh",
    },
    {
      STT: "2",
      name: "Sự kiện quốc tế thiếu nhi 1/5",
      date: "2025-05-01",
      place:
        "Toà nhà FPT Polytechnic, đường số 22, phường Thường Thạnh, quận Cái Răng, TP Cần Thơ",
      content: "Tổ chức sự kiện mừng ngày quốc tế thiếu nhi 1/5",
      area: " Cần Thơ",
    },
  ];

  // call api
  const callAPI = async () => {
    try {
      const response = await getAllAreaAPI();
      if (response && response.data) {
        if (response.statusCode === 200) {
          const formattedArea = response.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setArea(formattedArea);
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
      <TitleHeader title="QUẢN LÝ SỰ KIỆN" />
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
            data={events} // Pass the fetched events data
            maxRow={10}
            cbWidth="w-8/12"
          />
          {selectedEvent && (
            <Modal
              isOpen={true}
              onClose={closeModal}
              label={
                <>
                  Sự kiện số: {+" " + selectedEvent.id + " - Thời gian: "}
                  {format(selectedEvent.date, "dd-MM-yyyy")}
                </>
              }
            >
              <div>
                <div className="w-[700px] py-2">
                  <TextFieldGroup
                    name={selectedEvent.name}
                    date={selectedEvent.date}
                    place={selectedEvent.place}
                    content={selectedEvent.content}
                    image={selectedEvent.image}
                    areaId={selectedEvent.areaId}
                    area={area}
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
            onClick={() => formikEvent.submitForm()}
            formik={formikEvent}
            loading={loading}
            setEditEvent={setEditEvent}
            setIsEditDisabled={setIsEditDisabled}
            area={area}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
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
              exportFileName="Danh sách sự kiện"
              exportFileNamePattern="Danh sách sự kiện mẫu để import"
              sheetName="DSSK"
              importExcelAPI={importExcelEventAPI}
              isReLoadTable={isReLoadTable}
              setIsReLoadTable={setIsReLoadTable}
            />
          }
          isOpen={isModalOpenExcel}
          onClose={closeModal}
        />

        {/* Xóa sự kiện */}
        <Modal2
          id={"denyConfirmModal"}
          width="max-w-xl"
          title={`Bạn muốn xóa sự kiện này?`}
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
              {loading ? (
                <>
                  <Spinner className="text-white" />
                </>
              ) : (
                <>Xác Nhận</>
              )}
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
export default EventManage;
