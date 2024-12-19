import * as React from "react";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import Badge from "@mui/material/Badge";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRoleFromToken } from "../../api/DecodeToken";
import {
  faStar,
  faBookmark,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Radio from "../../component/Radio";
import {
  getNoteByDayAPI,
  createNoteAPI,
  deleteNoteAPI,
} from "../../api/Note.js";
import { getStudentInfo } from "../../api/Student.js";
import NoteForm from "./NoteForm.jsx";

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  // Kiểm tra nếu ngày nằm trong highlightedDays
  const isSelected =
    !outsideCurrentMonth && highlightedDays.indexOf(day.date()) >= 0;

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={
        isSelected ? (
          <>
            <FontAwesomeIcon icon={faStar} className="text-[#Ffd700]" />
          </>
        ) : undefined
      }
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

export default function DateCalendarServerRequest() {
  //HIGHLIGHT NGÀY QUAN TRỌNG
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

  useEffect(() => {
    // Lọc các ngày có notetype_id = 1
    const daysToHighlight = notes
      .filter((note) => note.name_note_type === "Quan trọng ")
      .map((note) => dayjs(note.date_note).date()); // Lấy ngày trong date và chuyển thành số

    setHighlightedDays(daysToHighlight);
  }, []);

  // LẤY GIÁ TRỊ NGÀY
  const [value, setValue] = useState(dayjs().format("YYYY-MM-DD"));
  const [valueDay, setValueDay] = useState(dayjs().format("DD"));
  const [valueMonth, setValueMonth] = useState(dayjs().format("MM"));
  const [valueYear, setValueYear] = useState(dayjs().format("YYYY"));

  const handleChange = (newValue) => {
    setValue(newValue.format("YYYY-MM-DD"));
    setValueDay(newValue.format("DD"));
    setValueMonth(newValue.format("MM"));
    setValueYear(newValue.format("YYYY"));
  };

  //CALL API NOTE BY DAY,MONTH,YEAR
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (valueDay && valueMonth && valueYear) {
      getNoteByDayAPI(valueDay, valueMonth, valueYear)
        .then((response) => {
          setNotes(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch subjects:", error);
        });
    }
  }, [valueDay, valueMonth, valueYear]);
  console.log(notes);
  const [studentInfo, setStudentInfo] = useState([]);

  useEffect(() => {
    getStudentInfo()
      .then((response) => {
        setStudentInfo(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch subjects:", error);
      });
  }, []);

  // THAO TÁC CẬP NHẬT, XOÁ GHI CHÚ
  // Inside DateCalendarServerRequest component

  const [selectedNote, setSelectedNote] = useState(null);

  const handleEdit = (note) => {
    // Set the selected note for editing
    setSelectedNote(note);
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await deleteNoteAPI(noteId); // Call delete API
      toast.success("Ghi chú đã được xóa thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error("Xóa ghi chú không thành công!");
      console.error("Error deleting note:", error);
    }
  };
  return (
    <div className={`flex flex-col md:flex-row justify-between `}>
      <div className="flex flex-col md:w-5/12 w-full">
        <div className="w-full pt-4">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              defaultValue={dayjs()}
              loading={isLoading}
              slots={{
                day: ServerDay,
              }}
              slotProps={{
                day: {
                  highlightedDays, // Truyền các ngày cần làm nổi bật vào
                } as any,
              }}
              value={dayjs(value)}
              onChange={handleChange}
              style={{ width: "70%" }}
            />
          </LocalizationProvider>
        </div>
        <div className="w-full px-4">
          <div className="w-full max-h-[220px] mt-2 rounded-lg p-4 px-5 overflow-y-scroll no-scrollbar">
            {notes.map((note) => (
              <div className="w-full p-2 my-2 flex border rounded-lg shadow-sm">
                <div className="w-11/12 px-2">
                  <p className="font-medium">
                    {note.note_type_id == 2 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className="mr-2"
                          className="text-blue-500 ml-1 mr-1"
                        />
                      </>
                    ) : note.note_type_id == 1 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faStar}
                          className="mr-2"
                          className="text-[#Ffd700] mr-1"
                        />
                      </>
                    ) : (
                      " "
                    )}{" "}
                    {note.content_note}
                  </p>
                  <ul>
                    <li>
                      Thời gian: <span className="ml-1">{note.time_note}</span>
                    </li>
                    <li>
                      Địa điểm:{" "}
                      <span className="ml-2">{note.location_note}</span>
                    </li>
                  </ul>
                </div>
                <div className="w-2/12 flex items-center justify-end">
                  <div className="w-2/4">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="text-blue-500 px-2 cursor-pointer"
                      onClick={() => handleEdit(note)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="text-[#ff0000da] px-2 mt-2 cursor-pointer"
                      onClick={() => handleDelete(note.note_id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center md:w-7/12 w-full md:mt-0 mt-4">
        <NoteForm
          valueMonth={valueMonth}
          valueYear={valueYear}
          user={studentInfo}
          selectNotes={selectedNote}
        />
      </div>
    </div>
  );
}
