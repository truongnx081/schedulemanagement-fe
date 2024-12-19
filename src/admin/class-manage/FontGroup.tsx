import React, { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox";
import TextField from "../../component/TextField";
import Button from "../../component/Button";
import { blocks, semesters, year, shifts, weekdays } from "./DataSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { FormikProps } from "formik";
import Spinner from "../../component/Spinner.tsx";
import { getAllRoomByAdminAreaAPI } from "../../api/rooms.js";
import { getAllInstructorBySpecializationIdAPI } from "../../api/Instructor.js";
import { getAllSubject } from "../../api/Subject.js";

interface FontGroupProps {
  isEditDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  formik: FormikProps<any>;
  loading?: boolean;
  setEditClazz;
  setIsEditDisabled;
  years;
  instructorValue;
  subjectValue;
  setInstructorValue;
}

interface Room {
  id: number;
  name: string;
  buildingId: number;
  buildingName: string;
  areaId: number;
}

interface Instructor {
  id: number;
  code: string;
  lastName: string;
  firstName: string;
}

interface Subject {
  id: number;
  code: string;
  name: string;
  specializationId: number;
}

// Xác thực clazzz
export const clazzValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  code: Yup.string().required("Vui lòng nhập mã lớp"),
  quantity: Yup.number()
    .required("Vui lòng nhập số lượng sinh viên")
    .integer("Số lượng phải là số nguyên")
    .positive("Số lượng phải là số dương")
    .typeError("Số lượng phải là số") // Đây là thông báo lỗi khi kiểu dữ liệu không đúng
    .min(30, "Số lượng sinh viên ít nhất là 30")
    .max(50, "Số lượng sinh viên nhiều nhất là 50"),
  block: Yup.number().required("Vui lòng chọn block"),
  semester: Yup.string().required("Vui lòng chọn học kỳ"),
  year: Yup.number().required("Vui lòng chọn năm"),
  subjectId: Yup.string().required("Vui lòng chọn môn học"),
  shiftId: Yup.string().required("Vui lòng chọn ca học"),
  // roomId: Yup.string().required("Vui lòng chọn phòng học"),
  weekdays: Yup.string().required("Vui lòng chọn ngày học trong tuần"),
});

