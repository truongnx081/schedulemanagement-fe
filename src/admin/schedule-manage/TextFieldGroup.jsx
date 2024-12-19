import TextField from "../../component/TextField";

function TextFieldGroup({
  clazz_code,
  date_schedule,
  instructor_code,
  room_name,
  shift_id,
  specialization_name,
  status = true,
  subject_code,
  subject_name,
}) {
  return (
    <div className=" flex flex-wrap ">
      <TextField
        onField={true}
        label="Bộ môn:"
        value={specialization_name}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Ngày:"
        value={date_schedule}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Mã môn:"
        value={subject_code}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Tên môn:"
        value={subject_name}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Mã lớp:"
        value={clazz_code}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Giảng viên:"
        value={instructor_code}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Phòng:"
        value={room_name}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Ca:"
        value={shift_id}
        className="w-2/4 pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Trạng thái:"
        value={status ? "Đang tiến hành" : "Đã off"}
        className="w-2/4 pt-4 px-4"
        disabled
      />
    </div>
  );
}

export default TextFieldGroup;
