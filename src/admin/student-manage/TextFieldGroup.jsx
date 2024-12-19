import TextField from "../../component/TextField";

function TextFieldGroup({ ...props }) {
  return (
    <div className="flex">
      <div className="w-2/4">
        <TextField
          onField={true}
          label="Học kỳ nhập học:"
          value={props.semester + " " + props.year}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Khóa:"
          value={props.course}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Mã sinh viên:"
          value={props.code}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Họ và tên:"
          value={props.lastName + " " + props.firstName}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Giới tính:"
          value={props.gender ? "Nam" : "Nữ"}
          className="pt-4 px-4"
          disabled
        />
      </div>
      <div className="w-2/4 mb-2">
        <TextField
          onField={true}
          label="Email:"
          value={props.email}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Ngày sinh:"
          value={props.birthday}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Số di động:"
          value={props.phone}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Địa chỉ:"
          value={props.address}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Mô tả:"
          value={props.description}
          className="pt-4 px-4"
          disabled
        />
      </div>
    </div>
  );
}

export default TextFieldGroup;
