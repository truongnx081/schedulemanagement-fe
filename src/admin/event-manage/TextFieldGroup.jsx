import TextField from "../../component/TextField";
import { areaOption } from "./DataSelect";
import SelectBox from "../../component/SelectBox";
import TextArea from "../../component/TextArea";

function TextFieldGroup({ ...props }) {
  const baseUrl =
    "https://res.cloudinary.com/dc06mgef2/image/upload/v1734324086/";

  return (
    <div className="flex">
      <div className="w-2/4">
        <div className="w-full p-1 mt-4 flex flex-col items-center">
          <label className="w-full cursor-pointer">
            <div className="w-full h-52 border-dashed border-2 border-gray-300 flex items-center justify-center">
              {props.image ? (
                <img
                  src={baseUrl + props.image}
                  alt="Preview"
                  className="w-full h-full object-fill "
                />
              ) : (
                <div className="w-800 h-600 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Hình [600 x 700]</span>
                </div>
              )}
            </div>
          </label>
        </div>
        <TextArea
          label="Tên sự kiện:"
          className="pt-4 px-4 mt-14"
          disabled
          value={props.name}
        />
      </div>
      <div className="w-2/4">
        <SelectBox
          options={props.area ? props.area : areaOption}
          name="Khu vực:"
          nameSelect="Khu vực"
          disable
          className="mt-4 px-4"
          value={props.areaId}
        />
        <TextField
          onField={true}
          label="Ngày tổ chức:"
          value={props.date}
          className="mt-2 px-4"
          disabled
        />
        <TextArea
          label="Địa điểm tổ chức:"
          placeholder="Địa điểm tổ chức"
          className="mt-2 px-4"
          disabled
          value={props.place}
        />
        <TextArea
          label="Nội dung sự kiện:"
          placeholder="Nội dung sự kiện"
          className="px-4"
          disabled
          value={props.content}
        />
      </div>
    </div>
  );
}

export default TextFieldGroup;
