import TextField from "../../component/TextField";

function TextFieldGroup({
  ...props
}) {
  return (
    <div className="flex">
      <div className="w-2/4">
        <TextField
          onField={true}
          label="Mã lớp:"
          value={props.code}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Số lượng sinh viên:"
          value={props.quantity}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Học kỳ:"
          value={props.semester + ' ' + props.year}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Block:"
          value={props.block}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Môn học:"
          value={props.subjectCode + ' ' + props.subjectName}
          className="pt-4 px-4"
          disabled
        />
      </div>

      <div className="w-2/4">
        <TextField
          onField={true}
          label="Giảng viên:"
          value={props.instructorCode + ' - ' + props.instructorLastName + ' ' + props.instructorFirstName}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Phòng học:"
          value={props.building + ' (' + props.roomName + ')'}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Ca học:"
          value={props.shiftId}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Ngày học trong tuần:"
          value={props.weekdays}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Link học online:"
          value={props.onlineLink}
          className="pt-4 px-4"
          disabled
        />
      </div>
    </div>
  );
}

export default TextFieldGroup;
