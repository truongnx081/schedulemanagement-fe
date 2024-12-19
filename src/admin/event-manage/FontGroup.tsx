import React, { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox";
import TextField from "../../component/TextField";
import TextArea from "../../component/TextArea";
import Button from "../../component/Button";
import { areaOption } from "./DataSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import * as Yup from 'yup';
import { isAfter, isEqual, startOfToday } from 'date-fns';
import { FormikProps } from 'formik';
import Spinner from "../../component/Spinner.tsx";

interface FontGroupProps {
  isEditDisabled?: boolean;
  onClick?: (React.MouseEventHandler<HTMLButtonElement>);
  formik: FormikProps<any>;
  loading?: boolean;
  setEditEvent
  setIsEditDisabled
  area
  imagePreview,
  setImagePreview
}

// Xác thực sự kiện
export const eventValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  areaId: Yup.string()
    .required("Vui lòng chọn khu vực"),
  name: Yup.string().required('Vui lòng nhập tên sự kiện'),
  place: Yup.string().required("Vui lòng nhập địa điểm tổ chức"),
  content: Yup.string().required("Vui lòng nhập nội dung sự kiện"),
  date: Yup.date()
    .required("Vui lòng nhập ngày tổ chức")
    .test('is-valid-date', 'Ngày tổ chức không được nhỏ hơn ngày hiện tại', function (value) {
      const { id } = this.parent;
      const today = startOfToday(); // Lấy ngày hiện tại (bỏ qua phần giờ phút)
      return id === 0
        ? value
          ? isAfter(value, today) || isEqual(value, today) // Kiểm tra giá trị là ngày hôm nay hoặc sau hôm nay
          : true
        : true;
    }),
});

const FontGroup: React.FC<FontGroupProps> = ({
  isEditDisabled = false,
  onClick,
  formik,
  loading = false,
  setEditEvent,
  setIsEditDisabled,
  area,
  imagePreview,
  setImagePreview
}) => {
  const [boxesDisabled, setBoxesDisabled] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const openSamplePageInNewTab = () => {
    window.open('https://res.cloudinary.com/dc06mgef2/image/upload/v1731903390/fpoly-1655782316-8753-1655782371_1200x0_dwnzkj.jpg', '_blank');
  };
  const baseUrl =
    "https://res.cloudinary.com/dc06mgef2/image/upload/v1734324086/";

  useEffect(() => {
    setBoxesDisabled(isEditDisabled);
  }, [isEditDisabled]);

  const defaultValues = {
    id: 0,
    name: '',
    date: '',
    place: '',
    content: '',
    image: '',
    adminId: '',
    areaId: '1'
  };

  const handleResetForm = () => {
    setBoxesDisabled(false)
    setIsEditDisabled(false);
    if (formik.getFieldProps('id').value === 0) {
      formik.resetForm();
      setImagePreview("");
    }
    else {
      setEditEvent(defaultValues)
      setImagePreview("");
    }

  };

  // xử lý hình ảnh
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        if (img.width < 600 || img.height < 700) {
          setWarningMessage("Kích thước ảnh phải từ 600x700");
          formik.setFieldValue('image', "")
          setImagePreview("");
        } else {
          setWarningMessage(null);
          formik.setFieldValue('image', file)
          if (file) {
            const imageUrl = URL.createObjectURL(file); // Tạo URL xem trước cho tệp
            setImagePreview(imageUrl); // Cập nhật state để hiển thị ảnh
          }
        }
      };
    }
  };

  return (
    <div className="px-2 pt-1 ">
      <div className="w-full p-1 mb-4 flex flex-col items-center">
        <label htmlFor="image" className="w-full cursor-pointer">
          <div className="w-full h-52 border-dashed border-2 border-gray-300 flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview as string} alt="Preview" className="w-full h-full object-fill " />
            ) :
              formik.values.image ?
                (
                  <img src={baseUrl + formik.values.image as string} alt="Preview" className="w-full h-full object-fill " />
                ) :
                (
                  <div className="w-800 h-600 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Hình [600 x 700]</span>
                  </div>
                )}
          </div>
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleImageChange}
          className="hidden"
        />
        {formik.errors.image && formik.touched.image && (
          <div className='text-red-500'>{formik.errors.image as string}</div>
        )}
        <div className='text-red-500'>{warningMessage ? warningMessage : ""}</div>
        <button
          type="button"
          className="ml-4 text-blue-500 underline"
          onClick={openSamplePageInNewTab}
        >
          Tải ảnh mẫu
        </button>
      </div>
      <div className="pt-2 mb-2">
        <SelectBox
          options={area ? area : areaOption}
          nameSelect="Khu vực:"
          // disable={boxesDisabled}
          className1={`w-full ${formik.touched.areaId && formik.errors.areaId && 'border-red-500'}`}
          onChange={(value) => formik.setFieldValue('areaId', value.target.value)}
          value={formik.values.areaId || undefined}
        />
        {formik.errors.areaId && formik.touched.areaId && (
          <div className='text-red-500'>{formik.errors.areaId as string}</div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Tên sự kiện"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.name && formik.errors.name && 'border-red-500'}`}
          // disabled={boxesDisabled}
          {...formik.getFieldProps('name')}
        />
        {formik.errors.name && formik.touched.name && (
          <div className='text-red-500'>{formik.errors.name as string}</div>
        )}
      </div>
      <div>
        <TextField
          type="date"
          onField={true}
          placeholder="Ngày bắt đầu"
          className="p-0 mt-2"
          className1={`w-full ${formik.touched.date && formik.errors.date && 'border-red-500'}`}
          disabled={false} // Không bị vô hiệu hoá
          {...formik.getFieldProps('date')}
        />
        {formik.errors.date && formik.touched.date && (
          <div className='text-red-500'>{formik.errors.date as string}</div>
        )}
      </div>
      <div>
        <TextField
          onField={true}
          placeholder="Địa điểm tổ chức"
          className="p-0 mt-2"
          disabled={false} // Không bị vô hiệu hoá
          className1={`w-full ${formik.touched.place && formik.errors.place && 'border-red-500'}`}
          {...formik.getFieldProps('place')}
        />
        {formik.errors.place && formik.touched.place && (
          <div className='text-red-500'>{formik.errors.place as string}</div>
        )}
      </div>
      <div>
        <TextArea
          placeholder="Nội dung sự kiện"
          className={`w-full p-0 mt-2 ${formik.touched.content && formik.errors.content && 'border-red-500'}`}
          {...formik.getFieldProps('content')}
          disabled={false} // Không bị vô hiệu hoá
        />
        {formik.errors.content && formik.touched.content && (
          <div className='text-red-500'>{formik.errors.content as string}</div>
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
