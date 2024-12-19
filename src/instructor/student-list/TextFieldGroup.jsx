import React, { useState, useEffect, useRef } from "react";
import TextField from "../../component/TextField";
import Button from "../../component/Button";
import { getSubjectMarkByClazzIdAPI } from "../../api/SubjectMark.js";
import { updateMarkForStudentAPI } from "../../api/StudyResult.js";
import { toast } from "react-toastify";

function TextFieldGroup({
  thisStudent,
  onFieldChange,
  item,
  currentProgress,
  reloadData,
  closeModal,
}) {
  const [marksList, setMarksList] = useState([]);
  const [localMarks, setLocalMarks] = useState(thisStudent.marks || []); // Cập nhật state để lưu trữ điểm
  const inputRefs = useRef({}); // Store refs for each input

  useEffect(() => {
    if (item.clazz_id) {
      getSubjectMarkByClazzIdAPI(item.clazz_id)
        .then((data) => {
          setMarksList(data);
        })
        .catch((error) => {
          console.error("Error fetching subject marks:", error);
        });
    }
  }, [item.clazz_id]);

  const handleChange = (markName) => (event) => {
    let value = event.target.value;

    // Convert the value to a number (in case the user types non-numeric characters)
    value = parseFloat(value);

    // Check if the value exceeds the max value (10)
    if (value > 10) {
      value = 10; // Set value to 10 if it exceeds the max
    }

    // Cập nhật giá trị điểm trong localMarks (state cục bộ)
    const updatedMarks = localMarks.map((mark) => {
      if (mark.markName === markName) {
        return { ...mark, studentMark: value }; // Cập nhật điểm
      }
      return mark;
    });

    // Cập nhật lại state localMarks
    setLocalMarks(updatedMarks);
  };

  const flag1 = currentProgress.currentProgress === "first-part";
  const flag2 = currentProgress.currentProgress === "second-part";

  const saveMarks = async () => {
    const updatedMarks = marksList.map((mark) => ({
      marked:
        localMarks.find((m) => m.markName === mark.mark_column_name)
          ?.studentMark ?? 0,
      markColumnId: mark.mark_column_id,
      percentage: mark.percentage,
    }));

    try {
      const data = await updateMarkForStudentAPI(
        thisStudent.studentId,
        item.clazz_id,
        updatedMarks
      );
      toast.success(
        "Cập nhật điểm " + thisStudent.studentFullName + " thành công"
      );

      // Call reloadData to refresh the table
      reloadData();
      closeModal();
    } catch (error) {
      console.error("Error updating marks:", error);
      toast.error("Error updating marks.");
    }
  };

  const getStudentMark = (markName) => {
    const mark = localMarks.find((m) => m.markName === markName);
    return mark ? mark.studentMark : 0;
  };

  // Handle the focus event to select the input text
  const handleFocus = (markName) => {
    const input = inputRefs.current[markName];
    if (input) {
      input.select(); // Select the content of the input when it is focused
    }
  };

  return (
    <>
      <div className="w-full flex flex-col mt-1 py-5 min-h-[400px] max-h-[400px] overflow-y-scroll no-scrollbar">
        {marksList.map((mark) => (
          <TextField
            key={mark.mark_column_name}
            type="number"
            min={1}
            max={10}
            onField={true}
            label={mark.mark_column_name}
            value={getStudentMark(mark.mark_column_name)} // Lấy giá trị từ localMarks (state cục bộ)
            className="pt-4 px-4"
            onChange={handleChange(mark.mark_column_name)} // Cập nhật giá trị khi thay đổi
            onFocus={() => handleFocus(mark.mark_column_name)} // Automatically select the text when the input is clicked
            inputRef={(ref) => (inputRefs.current[mark.mark_column_name] = ref)} // Attach the ref for each input field
            disabled={
              mark.part === 1 ? !flag1 : mark.part === 2 ? !flag2 : false
            }
          />
        ))}
      </div>
      <div className="w-full flex md:flex-row flex-col border-t mt-5 py-5">
        <div className="w-full flex items-end justify-end md:pr-4 md:pt-0 pt-6 pl-4 pr-4">
          <Button
            label="LƯU"
            onClick={saveMarks}
            className="text-white md:w-[150px] w-full h-10 p-1 justify-center"
          />
        </div>
      </div>
    </>
  );
}

export default TextFieldGroup;
