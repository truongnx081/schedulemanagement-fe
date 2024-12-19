import React, { useState, useEffect } from "react";
import {
  getNoteByMonthAPI,
  createNoteAPI,
  updateNoteAPI,
} from "../../api/Note.js";
import { geAllNoteTypeAPI } from "../../api/NoteStyle.js";
import Button from "../../component/Button";
import TextField from "../../component/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBook,
  faCalendarPlus,
  faClock,
  faFloppyDisk,
  faBookmark,
  faLocationDot,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const NoteForm = ({ valueMonth, valueYear, user, selectNotes }) => {
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [noteTime, setNoteTime] = useState("");
  const [location, setLocation] = useState("");
  const [studentId, setStudentId] = useState(user.id); // Example student ID
  const [noteTypeId, setNoteTypeId] = useState(
    selectNotes ? selectNotes.note_type_id : 2
  );

  const [error, setError] = useState("");

  // Validate the form
  const validateForm = () => {
    if (!content) {
      setError("Sự kiện không thể trống.");
      toast.error("Sự kiện không thể trống.");
      return false;
    }
    if (!date) {
      setError("Ngày không thể trống.");
      toast.error("Ngày không thể trống.");
      return false;
    }
    if (!noteTime) {
      setError("Thời gian không thể trống.");
      toast.error("Thời gian không thể trống.");
      return false;
    }

    setError(""); // Clear previous error messages
    return true;
  };

  // Update noteTypeId and form fields if editing
  useEffect(() => {
    if (selectNotes) {
      setContent(selectNotes.content_note);
      setDate(selectNotes.date_note);
      setNoteTime(selectNotes.time_note);
      setLocation(selectNotes.location_note);
      setNoteTypeId(selectNotes.note_type_id);
    }
  }, [selectNotes]);

  // LƯU GHI CHÚ
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const noteDTO = {
      content,
      date,
      noteTime,
      location,
      studentId,
      noteTypeId,
    };

    try {
      const response = await createNoteAPI(noteDTO);

      if (response.status === 200) {
        // Clear the form if creating a new note
        if (!selectNotes) {
          setContent("");
          setDate("");
          setNoteTime("");
          setLocation("");
        }
      }
      toast.success("THÊM GHI CHÚ THÀNH CÔNG");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      setError("Failed to create note.");
      toast.error("Failed to create note. Please try again.");
      console.error("Error creating note:", error);
    }
  };

  // Call API to get notes by month
  const [notesMonth, setNotesMonth] = useState([]);
  useEffect(() => {
    if (valueMonth && valueYear) {
      getNoteByMonthAPI(valueMonth, valueYear)
        .then((response) => {
          setNotesMonth(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch subjects:", error);
        });
    }
  }, [valueMonth, valueYear]);

  // GET API note styles
  const [noteStyle, setNoteStyle] = useState([]);
  useEffect(() => {
    geAllNoteTypeAPI()
      .then((response) => {
        setNoteStyle(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch subjects:", error);
      });
  }, []);

  // CẬP NHẬT GHI CHÚ
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const noteDTO = {
      content,
      date,
      noteTime,
      location,
      studentId,
      noteTypeId,
    };

    try {
      if (selectNotes) {
        const response = await updateNoteAPI(selectNotes.note_id, noteDTO);

        toast.success("CẬP NHẬT GHI CHÚ THÀNH CÔNG");
        setContent("");
        setDate("");
        setNoteTime("");
        setLocation("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      setError("Failed to save note.");
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Error saving note:", error);
    }
  };

  //RESET GHI CHÚ
  const handleReset = (e) => {
    e.preventDefault();

    // Reset all form fields to their initial state
    setContent(""); // Reset content of the note
    setDate(""); // Reset the date field
    setNoteTime(""); // Reset the time field
    setLocation(""); // Reset the location field
    setNoteTypeId(2); // Reset note type to default (you can modify this if needed)
    setError(""); // Reset any error message
  };

  return (
    <div className="border rounded-lg h-auto pt-4 md:w-[70%] w-full md:px-8 px-4 min-h-[575px] max-h-[575px]">
      <p className="w-full justify-center flex mt-4 text-xl font-medium mb-8">
        Thêm nhắc nhở
      </p>
      <form>
        <TextField
          onField={true}
          icon={faBook}
          name="Sự kiện"
          placeholder="Tên sự kiện"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={"mb-3"}
        />
        <TextField
          type="date"
          onField={true}
          icon={faCalendarPlus}
          name="Ngày"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={"mb-3"}
        />
        <TextField
          onField={true}
          icon={faClock}
          name="Thời gian"
          type="time"
          value={noteTime}
          onChange={(e) => setNoteTime(e.target.value)}
          className={"mb-3"}
        />
        <TextField
          onField={true}
          icon={faLocationDot}
          name="Địa điểm (không bắt buộc)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={"mb-3"}
        />

        {/* Radio buttons for noteTypeId */}
        <div>
          <div className="flex">
            {noteStyle.map((item) => (
              <label
                className="h-10 w-[150px] flex items-center"
                key={item.note_type_id}
              >
                <input
                  type="radio"
                  name="noteType"
                  value={item.note_type_id}
                  checked={noteTypeId === item.note_type_id}
                  onChange={() => setNoteTypeId(item.note_type_id)}
                  className="mr-1"
                />
                <p className="-mt-1">{item.name_note_type}</p>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-center mt-4">
          {selectNotes ? (
            <>
              <Button
                label={
                  <>
                    <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" /> Cập
                    nhật
                  </>
                }
                onClick={handleUpdate}
                className="bg-blue-400 p-2 w-full justify-center text-white text-sm font-bold hover:bg-blue-500"
              />
            </>
          ) : (
            <>
              <Button
                label={
                  <>
                    <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" /> Lưu
                  </>
                }
                onClick={handleSubmit}
                className="bg-blue-400 p-2 w-full justify-center text-white text-sm font-bold hover:bg-blue-500"
              />
            </>
          )}
          <Button
            label={
              <>
                <FontAwesomeIcon icon={faRotateRight} />
              </>
            }
            onClick={handleReset}
            className="bg-blue-400 p-2 w-[50px] ml-2 justify-center text-white text-sm font-bold hover:bg-blue-500"
          />
        </div>
      </form>

      {/* {error && <div>{error}</div>} */}

      <div className="border-t border-black flex flex-col mt-8 pt-4 mb-4 py-1">
        <p className="w-full font-medium">
          SỐ LƯỢNG GHI CHÚ THÁNG {valueMonth} : {notesMonth.length}
        </p>
        <div className="pl-4">
          <p className="mt-2 pl-1">
            <FontAwesomeIcon icon={faBookmark} className="text-blue-500 mr-2" />
            Nhắc nhở:{" "}
            {notesMonth.filter((note) => note.noteType_note === 2).length}
          </p>
          <p className="mt-2">
            <FontAwesomeIcon icon={faStar} className="text-[#Ffd700] mr-2" />
            Quan trọng:{" "}
            {notesMonth.filter((note) => note.noteType_note === 1).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
