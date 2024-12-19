import React, { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox.jsx";
import TextField from "../../component/TextField.jsx";
import TextArea from "../../component/TextArea.jsx";
import Button from "../../component/Button.jsx";
import { shifts, batch, clazzOption } from "./DataSelect.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPlus, faWrench } from "@fortawesome/free-solid-svg-icons";
import * as Yup from 'yup';
import { differenceInYears } from 'date-fns';
import { FormikProps } from 'formik';
import Spinner from "../../component/Spinner.tsx";
import { getAllSubject } from '../../api/Subject.js'
import { getAllRoomByAdminAreaAPI } from "../../api/rooms.js";
import { isAfter, isEqual, startOfToday } from 'date-fns';

interface FontGroupProps {
  isEditDisabled?: boolean;
  onClick?: (React.MouseEventHandler<HTMLButtonElement>);
  formik: FormikProps<any>;
  loading?: boolean;
  setEditExamSchedule
  setIsEditDisabled
  clazz
}

interface Room {
  id: number;
  name: string;
  buildingId: number;
  buildingName: string;
  areaId: number;
}

// Xác thực lich thi
export const examScheduleValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  date: Yup.date()
    .required("Vui lòng nhập ngày thi")
    .test('is-valid-date', 'Ngày thi không được nhỏ hơn ngày hiện tại', function (value) {
      const { id } = this.parent;
      const today = startOfToday(); // Lấy ngày hiện tại (bỏ qua phần giờ phút)
      return id === 0
        ? value
          ? isAfter(value, today) || isEqual(value, today) // Kiểm tra giá trị là ngày hôm nay hoặc sau hôm nay
          : true
        : true;
    }),
  clazzId: Yup.string()
    .required("Vui lòng chọn lớp học"),
  batch: Yup.string()
    .required("Vui lòng chọn đợt thi"),
  roomId: Yup.string()
    .required("Vui lòng chọn phòng thi"),
  shiftId: Yup.string()
    .required("Vui lòng chọn ca thi"),
});

const FontGroup: React.FC<FontGroupProps> = ({
  isEditDisabled = false,
  onClick,
  formik,
  loading = false,
  setEditExamSchedule,
  setIsEditDisabled,
  clazz,
}) => {
  const [areSelectBoxesDisabled, setAreSelectBoxesDisabled] = useState(false);
  const [listSubject, setListSubject] = useState([]);
  const [listRoom, setListRoom] = useState<Room[]>([]);

  useEffect(() => {
    setAreSelectBoxesDisabled(isEditDisabled);
  }, [isEditDisabled]);

  const handleResetForm = () => {
    setAreSelectBoxesDisabled(false)
    setIsEditDisabled(false);
    if (formik.getFieldProps('id').value === 0) {
      formik.resetForm();
    }
    else {
      setEditExamSchedule(null)
    }
  };

  // Tạo option room
  const roomOptions = listRoom.map((room) => ({
    value: room.id,
    label: `${room.buildingName + " (" + room.name + ")"}`,
  }));

  const handleAPI = async () => {
    // get all Subject
    getAllSubject()
      .then((response) => {
        const subjectOption = response?.map((item) => ({
          value: item.id,
          label: item.code + ' - ' + item.name,
        }));
        setListSubject(subjectOption);
      })
      .catch((error) => {
        console.error("Failed to fetch all subject:", error);
      });

    // get all rooms
    let responseRooms = await getAllRoomByAdminAreaAPI();
    if (responseRooms && responseRooms.data) {
      setListRoom(responseRooms.data);
    }
  }

  useEffect(() => {
    handleAPI();
  }, []);

  return (
    <div className="px-2 pt-1 ">
      <div>
        <TextField
          type={"date"}
          label="Ngày thi:"
          onField={true}
          placeholder="date"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.date &&
            formik.errors.date &&
            "border-red-500"
            }`}
          {...formik.getFieldProps("date")}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.date && formik.touched.date && (
          <div className="text-red-500">{formik.errors.date as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={clazz ? clazz : clazzOption}
          nameSelect="Lớp học"
          disable={areSelectBoxesDisabled}
          className1={`w-full p-0 mt-2 ${formik.touched.clazzId && formik.errors.clazzId && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('clazzId', value.target.value)}
          value={formik.values.clazzId || undefined}
        />
        {formik.errors.clazzId && formik.touched.clazzId && (
          <div className='text-red-500'>{formik.errors.clazzId as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={batch}
          nameSelect="Đợt thi"
          // disable={areSelectBoxesDisabled}
          className1={`w-full ${formik.touched.batch && formik.errors.batch && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('batch', value.target.value)}
          value={formik.values.batch || undefined}
        />
        {formik.errors.batch && formik.touched.batch && (
          <div className='text-red-500'>{formik.errors.batch as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={roomOptions}
          nameSelect="Phòng thi"
          // disable={areSelectBoxesDisabled}
          className1={`w-full ${formik.touched.roomId && formik.errors.roomId && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('roomId', value.target.value)}
          value={formik.values.roomId || undefined}
        />
        {formik.errors.roomId && formik.touched.roomId && (
          <div className='text-red-500'>{formik.errors.roomId as string}</div>
        )}
      </div>
      <div className="pt-4 mb-2">
        <SelectBox
          options={shifts}
          nameSelect="Ca thi"
          // disable={areSelectBoxesDisabled}
          className1={`w-full ${formik.touched.shiftId && formik.errors.shiftId && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('shiftId', value.target.value)}
          value={formik.values.shiftId || undefined}
        />
        {formik.errors.shiftId && formik.touched.shiftId && (
          <div className='text-red-500'>{formik.errors.shiftId as string}</div>
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
                <>
                  Lưu
                </>
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
}

export default FontGroup;
