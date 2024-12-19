import React, { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox";
import TextField from "../../component/TextField";
import TextArea from "../../component/TextArea";
import Button from "../../component/Button";
import { semesters, block } from "./DataSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPlus, faWrench } from "@fortawesome/free-solid-svg-icons";
import * as Yup from 'yup';
import { differenceInYears, format, parseISO } from 'date-fns';
import { FormikProps } from 'formik';
import Spinner from "../../component/Spinner.tsx";
import { getAllSubject } from '../../api/Subject.js'
import { isAfter, isEqual, startOfToday } from 'date-fns';

interface FontGroupProps {
  isEditDisabled?: boolean;
  onClick?: (React.MouseEventHandler<HTMLButtonElement>);
  formik: FormikProps<any>;
  loading?: boolean;
  setEditSubject
  setIsEditDisabled
  specialization
}

// Xác thực tiến trình học kỳ
export const semesterProgressValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  block: Yup.string()
    .required("Vui lòng chọn block"),
  semester: Yup.string()
    .required("Vui lòng chọn học kỳ"),
  // year: Yup.string().required('Vui lòng nhập năm học'),
  year: Yup.number()
    .required("Vui lòng nhập năm học")
    .integer("Năm học phải là số nguyên")
    .positive("Năm học phải là số dương")
    .typeError("Năm học phải là số") // Đây là thông báo lỗi khi kiểu dữ liệu không đúng
    .min(2001, "Năm học phải lớn hơn 2000")
    .max(2999, "Năm học phải nhỏ hơn 3000"),
  createDateStart: Yup.date()
    .required("Vui lòng nhập ngày bắt đầu cho admin")
    .test('is-valid-date', 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại', function (value) {
      const { id } = this.parent;
      const today = startOfToday(); // Lấy ngày hiện tại (bỏ qua phần giờ phút)
      return id === 0
        ? value
          ? isAfter(value, today) || isEqual(value, today) // Kiểm tra giá trị là ngày hôm nay hoặc sau hôm nay
          : true
        : true;
    }),
  createDateEnd: Yup.date()
    .required("Vui lòng nhập ngày kết thúc cho admin")
    .test('is-after-startTime', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
      const { createDateStart: startTime } = this.parent; // Rõ ràng hơn về ý nghĩa của startTime
      if (!startTime) {
        return this.createError({ path: 'createDateEnd', message: 'Vui lòng chọn ngày bắt đầu trước' });
      }
      return isAfter(value, startTime);
    }),
  repaireDateStart: Yup.date()
    .required("Vui lòng nhập ngày bắt đầu cho sinh viên")
    .test('is-valid-date1', 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại', function (value) {
      const { id } = this.parent;
      const today = startOfToday(); // Lấy ngày hiện tại (bỏ qua phần giờ phút)
      return id === 0
        ? value
          ? isAfter(value, today) || isEqual(value, today) // Kiểm tra giá trị là ngày hôm nay hoặc sau hôm nay
          : true
        : true;
    }),
  repaireDateEnd: Yup.date()
    .required("Vui lòng nhập ngày kết thúc cho sinh viên")
    .test('is-after-startTime1', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
      const { repaireDateStart: startTime } = this.parent;
      if (!startTime) {
        return this.createError({ path: 'repaireDateEnd', message: 'Vui lòng chọn ngày bắt đầu trước' });
      }
      return isAfter(value, startTime);
    }),
  firstPartStart: Yup.date()
    .required("Vui lòng nhập ngày bắt đầu cho giảng viên chỉnh sửa điểm giai đoạn đầu")
    .test('is-valid-date2', 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại', function (value) {
      const { id } = this.parent;
      const today = startOfToday(); // Lấy ngày hiện tại (bỏ qua phần giờ phút)
      return id === 0
        ? value
          ? isAfter(value, today) || isEqual(value, today) // Kiểm tra giá trị là ngày hôm nay hoặc sau hôm nay
          : true
        : true;
    }),
  firstPartEnd: Yup.date()
    .required("Vui lòng nhập ngày kết thúc cho giảng viên chỉnh sửa điểm giai đoạn đầu")
    .test('is-after-startTime2', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
      const { firstPartStart: startTime } = this.parent;
      if (!startTime) {
        return this.createError({ path: 'firstPartEnd', message: 'Vui lòng chọn ngày bắt đầu trước' });
      }
      return isAfter(value, startTime);
    }),
  secondPartStart: Yup.date()
    .required("Vui lòng nhập ngày bắt đầu cho giảng viên chỉnh sửa điểm giai đoạn cuối")
    .test('is-valid-date3', 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại', function (value) {
      const { id } = this.parent;
      const today = startOfToday(); // Lấy ngày hiện tại (bỏ qua phần giờ phút)
      return id === 0
        ? value
          ? isAfter(value, today) || isEqual(value, today) // Kiểm tra giá trị là ngày hôm nay hoặc sau hôm nay
          : true
        : true;
    }),
  secondPartEnd: Yup.date()
    .required("Vui lòng nhập ngày kết thúc cho giảng viên chỉnh sửa điểm giai đoạn cuối")
    .test('is-after-startTime3', 'Ngày kết thúc phải lớn hơn ngày bắt đầu', function (value) {
      const { secondPartStart: startTime } = this.parent;
      if (!startTime) {
        return this.createError({ path: 'secondPartEnd', message: 'Vui lòng chọn ngày bắt đầu trước' });
      }
      return isAfter(value, startTime);
    }),
});

