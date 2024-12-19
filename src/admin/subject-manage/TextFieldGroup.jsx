import TextField from "../../component/TextField";
import { specializationOption } from "./DataSelect.js";
import SelectBox from "../../component/SelectBox.jsx";
import TextArea from "../../component/TextArea.jsx";

function TextFieldGroup({
  ...props
}) {

  const subjectOption = props.subjects?.map((item) => ({
    value: item.id,
    label: item.code + ' - ' + item.name,
  }));

  return (
    <div className="flex">
      <div className="w-2/4">
        <SelectBox
          options={props.specialization ? props.specialization : specializationOption}
          name="Bộ môn:"
          // nameSelect="Khu vực"
          disable
          className=" px-4 mt-5"
          value={props.specializationId}
        />
        <TextField
          onField={true}
          label="Mã môn học:"
          value={props.code}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Tên môn học:"
          value={props.name}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Số tín chỉ:"
          value={props.credits}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Tổng giờ học"
          value={props.total_hours}
          className="pt-4 px-4"
          disabled
        />
        <SelectBox
          options={subjectOption}
          name="Môn học bắt buộc:"
          // nameSelect="Khu vực"
          disable
          className=" px-4 mt-5"
          value={props.requiredId}
        />
      </div>

      <div className="w-2/4">
        <TextArea
          label="Nhiệm vụ:"
          className=" px-4"
          disabled
          value={props.mission}
        />
        <TextArea
          label="Ghi chú:"
          className=" px-4"
          disabled
          value={props.note}
        />
        <TextArea
          label="Mô tả:"
          className=" px-4"
          disabled
          value={props.description}
        />
      </div>
    </div>
  );
}

export default TextFieldGroup;
