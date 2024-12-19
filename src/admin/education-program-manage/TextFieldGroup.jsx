import TextField from "../../component/TextField";

function TextFieldGroup({ ...props }) {
  return (
    <div className="flex">
      <div className="w-full">
        <TextField
          onField={true}
          label="Tên chương trình:"
          value={props.name}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Học kỳ triển khải:"
          value={props.semester}
          className="pt-4 px-4"
          disabled
        />
        <TextField
          onField={true}
          label="Năm triển khải:"
          value={props.year}
          className="pt-4 px-4"
          disabled
        />
      </div>
      <div className=""></div>
    </div>
  );
}

export default TextFieldGroup;
