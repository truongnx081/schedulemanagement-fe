import React, { useState, useEffect } from "react";
import SelectBox from "../../component/SelectBox";
import TextField from "../../component/TextField";
import Button from "../../component/Button";
import { yearOption, semesters } from "./DataSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { FormikProps } from "formik";
import Spinner from "../../component/Spinner.tsx";
import BoxComponent from "../../component/BoxComponent.tsx";
import { getAllPrivateMajorAPI } from "../../api/PrivateMajor.js";
import { getAllSubjectBySpecializationIdAPI } from "../../api/Subject.js";

interface FontGroupProps {
  isEditDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClickAddSubject?: React.MouseEventHandler<HTMLButtonElement>;
  formik: FormikProps<any>;
  loading?: boolean;
  setEditEducationProgram;
  setIsEditDisabled;
  years;
  // setListSubject;
  selectedItem;
  setSelectedItem;
  privateMajorValue;
  setIsHidden;
  isHidden;
}

interface PrivateMajor {
  id: number;
  name: string;
  specializationId: number;
}

// Xác thực giảng viên
export const iducationProgramValidationSchema = Yup.object().shape({
  id: Yup.number().required(),
  privateMajorId: Yup.string().required("Vui lòng chọn chuyên ngành hẹp"),
  name: Yup.string().required("Vui lòng nhập tên chương trình"),
  semester: Yup.string().required("Vui lòng chọn học kỳ triển khai"),
  year: Yup.string().required("Vui lòng chọn năm triển khai"),
});

const FontGroup: React.FC<FontGroupProps> = ({
  isEditDisabled = false,
  onClick,
  onClickAddSubject,
  formik,
  loading = false,
  setEditEducationProgram,
  setIsEditDisabled,
  years,
  // setListSubject,
  selectedItem,
  setSelectedItem,
  privateMajorValue,
  setIsHidden,
  isHidden,
}) => {
  const [areSelectBoxesDisabled, setAreSelectBoxesDisabled] = useState(false);
  const [listPrivateMajor, setListPrivateMajor] = useState<PrivateMajor[]>([]);

  useEffect(() => {
    setAreSelectBoxesDisabled(isEditDisabled);
    if (isEditDisabled) setIsHidden("");
  }, [isEditDisabled]);

  const handleResetForm = () => {
    setAreSelectBoxesDisabled(false);
    setIsEditDisabled(false);
    if (formik.getFieldProps("id").value === 0) {
      formik.resetForm();
    } else {
      setEditEducationProgram(null);
    }
    setIsHidden("hidden");
    setSelectedItem([]);
  };

  const handleEdit = () => {
    formik.setFieldValue("privateMajorId", privateMajorValue); // Cập nhật giá trị Formik

    // Tìm option tương ứng với giá trị mới
    const selectedOption = privateMajorOptions.find(
      (option) => option.value == privateMajorValue
    );

    // Gọi hàm onChange thủ công
    if (selectedOption) {
      handleChangeprivateMajor(privateMajorValue);
    }
  };

  useEffect(() => {
    if (privateMajorValue) {
      handleEdit();
    }
  }, [privateMajorValue]);

  const handleChangeprivateMajor = async (value) => {
    // Tìm option dựa trên giá trị được chọn
    const selectOption = privateMajorOptions.filter(
      (option) => option.value == value
    );

    // Lấy giá trị 'specializationId' từ option đã chọn
    if (selectOption) {
      const specializationId = selectOption[0]?.specializationId;
      if (specializationId) {
        setIsHidden("");

        // let response = await getAllSubjectBySpecializationIdAPI(
        //   specializationId
        // );
        // if (response && response.data) {
        //   setListSubject(response.data);
        //   setIsHidden("");
        // }
      } else {
        setIsHidden("hidden");
      }
    }
  };

  // Tạo option subject
  const privateMajorOptions = listPrivateMajor?.map((privateMajor) => ({
    value: `${privateMajor.id}`,
    label: `${privateMajor.name}`,
    specializationId: `${privateMajor.specializationId}`,
  }));

  const handleAPI = async () => {
    // get AllPrivateMajor
    getAllPrivateMajorAPI()
      .then((response) => {
        setListPrivateMajor(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch all subject:", error);
      });
  };

  useEffect(() => {
    handleAPI();
  }, []);

  return (
    <div className="px-2 pt-1 ">
      <div className="pt-1 mb-2">
        <TextField
          onField={true}
          placeholder="Tên chương trình"
          className="p-0 mt-2"
          className1={`w-full ${
            formik.touched.name && formik.errors.name && "border-red-500"
          }`}
          // disabled={areSelectBoxesDisabled}
          {...formik.getFieldProps("name")}
        />
        {formik.errors.name && formik.touched.name && (
          <div className="text-red-500">{formik.errors.name as string}</div>
        )}
      </div>
      <div className="pt-6 mb-2">
        <SelectBox
          options={years ? years : yearOption}
          nameSelect="Năm triển khai"
          nameSelectValue=""
          className1={`w-full ${
            formik.touched.year && formik.errors.year && "border-red-500"
          }`}
          onChange={(value) => formik.setFieldValue("year", value.target.value)}
          value={formik.values.year || undefined}
        />
        {formik.errors.year && formik.touched.year && (
          <div className="text-red-500">{formik.errors.year as string}</div>
        )}
      </div>
      <div className="pt-6 mb-2">
        <SelectBox
          options={semesters}
          nameSelect="Học kỳ triển khai"
          nameSelectValue=""
          className1={`w-full ${
            formik.touched.semester &&
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
      <div className="pt-6 mb-2">
        <SelectBox
          options={privateMajorOptions}
          nameSelect="Chuyên ngành hẹp"
          nameSelectValue=""
          className1={`w-full ${
            formik.touched.privateMajorId &&
            formik.errors.privateMajorId &&
            "border-red-500"
          }`}
          // onChange={(value) => formik.setFieldValue('privateMajorId', value.target.value)}
          value={formik.values.privateMajorId || undefined}
          onChange={(value) => {
            formik.setFieldValue("privateMajorId", value.target.value);
            handleChangeprivateMajor(value.target.value);
          }}
        />
        {formik.errors.privateMajorId && formik.touched.privateMajorId && (
          <div className="text-red-500">
            {formik.errors.privateMajorId as string}
          </div>
        )}
      </div>

      <div className="min-h-72 max-h-72 w-full border-2 overflow-auto">
        <BoxComponent
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
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
                <>Lưu</>
              )
            }
            className="w-11/12 p-2 text-white justify-center"
            disabled={loading}
            onClick={onClick}
          />
        </div>
        <div className="w-1/3 flex justify-center">
          <Button
            label="Chọn môn"
            className="w-12/12 p-1 text-white justify-center"
            disabled={loading}
            onClick={onClickAddSubject}
            hidden={isHidden}
          />
        </div>
      </div>
    </div>
  );
};

export default FontGroup;
