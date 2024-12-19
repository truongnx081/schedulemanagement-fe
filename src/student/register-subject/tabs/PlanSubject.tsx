import Table from "../../../component/Table.jsx";
import Button from "../../../component/Button.jsx";
import Button2 from "../../../component/Button2.tsx";
import React, { useState, useEffect } from "react";
import Container from "../../../component/Container.tsx";
import { toast } from "react-toastify";
import { getStudentInfo } from "../../../api/Student.js";
import { getRegistedClazzes } from "../../../api/clazzs.js";
import { paymentAPI } from "../../../api/Payment.js";
import {
  deleteClazz,
  updateAllStudyInIsTrueByStudent,
} from "../../../api/StudyIn.js";
import Modal from "../../../component/Modal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faMoneyCheck,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../../component/Spinner.tsx";
import { useSearchParams } from "react-router-dom";

// const subjects = [
//   {
//     code_subject: "COM107",
//     name_subject: "Tin học",
//     credit_subject: 3,
//     code_clazz: "SD18301",
//     shift: 1,
//     day_of_week: "Monday, Wednesday, Friday",
//     status: false,price: 5000000,
//   },
//   {
//     code_subject: "SKI101",
//     name_subject: "Lập trình cơ bản",
//     credit_subject: 3,
//     code_clazz: "SD18302",
//     shift: 2,
//     day_of_week: "Tuesday, Thursday, Saturday",
//     status: true,price: 5000000,
//   },
// ];

// const totalCredits = subjects.reduce((total, subject) => total + subject.credit_subject, 0);
// const totalPrice = subjects.reduce((total, subject) => total + subject.price, 0);

