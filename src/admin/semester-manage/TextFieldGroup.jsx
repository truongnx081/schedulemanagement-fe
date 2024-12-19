import TextField from "../../component/TextField";
import { format } from "date-fns";
function TextFieldGroup({
  createDateStart,
  createDateEnd,
  repaireDateStart,
  repaireDateEnd,
  firstPartStart,
  firstPartEnd,
  secondPartStart,
  secondPartEnd,
  block,
  semester,
  year,
  isActive,
}) {
  const formatted1 = format(createDateStart, "yyyy-MM-dd");
  const formatted2 = format(createDateEnd, "yyyy-MM-dd");
  const formatted3 = format(repaireDateStart, "yyyy-MM-dd");
  const formatted4 = format(repaireDateEnd, "yyyy-MM-dd");
  const formatted5 = format(firstPartStart, "yyyy-MM-dd");
  const formatted6 = format(firstPartEnd, "yyyy-MM-dd");
  const formatted7 = format(secondPartStart, "yyyy-MM-dd");
  const formatted8 = format(secondPartEnd, "yyyy-MM-dd");

  return (
    <div className="flex ">
      <div className="w-2/4">
        <TextField
          onField={true}
          label="Ngày bắt đầu:"
          value={formatted1}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Ngày kết thúc:"
          value={formatted2}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Ngày bắt đầu chuẩn bị:"
          value={formatted3}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Ngày kết thúc chuẩn bị:"
          value={formatted4}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Bắt đầu GĐ1:"
          value={formatted5}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Kết thúc GĐ1:"
          value={formatted6}
          className="pt-4 px-4"
          disabled
        />
      </div>
      <div className="w-2/4 mb-2">
        <TextField
          onField={true}
          label="Bắt đầu GĐ2:"
          value={formatted7}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Kết thúc GĐ2:"
          value={formatted8}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Khóa: "
          value={block}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Kỳ"
          value={semester}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Năm"
          value={year}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Active"
          value={isActive}
          className="pt-4 px-4"
          disabled
        />
      </div>
    </div>
  );
}

export default TextFieldGroup;
