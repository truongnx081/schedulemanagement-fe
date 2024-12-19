import TextField from "../../component/TextField";

function TextFieldGroup({
  exam_date,
  clazz_code,
  subject_code,
  shift_id,
  instructor_code,
  room_name,
  batch_exam,
  subject_name,
  last_name,
  first_name,
  start_time,
  end_time,
  building_name,
}) {
  return (
    <div className=" flex flex-wrap ">
      <TextField
        onField={true}
        label="Môn thi:"
        value={subject_code + ' - ' + subject_name}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Lớp:"
        value={clazz_code}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Giảng viên:"
        value={instructor_code + " - " + last_name + ' ' + first_name}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Ngày thi:"
        value={exam_date}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Ca thi:"
        value={shift_id}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Phòng thi:"
        value={room_name}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Đợt thi:"
        value={batch_exam}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Địa điểm thi:"
        value={building_name}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
      <TextField
        onField={true}
        label="Thời gian thi:"
        value={start_time + ' - ' + end_time}
        className="w-2/4 items-center pt-4 px-4"
        disabled
      />
    </div>
  );
}

export default TextFieldGroup;
