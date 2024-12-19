import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import TextField from "../../component/TextField.jsx";
import Button from "../../component/Button.jsx";
import TextArea from "../../component/TextArea.jsx";
import {
  getStudentInfo,
  updateStudentByStudent,
  updateImageAPI,
} from "../../api/Student.js";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { setUser } from "../../reducers/userSlice.tsx";
import avatar from "../../images/avatarUser.jpg";
import { faCamera, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal2 from "../../component/Modal2.tsx";
import AvatarModal from "./AvatarModal.tsx";
import { toast } from "react-toastify";
import Spinner from "../../component/Spinner.tsx";
import PieChartStudy from "./PieChartStudy.tsx";
import { getResultStudy } from "../../api/StudyResult";
import { getRoleFromToken } from "../../api/DecodeToken";

interface Student {
  id: number;
  code: string;
  lastName: string;
  firstName: string;
  email: string;
  gender: number;
  birthday: string;
  phone: string;
  address: string;
  description: string;
  avatar: string;
  course: string;
  year: number;
}

function PersonalInformation() {
  const [studentInfo, setStudentInfo] = useState({
    avatar: "",
    email: "",
    code: "",
    firstName: "",
    lastName: "",
    gender: null,
    birthday: "",
    phone: "",
    description: "",
    address: "",
    role: "",
  });

  const [openInfo, setOpenInfo] = useState(true);
  const [openWork, setOpenWork] = useState(false);
  const [userInfo, setUserInfo] = useState<Student>();
  const [className, setClassName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseUrl =
    "https://res.cloudinary.com/dc06mgef2/image/upload/v1734324086/";
  const dispatch = useDispatch();

  const handleOpenInfo = () => {
    setOpenInfo(true);
    setOpenWork(false);
  };

  const handleOpenWork = () => {
    setOpenInfo(false);
    setOpenWork(true);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setClassName("flex-col items-center");
      } else {
        setClassName("");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Hàm nhận tệp hình ảnh từ component con
  const handleImageChange = (file) => {
    setImageFile(file);
    if (file == null) setIsHidden(true);
    else setIsHidden(false);
  };

  // Hàm cập nhật hình đại diện
  const handleSubmitImage = async () => {
    setLoading(true); // Bắt đầu loading

    const formData = new FormData();

    // Thêm file ảnh vào FormData nếu có
    if (imageFile) {
      formData.append("avatar", imageFile);
    } else {
      formData.append("avatar", "");
    }

    // formData.append('publicId', publicId);

    try {
      let response = await updateImageAPI(userInfo.id, formData);
      if (response && response.statusCode == 200) {
        handleImageAPI();
        toast.success(response.message);
      } else {
        toast.error("Cập nhật hình đại diện không thành công");
      }
    } catch (error) {
      toast.error(error.data.message);
      console.log("error: ", error);
    }
    setLoading(false); // Kết thúc loading
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleImageAPI = async () => {
    let response = await getStudentInfo();
    if (response && response.data) {
      setUserInfo(response.data);
      dispatch(
        setUser({
          userInfo: response.data,
        })
      );
    }
  };

  useEffect(() => {
    handleImageAPI();
  }, []);

  const [userRole, setUserRole] = useState(null);
  const [resultStudy, setResultStudy] = useState({
    passedSubjects: 0,
    unfinishedSubjects: 0,
  });

  useEffect(() => {
    const role = getRoleFromToken();
    setUserRole(role);
    getResultStudy()
      .then((response) => {
        setResultStudy(response);
      })
      .catch((error) => {
        console.error("Failed to fetch study result:", error);
      });
  }, []); // Ensure useEffect only runs once on component mount

  const [title, setTitle] = useState("");

  useEffect(() => {
    determineTitle();
  }, [resultStudy]);

  const determineTitle = () => {
    switch (true) {
      case resultStudy.passedSubjects <= 5:
        setTitle("Khởi đầu");
        break;
      case resultStudy.unfinishedSubjects <= 5:
        setTitle("Sắp hoàn thành");
        break;
      case resultStudy.unfinishedSubjects === 0:
        setTitle("Hoàn thành");
        break;
      default:
        setTitle("Chưa hoàn thành");
        break;
    }
  };

  return (
    <Container>
      <TitleHeader title="THÔNG TIN SINH VIÊN" />
      <div className={`p-5 flex h-full ${className}`}>
        <div className="w-full lg:w-4/12 p-1 flex flex-col items-center">
          <div className="relative">
            <label htmlFor="avatar" className="w-40 ">
              <div className="w-40 h-40 rounded-full border border-2 border-gray-300 flex items-center justify-center">
                <img
                  className="w-40 h-40 rounded-full"
                  src={
                    userInfo
                      ? userInfo.avatar
                        ? baseUrl + userInfo.avatar
                        : avatar
                      : avatar
                  }
                  alt="Preview"
                />
              </div>
            </label>
            <div className="absolute bottom-3 right-0">
              <Button
                type="button"
                size="xs"
                variant="btn-none"
                className="text-slate-600 bg-gray-200 text-2xl w-10 h-10 p-2 self-center rounded-full "
                onClick={openModal}
                label={<FontAwesomeIcon icon={faCamera} />}
              ></Button>
            </div>
          </div>
          <div className="w-full flex flex-wrap">
            <div className="w-full mt-2">
              <TextField
                onField={true}
                label={"Mã Số Sinh Viên"}
                className="my-3"
                value={userInfo ? userInfo.code : ""}
                disabled
              />
            </div>
            <div className="w-full mt-2">
              <TextField
                onField={true}
                label={"Email"}
                className="my-3"
                value={userInfo ? userInfo.email : ""}
                disabled
              />
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <div className="w-full flex px-1">
            <Button
              className={`flex-1 bg-white rounded-none hover:bg-blue-100 text-[18px] justify-center font-medium mr-1 ${
                openInfo ? "border-b-2 border-black" : ""
              }`}
              label={"Thông tin cá nhân"}
              onClick={handleOpenInfo}
            />
            <Button
              className={`flex-1 bg-white rounded-none hover:bg-blue-100 text-[18px] justify-center font-medium ${
                openWork ? "border-b-2 border-black" : ""
              }`}
              label={"Thông tin học tập"}
              onClick={handleOpenWork}
            />
          </div>
          {openInfo && (
            <div className="p-2 shadow-inner shadow-gray-200 rounded-md mt-4 px-8 ">
              <div className="w-full flex my-2">
                <TextField
                  onField={true}
                  label={"Họ Tên"}
                  value={
                    userInfo ? userInfo.lastName + " " + userInfo.firstName : ""
                  }
                  className="flex-1 mr-5"
                  disabled={true}
                />
                <TextField
                  onField={true}
                  label={"Giới tính"}
                  value={userInfo ? (userInfo.gender ? "Nam" : "Nữ") : ""}
                  className="flex-1"
                  disabled={true}
                />
              </div>
              <div className="w-full flex my-2">
                <TextField
                  onField={true}
                  label={"Năm sinh"}
                  value={userInfo ? userInfo.birthday : ""}
                  className="flex-1 mr-5"
                  disabled={true}
                />
                <TextField
                  onField={true}
                  label={"Số điện thoại"}
                  value={userInfo ? userInfo.phone : ""}
                  name="phone"
                  className="flex-1"
                  disabled
                />
              </div>
              <TextField
                onField={true}
                label={"Địa chỉ"}
                className="my-2"
                value={userInfo ? userInfo.address : ""}
                name="address"
                disabled
              />
              <TextArea
                label={"Mô tả"}
                className="my-2"
                value={userInfo ? userInfo.description : ""}
                name="description"
                disabled
              />
            </div>
          )}
          {openWork && (
            <div className="p-2 shadow-inner shadow-gray-200 rounded-md mt-4 px-8 h-[403px] ">
              <div className="w-full flex my-2">
                <TextField
                  onField={true}
                  label={"Trạng thái"}
                  value={title}
                  className="flex-1 mr-5"
                  disabled={true}
                />
                <TextField
                  onField={true}
                  label={"Bậc đào tạo"}
                  value={"Cao đẳng"}
                  className="flex-1"
                  disabled={true}
                />
              </div>
              <div className="w-full flex my-2">
                <TextField
                  onField={true}
                  label={"Khoá"}
                  value={userInfo ? userInfo.course : ""}
                  className="flex-1 mr-5"
                  disabled={true}
                />
                <TextField
                  onField={true}
                  label={"Năm nhập học"}
                  value={userInfo ? userInfo.year : ""}
                  name="phone"
                  className="flex-1"
                  disabled
                />
              </div>
              <TextField
                onField={true}
                label={"Chuyên ngành"}
                className=""
                value={userInfo ? userInfo.address : ""}
                name="address"
                disabled
              />
              <div className="w-full flex">
                <div className="w-1/2 flex flex-col pr-3">
                  <TextField
                    onField={true}
                    label={"Đã hoàn thành"}
                    value={resultStudy.passedSubjects}
                    className="flex-1 my-2"
                    disabled={true}
                  />
                  <TextField
                    onField={true}
                    label={"Chưa hoàn thành"}
                    value={resultStudy.unfinishedSubjects}
                    name="phone"
                    className="flex-1"
                    disabled
                  />
                </div>
                <div className="w-1/2 pr-3 "></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal2
        id={"updateImage"}
        width="w-full md:max-w-2xl h-auto"
        title={`Cập nhật hình đại diện`}
        content={<AvatarModal onImageChange={handleImageChange} />}
        positionButton="end"
        isOpen={isModalOpen}
        onClose={closeModal}
        type="message"
        buttonConfirm={
          !isHidden && (
            <Button
              className={`flex-1 rounded-none hover:bg-blue-100 text-[18px] justify-center font-medium ${
                openWork ? "border-b-2 border-black" : ""
              }`}
              label={
                loading ? (
                  <>
                    <Spinner className="text-white" />
                  </>
                ) : (
                  "Lưu"
                )
              }
              onClick={handleSubmitImage}
              icon={!loading && <FontAwesomeIcon icon={faPlus} />}
            />
          )
        }
      ></Modal2>
    </Container>
  );
}

export default PersonalInformation;
