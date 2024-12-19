import React, { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox.jsx";
import TextField from "../../component/TextField.jsx";
import Button from "../../component/Button.jsx";
import { clazzOption } from "./DataSelect.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPlus, faWrench } from "@fortawesome/free-solid-svg-icons";
import * as Yup from 'yup';
import { FormikProps } from 'formik';
import Spinner from "../../component/Spinner.tsx";
import { getAllSubject } from '../../api/Subject.js'
import { getAllRoomByAdminAreaAPI } from "../../api/rooms.js";
import { isAfter, isEqual, startOfToday } from 'date-fns';
import { getAllClazzAPI } from '../../api/clazzs.js'

interface FontGroupProps {
  isEditDisabled?: boolean;
  onClick?: (React.MouseEventHandler<HTMLButtonElement>);
  formik: FormikProps<any>;
  loading?: boolean;
  setEditSchedule
  setIsEditDisabled
}

// Xác thực lich thi
export const scheduleValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  date: Yup.date()
    .required("Vui lòng nhập ngày học")
    .test('is-valid-date', 'Ngày học không được nhỏ hơn ngày hiện tại', function (value) {
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
});

const FontGroup: React.FC<FontGroupProps> = ({
  isEditDisabled = false,
  onClick,
  formik,
  loading = false,
  setEditSchedule,
  setIsEditDisabled,
}) => {
  const [areSelectBoxesDisabled, setAreSelectBoxesDisabled] = useState(false);
  const [clazz, setClazz] = useState([]);

  useEffect(() => {
    setAreSelectBoxesDisabled(isEditDisabled);
  }, [isEditDisabled]);

  // Lấy option clazz
  useEffect(() => {
    const fetchAllClazz = async () => {
      const response = await getAllClazzAPI(); // Fetch the clazz
      const formattedClazz = response.data.map((clazz) => ({
        value: clazz.id,
        label: `${clazz.code + ' - ' + clazz.semester + ' ' + clazz.year + ' - Block ' + clazz.block}`,
      })); // Format data with value and label
      setClazz(formattedClazz);
    };

    fetchAllClazz(); // Call the API function
  }, []);

  const handleResetForm = () => {
    setAreSelectBoxesDisabled(false)
    setIsEditDisabled(false);
    if (formik.getFieldProps('id').value === 0) {
      formik.resetForm();
    }
    else {
      setEditSchedule(null)
    }
  };

  return (
    <div className="px-2 pt-1 ">
      <div>
        <TextField
          type={"date"}
          label="Ngày học:"
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