const FontGroup: React.FC<FontGroupProps> = ({
  isEditDisabled = false,
  onClick,
  formik,
  loading = false,
  setEditClazz,
  setIsEditDisabled,
  years,
  instructorValue = "",
  subjectValue = "",
  setInstructorValue,
}) => {
  const [areSelectBoxesDisabled, setAreSelectBoxesDisabled] = useState(false);
  const [listRoom, setListRoom] = useState<Room[]>([]);
  const [listInstructor, setListInstructor] = useState<Instructor[]>([]);
  const [listSubject, setListSubject] = useState<Subject[]>([]);
  const [isInstructor, setIsInstructor] = useState(true);
  const [isOnlineLink, setIsOnlineLink] = useState(false);
  const [isRoom, setIsRoom] = useState(false);

  const handleResetForm = () => {
    setAreSelectBoxesDisabled(false);
    setIsEditDisabled(false);
    console.log("check", formik.getFieldProps("id").value);
    if (formik.getFieldProps("id").value === 0) {
      formik.resetForm();
    } else {
      setEditClazz(null);
      setInstructorValue(null);
      setIsInstructor(true);
    }
  };

  // Tạo option room
  const roomOptions = listRoom.map((room) => ({
    value: room.id,
    label: `${room.buildingName + " (" + room.name + ")"}`,
  }));

  // Tạo option subject
  const subjectOptions = listSubject.map((subject) => ({
    value: `${subject.id}`,
    label: `${subject.code + " - " + subject.name}`,
    specializationId: `${subject.specializationId}`,
  }));

  // Tạo option instructor
  const instructorOptions = listInstructor.map((instructor) => ({
    value: `${instructor.id}`,
    label: `${instructor.code + " - " + instructor.lastName + " " + instructor.firstName
      }`,
  }));

  const handleChangeSubject = async (value) => {
    // Tìm option dựa trên giá trị được chọn
    const selectOption = subjectOptions.filter(
      (option) => option.value == value
    );

    // Lấy giá trị 'specializationId' từ option đã chọn
    if (selectOption) {
      const specializationId = selectOption[0]?.specializationId;
      if (specializationId) {
        let responseRooms = await getAllInstructorBySpecializationIdAPI(
          specializationId
        );
        if (responseRooms && responseRooms.data) {
          setListInstructor(responseRooms.data);
        }
      }
    }

    if (value != "") setIsInstructor(false);
    else setIsInstructor(true);
  };

  // Xử lý disable onlinelink
  const handleOnlineLink = (event, handleChange) => {
    let value = event.target.value;

    // Disable selectbox phòng học
    if (value.length > 0) {
      setIsRoom(true);
      formik.setFieldValue("roomId", "0"); // lấy phòng online theo khu vực user
    } else {
      setIsRoom(false);
      formik.setFieldValue("roomId", "0");
    }

    handleChange(event);
  };

  const handleAPI = async () => {
    // get all rooms
    let responseRooms = await getAllRoomByAdminAreaAPI();
    if (responseRooms && responseRooms.data) {
      setListRoom(responseRooms.data);
    }

    // get all Subject
    getAllSubject()
      .then((response) => {
        setListSubject(response);
      })
      .catch((error) => {
        console.error("Failed to fetch all subject:", error);
      });
  };

  const handleEdit = () => {
    formik.setFieldValue("subjectId", subjectValue); // Cập nhật giá trị Formik

    // Tìm option tương ứng với giá trị mới
    const selectedOption = subjectOptions.find(
      (option) => option.value == subjectValue
    );

    // Gọi hàm onChange thủ công
    if (selectedOption) {
      handleChangeSubject(subjectValue);
    }
  };

  useEffect(() => {
    if (subjectValue) {
      handleEdit();
    }
  }, [subjectValue]);

  useEffect(() => {
    handleAPI();
  }, []);

  useEffect(() => {
    setAreSelectBoxesDisabled(isEditDisabled);
  }, [isEditDisabled]);

  return (
    <div className="px-2 pt-1 ">
      <div>
        <TextField
          onField={true}
          placeholder="Mã lớp"
          className1={`w-full ${formik.touched.code && formik.errors.code && "border-red-500"
            }`}
          disabled={areSelectBoxesDisabled}
          {...formik.getFieldProps("code")}
        />
        {formik.errors.code && formik.touched.code && (
          <div className="text-red-500">{formik.errors.code as string}</div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Link online"
          className1={`w-full mt-2 ${formik.touched.onlineLink &&
            formik.errors.onlineLink &&
            "border-red-500"
            }`}
          disabled={isOnlineLink} // Không bị vô hiệu hoá
          {...formik.getFieldProps("onlineLink")}
          onChange={(e) => handleOnlineLink(e, formik.handleChange)}
        />
        {formik.errors.onlineLink && formik.touched.onlineLink && (
          <div className="text-red-500">
            {formik.errors.onlineLink as string}
          </div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Số lượng sinh viên"
          className="p-0 mt-2"
          disabled={false} // Không bị vô hiệu hoá
          className1={`w-full ${formik.touched.quantity &&
            formik.errors.quantity &&
            "border-red-500"
            }`}
          {...formik.getFieldProps("quantity")}
        />
        {formik.errors.quantity && formik.touched.quantity && (
          <div className="text-red-500">{formik.errors.quantity as string}</div>
        )}
      </div>
      <div className="pt-6 mb-2">
        <SelectBox
          options={blocks}
          nameSelect="Block"
          // nameSelectValue=''
          className1={`w-full ${formik.touched.block && formik.errors.block && "border-red-500"
            }`}
          onChange={(value) =>
            formik.setFieldValue("block", value.target.value)
          }
          value={formik.values.block || undefined}
        />
        {formik.errors.block && formik.touched.block && (
          <div className="text-red-500">{formik.errors.block as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={semesters}
          nameSelect="Học kỳ"
          nameSelectValue=""
          className1={`w-full ${formik.touched.semester &&
            formik.errors.semester &&
            "border-red-500"
            }`}
          onChange={(value) =>
            formik.setFieldValue("semester", value.target.value)
          }
          value={formik.values.semester || undefined}
        />
        {formik.errors.semester && formik.touched.semester && (
          <div className="text-red-500">{formik.errors.semester as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={years ? years : year}
          nameSelect="Năm học"
          nameSelectValue=""
          className1={`w-full ${formik.touched.year && formik.errors.year && "border-red-500"
            }`}
          onChange={(value) => formik.setFieldValue("year", value.target.value)}
          value={formik.values.year || undefined}
        />
        {formik.errors.year && formik.touched.year && (
          <div className="text-red-500">{formik.errors.year as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={subjectOptions}
          nameSelect="Môn học"
          nameSelectValue=""
          className1={`w-full ${formik.touched.subjectId &&
            formik.errors.subjectId &&
            "border-red-500"
            }`}
          onChange={(value) => {
            formik.setFieldValue("subjectId", value.target.value);
            handleChangeSubject(value.target.value);
          }}
          value={formik.values.subjectId || undefined}
        />
        {formik.errors.subjectId && formik.touched.subjectId && (
          <div className="text-red-500">
            {formik.errors.subjectId as string}
          </div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={instructorOptions}
          disable={instructorValue ? false : isInstructor}
          nameSelectValue=""
          nameSelect="Giảng viên"
          className1={`w-full ${formik.touched.instructorId &&
            formik.errors.instructorId &&
            "border-red-500"
            }`}
          onChange={(value) =>
            formik.setFieldValue("instructorId", value.target.value)
          }
          value={formik.values.instructorId || undefined}
        />
        {formik.errors.instructorId && formik.touched.instructorId && (
          <div className="text-red-500">
            {formik.errors.instructorId as string}
          </div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={shifts}
          // nameSelectValue=''
          nameSelect="Ca"
          className1={`w-full ${formik.touched.shiftId && formik.errors.shiftId && "border-red-500"
            }`}
          onChange={(value) =>
            formik.setFieldValue("shiftId", value.target.value)
          }
          value={formik.values.shiftId || undefined}
        />
        {formik.errors.shiftId && formik.touched.shiftId && (
          <div className="text-red-500">{formik.errors.shiftId as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={roomOptions}
          nameSelect="Phòng"
          nameSelectValue=""
          disable={isRoom}
          className1={`w-full ${formik.touched.roomId && formik.errors.roomId && "border-red-500"
            }`}
          // onChange={(value) => formik.setFieldValue('roomId', value.target.value)}
          value={formik.values.roomId || undefined}
          onChange={(value) => {
            formik.setFieldValue("roomId", value.target.value);
            if (value?.target?.value === "") setIsOnlineLink(false);
            else {
              formik.setFieldValue("onlineLink", "");
              setIsOnlineLink(true);
            }
          }}
        />
        {formik.errors.roomId && formik.touched.roomId && (
          <div className="text-red-500">{formik.errors.roomId as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={weekdays}
          nameSelectValue=""
          nameSelect="Ngày học trong tuần"
          className1={`w-full ${formik.touched.weekdays &&
            formik.errors.weekdays &&
            "border-red-500"
            }`}
          onChange={(value) =>
            formik.setFieldValue("weekdays", value.target.value)
          }
          value={formik.values.weekdays || undefined}
        />
        {formik.errors.weekdays && formik.touched.weekdays && (
          <div className="text-red-500">{formik.errors.weekdays as string}</div>
        )}
      </div>
      <div className="flex mt-4">
        <div className="w-1/3 flex justify-center">
          <Button
            label={
              <>
                <FontAwesomeIcon icon={faFile} className="mr-2" />
                Mới
              </>
            }
            className="w-11/12 p-2 text-white justify-center"
            onClick={handleResetForm}
          />
        </div>
        <div className="w-1/3 flex justify-center">
          <Button
            label={
              loading ? (
                <>
                  <Spinner className="text-white" />
                </>
              ) : (
                <>Lưu</>
              )
            }
            className="w-11/12 p-2 text-white justify-center"
            disabled={loading}
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
};

export default FontGroup;