const FontGroup: React.FC<FontGroupProps> = ({
  isEditDisabled = false,
  onClick,
  formik,
  loading = false,
  setEditSubject,
  setIsEditDisabled,
  specialization,
}) => {
  const [areSelectBoxesDisabled, setAreSelectBoxesDisabled] = useState(false);
  const [listSubject, setListSubject] = useState([]);

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
      setEditSubject(null)
    }
  };

  const formatDateForInput = (dateTimeString) => {
    if (!dateTimeString) return ""; // Nếu không có giá trị, trả về chuỗi rỗng
    return format(dateTimeString, "yyyy-MM-dd"); // Tách lấy phần ngày trước ký tự 'T'
  };

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
  }

  useEffect(() => {
    handleAPI();
  }, []);

  return (
    <div className="px-2 pt-1 ">
      <div className="mb-2">
        <TextField
          id="year"
          onField={true}
          placeholder="Năm học"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.year && formik.errors.year && 'border-red-500'}`}
          disabled={areSelectBoxesDisabled}
          {...formik.getFieldProps('year')}
        />
        {formik.errors.year && formik.touched.year && (
          <div className='text-red-500'>{formik.errors.year as string}</div>
        )}
      </div>
      <div className="pt-2 mb-2">
        <SelectBox
          options={semesters}
          nameSelect="Học kỳ"
          disable={areSelectBoxesDisabled}
          className1={`w-full p-0 mt-2 ${formik.touched.semester && formik.errors.semester && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('semester', value.target.value)}
          value={formik.values.semester || undefined}
        />
        {formik.errors.semester && formik.touched.semester && (
          <div className='text-red-500'>{formik.errors.semester as string}</div>
        )}
      </div>
      <div className="pt-2 mb-2">
        <SelectBox
          options={block}
          nameSelect="Block"
          disable={areSelectBoxesDisabled}
          className1={`w-full p-0 mt-2 ${formik.touched.block && formik.errors.block && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('block', value.target.value)}
          value={formik.values.block || undefined}
        />
        {formik.errors.block && formik.touched.block && (
          <div className='text-red-500'>{formik.errors.block as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="createDateStart"
          label="Ngày bắt đầu cho admin:"
          type={"date"}
          onField={true}
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.createDateStart &&
            formik.errors.createDateStart &&
            "border-red-500"
            }`}
          value={formatDateForInput(formik.values.createDateStart)}
          onChange={(e) => formik.setFieldValue("createDateStart", e.target.value)}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.createDateStart && formik.touched.createDateStart && (
          <div className="text-red-500">{formik.errors.createDateStart as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="createDateEnd"
          type={"date"}
          onField={true}
          label="Ngày kết thúc cho admin:"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.createDateEnd && formik.errors.createDateEnd && "border-red-500"
            }`}
          value={formatDateForInput(formik.values.createDateEnd)}
          onChange={(e) => formik.setFieldValue("createDateEnd", e.target.value)}
          disabled={false}
        />
        {formik.errors.createDateEnd && formik.touched.createDateEnd && (
          <div className="text-red-500">{formik.errors.createDateEnd as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="repaireDateStart"
          type={"date"}
          onField={true}
          label="Ngày bắt đầu cho sinh viên:"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.repaireDateStart &&
            formik.errors.repaireDateStart &&
            "border-red-500"
            }`}
          value={formatDateForInput(formik.values.repaireDateStart)}
          onChange={(e) => formik.setFieldValue("repaireDateStart", e.target.value)}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.repaireDateStart && formik.touched.repaireDateStart && (
          <div className="text-red-500">{formik.errors.repaireDateStart as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="repaireDateEnd"
          type={"date"}
          onField={true}
          label="Ngày kết thúc cho sinh viên:"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.repaireDateEnd &&
            formik.errors.repaireDateEnd &&
            "border-red-500"
            }`}
          value={formatDateForInput(formik.values.repaireDateEnd)}
          onChange={(e) => formik.setFieldValue("repaireDateEnd", e.target.value)}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.repaireDateEnd && formik.touched.repaireDateEnd && (
          <div className="text-red-500">{formik.errors.repaireDateEnd as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="firstPartStart"
          type={"date"}
          label="Ngày bắt đầu sửa điểm GD 1:"
          onField={true}
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.firstPartStart &&
            formik.errors.firstPartStart &&
            "border-red-500"
            }`}
          value={formatDateForInput(formik.values.firstPartStart)}
          onChange={(e) => formik.setFieldValue("firstPartStart", e.target.value)}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.firstPartStart && formik.touched.firstPartStart && (
          <div className="text-red-500">{formik.errors.firstPartStart as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="firstPartEnd"
          type={"date"}
          label="Ngày kết thúc sửa điểm GD 1:"
          onField={true}
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.firstPartEnd &&
            formik.errors.firstPartEnd &&
            "border-red-500"
            }`}
          value={formatDateForInput(formik.values.firstPartEnd)}
          onChange={(e) => formik.setFieldValue("firstPartEnd", e.target.value)}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.firstPartEnd && formik.touched.firstPartEnd && (
          <div className="text-red-500">{formik.errors.firstPartEnd as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="secondPartStart"
          type={"date"}
          label="Ngày bắt đầu sửa điểm GD 2:"
          onField={true}
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.secondPartStart &&
            formik.errors.secondPartStart &&
            "border-red-500"
            }`}
          value={formatDateForInput(formik.values.secondPartStart)}
          onChange={(e) => formik.setFieldValue("secondPartStart", e.target.value)}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.secondPartStart && formik.touched.secondPartStart && (
          <div className="text-red-500">{formik.errors.secondPartStart as string}</div>
        )}
      </div>
      <div>
        <TextField
          id="secondPartEnd"
          type={"date"}
          onField={true}
          label="Ngày kết thúc sửa điểm GD 2:"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.secondPartEnd &&
            formik.errors.secondPartEnd &&
            "border-red-500"
            }`}
          value={formatDateForInput(formik.values.secondPartEnd)}
          onChange={(e) => formik.setFieldValue("secondPartEnd", e.target.value)}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.secondPartEnd && formik.touched.secondPartEnd && (
          <div className="text-red-500">{formik.errors.secondPartEnd as string}</div>
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