function PlanSubject() {
  const headers = [
    "Mã môn",
    "Môn",
    "Số tín chỉ",
    "Lớp",
    "Ca",
    "Thứ",
    "Ngày hết hạn",
    "Trạng thái",
    "",
  ];

  const header1s = ["Môn", "Lớp", "Ca", "Thứ", ""];

  const [selectedClazz, setSelectedClazz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const openModal = (clazz) => setSelectedClazz(clazz);
  const closeModal = () => setSelectedClazz(null);

  // Trạng thái thanh toán
  let status = searchParams.get("status");

  const renderRow = (item) => [
    <td key={`item-code_subject-${item.id}`} className="px-4 py-4">
      {item.subject_code}
    </td>,
    <td key={`item-name_subject-${item.id}`} className="px-4 py-4">
      {item.subject_name}
    </td>,
    <td key={`item-credit_subject-${item.id}`} className="px-6 py-4">
      {item.credits}
    </td>,
    <td key={`item-code_clazz-${item.id}`} className="px-6 py-4">
      {item.clazz_code}
    </td>,
    <td key={`item-shift-${item.id}`} className="px-6 py-4">
      {item.shift}
    </td>,

    <td key={`item-day_of_week-${item.id}`} className="px-4 py-4">
      {item.study_day}
    </td>,
    <td key={`item-date_end-${item.id}`} className="px-6 py-4">
      {"ngày hết hạn"}
    </td>,
    <td key={`item-status-${item.id}`} className="px-6 py-4">
      {item.status ? (
        <>
          <p className="text-green-500">Đã Thanh toán</p>
        </>
      ) : (
        <>
          <p className="text-red-500">Chưa thanh toán</p>
        </>
      )}
    </td>,
    <td key={`item-menu-${item.id}`} className="px-4 py-4">
      {item.status ? (
        <></>
      ) : (
        <>
          <Button
            onClick={() => openModal(item)}
            label="Huỷ"
            className="bg-white font-bold text-red-500 hover:bg-white"
          />
        </>
      )}
    </td>,
  ];

  const renderRow1 = (item) => [
    <td key={`item-name_subject-${item.id}`} className="px-4 py-4">
      {item.subject_name}
    </td>,
    <td key={`item-code_clazz-${item.id}`} className="px-6 py-4">
      {item.clazz_code}
    </td>,
    <td key={`item-shift-${item.id}`} className="px-6 py-4">
      {item.shift}
    </td>,

    <td key={`item-day_of_week-${item.id}`} className="px-4 py-4">
      {item.study_day}
    </td>,
    <td key={`item-status-${item.id}`} className="px-6 py-4">
      {item.status ? (
        <>
          <p className="text-green-500">Đã Thanh toán</p>
        </>
      ) : (
        <>
          <p className="text-red-500">Chưa thanh toán</p>
        </>
      )}
    </td>,
    <td key={`item-menu-${item.id}`} className="px-4 py-4">
      {item.status ? (
        <></>
      ) : (
        <>
          <Button
            onClick={() => openModal(item)}
            label="Huỷ"
            className="bg-white font-bold text-red-500 hover:bg-white"
          />
        </>
      )}
    </td>,
  ];

  const [selectedMajor, setSelectedMajor] = useState(null);

  const handleMajorChange = (event) => {
    setSelectedMajor(event.target.value);
  };

  // RESPONSIVE
  const [desktop, setDesktop] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 783) {
        setMobile(true);
        setDesktop(false);
      } else {
        setMobile(false);
        setDesktop(true);
      }
    };
    window.addEventListener("resize", handleResize);
    // Kiểm tra kích thước màn hình khi component được mount
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobile, desktop]);

  //GET STUDENT INFO
  const [student, setStudent] = useState([]);
  useEffect(() => {
    const fetchStudentData = async () => {
      const response = await getStudentInfo();
      setStudent(response.data);
    };
    fetchStudentData();
  }, []);

  //Get Registed Clazzes
  const [classes, setClasses] = useState([]);
  const [statusPaid, setStatusPaid] = useState(false);
  const [pricePaid, setPricePaid] = useState(1000000);

  useEffect(() => {
    const fetchClasses = async () => {
      const data = await getRegistedClazzes();
      const updatedClasses = data.map((clazz) => ({
        ...clazz,
        status: statusPaid,
        price: pricePaid,
      }));
      setClasses(updatedClasses);
    };
    fetchClasses();
  }, []);

  const totalCredits = classes.reduce(
    (total, clazz) => total + clazz.credits,
    0
  );
  const totalPrice = classes.reduce((total, clazz) => total + clazz.price, 0);

  // THAO TÁC THANH TOÁN VÀ HUỶ ĐĂNG KÝ
  // const handlePaid = (item) => {
  //   try {
  //     toast.success("Thanh toán thành công!");
  //     //console.log("Registration successful:", response);
  //     // setTimeout(() => {
  //     //   window.location.reload();
  //     // }, 1500);
  //   } catch (error) {
  //     toast.error("Thanh toán không thành công!");
  //     //console.error("Registration error:", error);
  //   }
  // };

  const handleDelete = async (clazzId) => {
    try {
      await deleteClazz(clazzId);
      toast.success("Huỷ thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Huỷ thất bại!");
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    // const payments = [
    //   {
    //     name: "Mỳ tôm Hảo Hảo ly",
    //     quantity: 2,
    //     price: 1000,
    //   },
    // ];
    let payments = [];
    classes.forEach(element => {
      let payment = {
        name: element.subject_name,
        quantity: 1,
        // price: element.price
        price: 1000,
      }
      payments.push(payment)
    });

    try {
      let response = await paymentAPI(payments);
      if (response && response.statusCode == 200) {
        // Redirect đến URL thanh toán
        window.location.href = response.data;
      }
    } catch (error) {
      toast.error("Lỗi thanh toán !");
    }

    setLoading(false);
  };

  // Cập nhật trạng thái môn học đã đăng ký của sinh viên thành true
  useEffect(() => {
    if (status === "PAID") {
      handleUpdateStatusByYearAndSemester();
    }
  }, []);

  const handleUpdateStatusByYearAndSemester = async () => {
    try {
      let response = await updateAllStudyInIsTrueByStudent();
      if (response.statusCode === 200)
        console.log("Cập nhật trạng thái môn học đã đăng ký thành công!");
    } catch (error) {
      console.log("Lỗi cập nhật môn học đã đăng ký:", error);
    }
  };

  return (
    <div className="">
      {desktop && (
        <>
          <Table
            DefaultTable={true}
            showOptions={true}
            showSearch={true}
            showSelectBox={true}
            showBtnEnd={true}
            headers={headers}
            renderRow={renderRow}
            data={classes}
            maxRow={10}
          />
        </>
      )}
      {mobile && (
        <>
          <Table
            DefaultTable={true}
            showOptions={true}
            showSearch={true}
            showSelectBox={true}
            headers={header1s}
            renderRow={renderRow1}
            data={classes}
            maxRow={10}
          />
        </>
      )}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p>
            Tên học viên:{" "}
            <span className="font-medium ml-2">
              {student.lastName} {student.firstName}
            </span>
          </p>
          <p>
            Mã học viên:{" "}
            <span className="font-medium ml-2">{student.code}</span>
          </p>
          <p>
            Tổng số tín chỉ đăng ký:{" "}
            <span className="font-medium ml-2">{totalCredits}</span>
          </p>
        </div>
        <div>
          <div className="flex flex-col justify-end">
            {classes.map((clazz) => (
              <div key={clazz.id} className="w-full flex justify-end">
                <p className="font-medium text-sm text-gray-400">
                  + {clazz.subject_code} - {clazz.price.toLocaleString()} VND
                </p>{" "}
                {/* Hiển thị giá */}
              </div>
            ))}
            <div className="border-t border-gray-400 w-full my-4 py-4 flex justify-end font-medium text-sm">
              Tổng:{" "}
              <p className="ml-2 text-red-500">
                {totalPrice.toLocaleString()} VND
              </p>
            </div>
          </div>
          {/* <Button label={"Thanh toán"} className="text-white justify-center w-[150px] h-10 p-1" /> */}
          {classes.length > 0 ? (
            <Button2
              type="button"
              size="xs"
              variant="btn-none"
              className="bg-blue-500 p-2 w-full md:w-40 self-center"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className="text-white" />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMoneyCheck} /> Thanh toán
                </>
              )}
            </Button2>
          ) : (
            ""
          )}
        </div>
      </div>
      {selectedClazz && (
        <Modal
          className={"md:w-[30%]"}
          isOpen={true}
          onClose={closeModal}
          label={`Xác nhận huỷ Môn: ${selectedClazz.subject_name}`}
          showHead={false}
        >
          <div className="pt-2">
            <div className="flex h-28 items-center my-4">
              <div className="w-[150px] h-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCircleExclamation}
                  className="h-[60%] text-yellow-500"
                />
              </div>
              <div className="flex flex-col items-start justify-start">
                <p className="font-medium text-2xl">XÁC NHẬN HUỶ ĐĂNG KÝ</p>
                <p className="font-medium text-xl">
                  {selectedClazz.subject_name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-black">
            <Button
              label={"Xác nhận"}
              className="text-white justify-center w-[150px] h-10 p-1"
              onClick={() => handleDelete(selectedClazz.id)}
            />
            <Button
              label={"Huỷ"}
              className="text-white justify-center bg-red-700 w-[150px] h-10 p-1"
              onClick={closeModal}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
export default PlanSubject;
