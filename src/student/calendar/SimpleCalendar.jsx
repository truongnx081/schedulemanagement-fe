import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faBookmark,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { CalendarContainer, StyledCalendar } from "./styles";
import "react-calendar/dist/Calendar.css"; // Import the styles
import { toast } from "react-toastify";
import NoteForm from "./NoteForm.jsx";
import { getStudentInfo } from "../../api/Student.js";
import {
  getAllNoteAPI,
  getNoteByDayAPI,
  deleteNoteAPI,
  getNoteByMonthAPI,
} from "../../api/Note.js";
import { format } from "date-fns";

const SimpleCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [valueDay, setValueDay] = useState(format(date, "dd"));
  const [valueMonth, setValueMonth] = useState(format(date, "MM"));
  const [valueYear, setValueYear] = useState(format(date, "yyyy"));

  const onChange = (newDate) => {
    setDate(newDate);
    setValueDay(format(newDate, "dd"));
    setValueMonth(format(newDate, "MM"));
    setValueYear(format(newDate, "yyyy"));
  };

  const onActiveStartDateChange = ({ activeStartDate }) => {
    setValueMonth(format(activeStartDate, "MM"));
    setValueYear(format(activeStartDate, "yyyy"));
  };
  console.log(valueMonth);
  // Call API to get notes by month
  const [notesAll, setNotesAll] = useState([]);
  useEffect(() => {
    getAllNoteAPI()
      .then((response) => {
        setNotesAll(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch subjects:", error);
      });
  }, []);

  console.log(notesAll);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const event = notesAll.find(
        (event) =>
          new Date(event.date_note).toDateString() === date.toDateString()
      );
      if (event) {
        return (
          <div className="tile-content">
            {event.noteType_note === 1 && (
              <FontAwesomeIcon
                icon={faStar}
                className="text-[#Ffd700] absolute top-[6px] right-[6px] "
              />
            )}
            {event.noteType_note === 1 && event.noteType_note === 2 && (
              <FontAwesomeIcon
                icon={faStar}
                className="text-[#Ffd700] absolute top-[6px] right-[6px] "
              />
            )}
            {event.noteType_note === 2 && (
              <FontAwesomeIcon
                icon={faBookmark}
                className="text-blue-500 absolute top-[6px] right-[8px]"
              />
            )}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (date.getMonth() !== new Date(valueYear, valueMonth - 1).getMonth()) {
        return "calendar-tile faded";
      }
      return "calendar-tile";
    }
    return null;
  };

  //CALL API NOTE BY DAY, MONTH, YEAR
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

  //CALL API STUDENT INFO
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
        <div className="w-full">
          <CalendarContainer>
            <StyledCalendar>
              <Calendar
                onChange={onChange}
                value={date}
                tileContent={tileContent}
                tileClassName={tileClassName}
                showFixedNumberOfWeeks
                onActiveStartDateChange={onActiveStartDateChange}
              />
            </StyledCalendar>
          </CalendarContainer>
        </div>
        <div className="w-full px-4">
          <div className="w-full max-h-[220px] rounded-lg p-4 px-5 overflow-y-scroll no-scrollbar">
            {notes.map((note) => (
              <div className="w-full p-2 my-2 flex border rounded-lg shadow-sm">
                <div className="w-11/12 px-2">
                  <p className="font-medium">
                    {note.note_type_id === 2 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className="mr-2 text-blue-500 ml-1 mr-1"
                        />
                      </>
                    ) : note.note_type_id === 1 ? (
                      <>
                        <FontAwesomeIcon
                          icon={faStar}
                          className="mr-2 text-[#Ffd700] mr-1"
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
      <div className="flex justify-center md:w-7/12 w-full md:mt-0 mt-4 pt-8">
        <NoteForm
          valueMonth={valueMonth}
          valueYear={valueYear}
          user={studentInfo}
          selectNotes={selectedNote}
        />
      </div>
    </div>
  );
};

export default SimpleCalendar;
