import React, { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox";
import TextField from "../../component/TextField";
import TextArea from "../../component/TextArea";
import Button from "../../component/Button";
import { specializationOption, gender, educationProgramId } from "./DataSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faPlus, faWrench } from "@fortawesome/free-solid-svg-icons";
import * as Yup from 'yup';
import { differenceInYears } from 'date-fns';
import { FormikProps } from 'formik';
import Spinner from "../../component/Spinner.tsx";
import { getAllSubject } from '../../api/Subject.js'
import BoxComponent from "../../component/BoxComponent.tsx";

interface FontGroupProps {
  isEditDisabled?: boolean;
  onClick?: (React.MouseEventHandler<HTMLButtonElement>);
  formik: FormikProps<any>;
  loading?: boolean;
  setEditSubject
  setIsEditDisabled
  specialization
  selectedItem;
  setSelectedItem;
  onClickAddMarkColumn
}

// Xác thực giảng viên
export const subjectValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  specializationId: Yup.string()
    .required("Vui lòng chọn bộ môn"),
  code: Yup.string().required('Vui lòng nhập mã môn học'),
  name: Yup.string().required("Vui lòng nhập tên môn học"),
  credits: Yup.number()
    .required("Vui lòng nhập số tín chỉ")
    .integer('Số tín chỉ phải là số nguyên')
    .positive('Số tín chỉ phải là số dương')
    .typeError('Số tín chỉ phải là số') // Đây là thông báo lỗi khi kiểu dữ liệu không đúng
    .min(2, "Số tín chỉ ít nhất là 2")
    .max(5, "Số tín chỉ nhiều nhất là 5"),
  total_hours: Yup.number()
    .required("Vui lòng nhập tổng giờ học")
    .integer('Tổng giờ học phải là số nguyên')
    .positive('Tổng giờ học phải là số dương')
    .typeError('Tổng giờ học phải là số') // Đây là thông báo lỗi khi kiểu dữ liệu không đúng
    .min(50, "Tổng giờ học ít nhất là 50")
    .max(120, "Tổng giờ học nhiều nhất là 120"),
  mission: Yup.string().required("Vui lòng nhập nhiệm vụ"),
  note: Yup.string().required("Vui lòng nhập ghi chú")
});

const FontGroup: React.FC<FontGroupProps> = ({
  isEditDisabled = false,
  onClick,
  formik,
  loading = false,
  setEditSubject,
  setIsEditDisabled,
  specialization,
  selectedItem,
  setSelectedItem,
  onClickAddMarkColumn
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
    setSelectedItem([])
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
      <div className="pt-2 mb-2">
        <SelectBox
          options={specialization ? specialization : specializationOption}
          nameSelect="Bộ môn"
          disable={areSelectBoxesDisabled}
          className1={`w-full ${formik.touched.specializationId && formik.errors.specializationId && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('specializationId', value.target.value)}
          value={formik.values.specializationId || undefined}
        />
        {formik.errors.specializationId && formik.touched.specializationId && (
          <div className='text-red-500'>{formik.errors.specializationId as string}</div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Mã môn học"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.code && formik.errors.code && 'border-red-500'}`}
          disabled={areSelectBoxesDisabled}
          {...formik.getFieldProps('code')}
        />
        {formik.errors.code && formik.touched.code && (
          <div className='text-red-500'>{formik.errors.code as string}</div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Tên môn học"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.name && formik.errors.name && 'border-red-500'}`}
          disabled={false} // Không bị vô hiệu hoá
          {...formik.getFieldProps('name')}
        />
        {formik.errors.name && formik.touched.name && (
          <div className='text-red-500'>{formik.errors.name as string}</div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Số tín chỉ"
          className="p-0 mt-2"
          disabled={false} // Không bị vô hiệu hoá
          className1={`w-full ${formik.touched.credits && formik.errors.credits && 'border-red-500'}`}
          {...formik.getFieldProps('credits')}
        />
        {formik.errors.credits && formik.touched.credits && (
          <div className='text-red-500'>{formik.errors.credits as string}</div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Tổng giờ học"
          className="p-0 mt-2"
          disabled={false} // Không bị vô hiệu hoá
          className1={`w-full ${formik.touched.total_hours && formik.errors.total_hours && 'border-red-500'}`}
          {...formik.getFieldProps('total_hours')}
        />
        {formik.errors.total_hours && formik.touched.total_hours && (
          <div className='text-red-500'>{formik.errors.total_hours as string}</div>
        )}
      </div>
      <div className="pt-6 mb-2">
        <SelectBox
          options={listSubject}
          nameSelect="Môn học bắt buộc"
          // disable={areSelectBoxesDisabled}
          className1={`w-full ${formik.touched.requiredId && formik.errors.requiredId && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('requiredId', value.target.value)}
          value={formik.values.requiredId || undefined}
        />
        {formik.errors.requiredId && formik.touched.requiredId && (
          <div className='text-red-500'>{formik.errors.requiredId as string}</div>
        )}
      </div>
      <div>
        <TextArea
          placeholder="Nhiệm vụ"
          rows={2}
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.mission && formik.errors.mission && 'border-red-500'}`}
          {...formik.getFieldProps('mission')}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.mission && formik.touched.mission && (
          <div className='text-red-500'>{formik.errors.mission as string}</div>
        )}
      </div>
      <div>
        <TextArea
          placeholder="Ghi chú"
          className="p-0 mt-2"
          rows={2}
          className1={`w-full ${formik.touched.note && formik.errors.note && 'border-red-500'}`}
          {...formik.getFieldProps('note')}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.note && formik.touched.note && (
          <div className='text-red-500'>{formik.errors.note as string}</div>
        )}
      </div>
      <div>
        <TextArea
          placeholder="Mô tả"
          className="p-0 mt-2"
          rows={2}
          // className1={`w-full ${formik.touched.description && formik.errors.description && 'border-red-500'}`}
          {...formik.getFieldProps('description')}
          disabled={false} // Không bị vô hiệu hoá
        />
      </div>
      <span className="text-red-500 font-bold">(%: tỉ lệ % cột điểm, Đợt: 1 hoặc 2)</span>
      <div className="min-h-72 max-h-72 w-full border-2 overflow-auto">
        <BoxComponent
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          isTextField={true}
        />
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
        <div className="w-1/3 flex justify-center">
          <Button
            label="Chọn cột điểm"
            className="w-12/12 p-1 text-white justify-center"
            disabled={loading}
            onClick={onClickAddMarkColumn}
          />
        </div>
      </div>
    </div>
  );
}

export default FontGroup;
