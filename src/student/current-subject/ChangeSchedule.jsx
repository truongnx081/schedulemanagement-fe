import Button from "../../component/Button";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getClazzesToChangeShiftBySubjectIdAndShiftAPI } from "../../api/clazzs.js";
import { handleChangeClazzAPI } from "../../api/StudyIn.js";
import { toast } from "react-toastify";

function ChangeSchedule() {
  const location = useLocation();
  const [clazzs, setsClazzs] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [item, setItem] = useState(location.state?.item);

  const shifts = [1, 2, 3, 4, 5, 6];
  // const { item } = location.state || {}; // Lấy item từ state

  // Lấy danh sách lớp học muốn đổi
  useEffect(() => {
    const fetchClasses = async () => {
      if (selectedShift && item) {
        try {
          let response = await getClazzesToChangeShiftBySubjectIdAndShiftAPI(
            item.subjectId,
            selectedShift
          );
          if (response && response.statusCode == 200) {
            setsClazzs(response.data);
          }
        } catch (error) {
          toast.error("Lấy danh sách lớp học muốn đổi không thành công!");
        }
      }
    };

    fetchClasses();
  }, [selectedShift]);

  // Đổi lịch học

  const handleChangeSchedule = async (clazz) => {
    try {
      const response = await handleChangeClazzAPI(item.classId, clazz.clazz_id);
      if (response && response.data) {
        if (response.statusCode !== 200) toast.error(response.message);
        if (response.statusCode === 200) {
          toast.success("Đổi lịch học thành công");

          let response1 = await getClazzesToChangeShiftBySubjectIdAndShiftAPI(
            item.subjectId,
            clazz.shift
          );
          if (response1 && response1.statusCode == 200) {
            setsClazzs(response1.data);
          }
          const currentClazz = {
            subjectId: item.subjectId,
            subjectCode: item.subjectCode,
            subjectName: item.subjectName,
            clazzCode: clazz.clazz_code,
            study_day: clazz.study_day,
            shift: clazz.shift,
            classId: clazz.clazz_id,
          };
          setItem(currentClazz);
        }
      }
    } catch (error) {
      console.log("lỗi:", error);
      toast.error(error.data.message);
    }
  };

  return (
    <Container>
      <TitleHeader
        className="uppercase"
        title={`ĐỔI LỊCH HỌC MÔN ${item.subjectName}`}
      />
      <div className="min-h-[700px] mt-4">
        <div
          className={`flex justify-between pr-6 flex-col-reverse md:flex-row`}
        >
          <div className="w-full mt-3 mx-4 my-2">
            <p className="font-semibold">Ca học</p>
            <div className="border rounded-lg grid grid-cols-3 gap-5 p-4">
              {shifts.map((shift) => (
                <Button
                  key={shift}
                  className={`p-3 justify-center ${
                    shift === selectedShift
                      ? "text-xs font-semibold text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-xs"
                  } `}
                  onClick={() => {
                    setSelectedShift(shift);
                  }}
                  label={`Ca ${shift}`}
                />
              ))}
            </div>
          </div>
          <div className={`w-full md:w-[40%] mx-4 my-2`}>
            <p className="font-semibold mb-1">Ca học hiện tại</p>
            <div className="border rounded-lg p-3 gap-5">
              <div className="flex py-1">
                <p className="text-sm text-gray-600">Môn: </p>{" "}
                <p className="text-sm pl-1">{item.subjectCode}</p>
              </div>
              <div className="flex pb-1">
                <p className="text-sm text-gray-600">Lớp: </p>{" "}
                <p className="text-sm pl-1">{item.clazzCode}</p>
              </div>
              <div className="flex py-1">
                <p className="text-sm text-gray-600">Ca: </p>{" "}
                <p className="text-sm pl-1">{item.shift}</p>
              </div>
              <div className="flex py-1">
                <p className="text-sm text-gray-600">Thứ: </p>{" "}
                <p className="text-sm pl-1">{item.study_day}</p>
              </div>
            </div>
          </div>
        </div>
        {selectedShift && (
          <div className="w-full mt-4">
            <div className="text-center text-sm font-semibold rounded-lg py-2 bg-blue-50">
              <p>DANH SÁCH LỚP HỌC</p>
            </div>
            <div className="flex flex-wrap">
              {clazzs
                .filter((clazz) => clazz.shift === selectedShift)
                .map((clazz) => (
                  <div className={`w-full md:w-1/3`} key={clazz.clazz_id}>
                    <div className="w-full my-4 flex justify-center">
                      <div className="p-4 border rounded-lg flex flex-wrap">
                        <div className="w-1/2 p-1 text-sm">
                          <p className="py-1">Lớp: {clazz.clazz_code}</p>
                          <p className="py-1">Phòng: {clazz.room_name}</p>
                          <p className="py-1">Số lượng SV: {clazz.amout}</p>
                        </div>
                        <div className="w-1/2 p-1 text-sm">
                          <p className="py-1">
                            Ngày bắt đầu: {clazz.start_date}
                          </p>
                          <p className="py-1">
                            Ngày học trong tuần: {clazz.study_day}
                          </p>
                          <p className="py-1">Ca: {clazz.shift}</p>
                        </div>
                        <div className="justify-center w-full p-2 flex mt-2">
                          <Button
                            className={`text-xs font-bold p-2 w-full justify-center ${
                              clazz.count_student >= 40
                                ? "bg-gray-300 "
                                : " text-white bg-blue-500 hover:bg-blue-600"
                            }`}
                            label="ĐỔI LỊCH"
                            onClick={() => handleChangeSchedule(clazz)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default ChangeSchedule;
