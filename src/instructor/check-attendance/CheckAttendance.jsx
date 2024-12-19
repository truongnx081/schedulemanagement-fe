import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "../../component/Table";
import Button from "../../component/Button";
import "./checkAttendance.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { getAllStudentbyClazzId } from "../../api/Student";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import {
  markAttendance,
  getAttendanceByClazzId,
  updateAttendance,
  getStudentForAttendanceOfReatkeScheduleByClazzIdAndRetakeScheduleId,
  doAttendanceForRetake,
} from "../../api/Attendance.js";
import avatar from "../../images/avatarUser.jpg";
import { toast } from "react-toastify";

function CheckAttendance() {
  const location = useLocation();
  const { item } = location.state || {};
  console.log(item);
  const headers = ["Mã sinh viên", "Tên sinh viên", "Avatar", "Điểm danh"];
  const baseUrl =
    "https://res.cloudinary.com/dc06mgef2/image/upload/v1731903390/";

  // State for student list and attendance status
  const [studentList, setStudentList] = useState([]);
  const [listNull, setListNull] = useState(false);
  const [listNotNull, setListNotNull] = useState(true);

  // get danh sách khi đã có dữ liệu attenced
  useEffect(() => {
    if (
      item &&
      item.clazzId &&
      item.scheduleId &&
      item.retakescheduleId == null
    ) {
      getAttendanceByClazzId(item.clazzId, item.scheduleId)
        .then((data) => {
          if (data && data.length > 0) {
            const initializedData = data.map((student) => ({
              ...student,
              presentable: true,
            }));
            setStudentList(initializedData);
            console.log("lấy danh sách diem danh thành công");
          } else {
            setListNull(true);
            setListNotNull(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching attendance:", error);
          setListNull(true);
        });
    }
  }, [item]);

  // get danh sách khi đã có dữ liệu attenced
  useEffect(() => {
    if (
      item &&
      item.clazzId &&
      item.scheduleId &&
      item.retakescheduleId != null
    ) {
      getStudentForAttendanceOfReatkeScheduleByClazzIdAndRetakeScheduleId(
        item.clazzId,
        item.retakescheduleId
      )
        .then((data) => {
          if (data && data.length > 0) {
            const initializedData = data.map((student) => ({
              ...student,
            }));
            setStudentList(initializedData);
            console.log("lấy danh sách diem danh retake thành công");
          } else {
            setListNull(true);
            setListNotNull(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching retake attendance:", error);
          setListNull(true);
        });
    }
  }, [item]);
  console.log(studentList);

  //get dữ liệu khi chưa có dữ liệu trong attencedance
  useEffect(() => {
    if (listNull && item && item.clazzId) {
      getAllStudentbyClazzId(item.clazzId)
        .then((data) => {
          const initializedData = data.map((student) => ({
            ...student,
            present: false,
            presentable: true,
          }));
          setStudentList(initializedData);
          console.log("Lay danh sach diem danh []");
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });
    }
  }, [listNull, item]);

  // Handle checkbox toggle
  const handleToggle = (id) => {
    setStudentList((prevStudents) =>
      prevStudents.map((student) => {
        if (student.studentId === id) {
          return { ...student, present: !student.present };
        }
        return student;
      })
    );
  };

  console.log(studentList);
  // Table row rendering function
  const renderRow = (item) => [
    <td key={`item-code-${item.studentId}`} className="p-2 text-lg font-medium">
      {item.studentCode}
    </td>,
    <td key={`item-name-${item.studentId}`} className="p-2 text-lg font-medium">
      {item.studentName || item.fullName}
    </td>,
    <td
      key={`item-avatar-${item.studentId}`}
      className="p-2 px-0 flex items-center justify-center"
    >
      <img
        className="w-[150px] object-cover"
        src={item ? (item.avatar ? baseUrl + item.avatar : avatar) : avatar}
        alt={item.studentName || item.fullName}
      />
    </td>,
    <td key={`item-attendance-${item.studentId}`} className="">
      <div className="flex items-center justify-center min-h-[50px]">
        <div className="relative inline-block w-[80px] mr-2 align-middle select-none">
          <input
            type="checkbox"
            name="toggle"
            id={`item-present-${item.studentId}`}
            className="toggle-checkbox absolute block w-9 h-9 rounded-full bg-white border-4 appearance-none cursor-pointer"
            checked={item.present}
            onChange={() => handleToggle(item.studentId)}
            disabled={!item.presentable}
          />
          <label
            htmlFor={`toggle-${item.studentId}`}
            className="toggle-label block overflow-hidden h-9 rounded-full bg-red-500 cursor-pointer"
          ></label>
        </div>
      </div>
    </td>,
  ];

  // Handle attendance submission
  const handleMarkAttendance = () => {
    const attendanceList = studentList.map((student) => ({
      studentId: student.studentId,
      scheduleId: item.scheduleId,
      present: student.present,
    }));

    console.log("Payload to be sent:", attendanceList);

    markAttendance(attendanceList)
      .then((response) => {
        console.log("Attendance marked successfully:", response);
        toast.success("LƯU ĐIỂM DANH THÀNH CÔNG");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      })
      .catch((error) => {
        console.error("Error marking attendance:", error);
        toast.error(error.response ? error.response.data : error);
      });
  };

  const handleUpdateAttendance = () => {
    const attendanceList = studentList.map((student) => ({
      studentId: student.studentId,
      scheduleId: item.scheduleId,
      present: student.present || false,
    }));
    console.log("Payload to be sent:", attendanceList);

    updateAttendance(attendanceList)
      .then((response) => {
        console.log("Attendance updated successfully:", response);
        toast.success("LƯU ĐIỂM DANH THÀNH CÔNG");
      })
      .catch((error) => {
        console.error("Error updating attendance:", error);
        toast.error(error.response ? error.response.data : error);
      });
  };

  const handledoAttendanceforRetake = () => {
    const attendanceList = studentList.map((student) => ({
      studentId: student.studentId,
      retakeScheduleId: item.retakescheduleId,
      present: student.present,
    }));

    console.log("Payload to be sent:", attendanceList);

    doAttendanceForRetake(attendanceList)
      .then((response) => {
        console.log("Attendance marked successfully:", response);
        toast.success("LƯU ĐIỂM DANH THÀNH CÔNG");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      })
      .catch((error) => {
        console.error(
          "Error marking attendance:",
          error.response ? error.response.data : error
        );
        toast.error(error.response ? error.response.data : error);
      });
  };

  return (
    <Container>
      <TitleHeader title={`DANH SÁCH ĐIỂM DANH LỚP ${item.code}`} />
      <div className="min-h-[600px]">
        <Table
          DefaultTable={true}
          showOptions={true}
          showSearch={true}
          showSelectBox={true}
          showBtnEnd={true}
          headers={headers}
          renderRow={renderRow}
          data={studentList}
          maxRow={100}
          showTurnPage={false}
        />
        <div className="flex justify-end">
          {listNull && (
            <>
              <Button
                label={
                  <>
                    <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" /> Lưu
                  </>
                }
                className="w-full md:w-[150px] mr-0 md:mr-[60px] bg-blue-400 h-10 p-1 text-white flex justify-center font-medium mt-4"
                onClick={handleMarkAttendance}
              />
            </>
          )}
          {listNotNull && item.retakescheduleId == null && (
            <>
              <Button
                label={
                  <>
                    <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                    Lưu
                  </>
                }
                className="w-full md:w-[150px] mr-0 md:mr-[60px] bg-blue-400 h-10 p-1 text-white flex justify-center font-medium mt-4"
                onClick={handleUpdateAttendance}
              />
            </>
          )}
          {listNotNull && item.retakescheduleId != null && (
            <>
              <Button
                label={
                  <>
                    <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
                    Lưu
                  </>
                }
                className="w-full md:w-[150px] mr-0 md:mr-[60px] bg-blue-400 h-10 p-1 text-white flex justify-center font-medium mt-4"
                onClick={handledoAttendanceforRetake}
              />
            </>
          )}
        </div>
      </div>
    </Container>
  );
}

export default CheckAttendance;

// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import Table from "../../component/Table";
// import Button from "../../component/Button";
// import "./checkAttendance.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFloppyDisk, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
// import { getAllStudentbyClazzId } from "../../api/Student";
// import Container from "../../component/Container.tsx";
// import TitleHeader from "../../component/TitleHeader.tsx";
// import {
//   markAttendance,
//   getAttendanceByClazzId,
//   updateAttendance,
//   getStudentForAttendanceOfReatkeScheduleByClazzIdAndRetakeScheduleId,
// } from "../../api/Attendance.js";
// import avatar from "../../images/avatarUser.jpg";
// import { toast } from "react-toastify";

// const studentNotLearn = [
//   {
//     avatar: "student1.png",
//     present: true,
//     studentCode: "PS27619",
//     studentEmail: "phatlvps274562@fpt.edu.vn",
//     studentId: 1,
//     studentName: "Nguyễn Trung Hiếu",
//   },
//   {
//     avatar: "student4.png",
//     present: true,
//     studentCode: "PS27837",
//     studentEmail: "hocntps27837@fpt.edu.vn",
//     studentId: 4,
//     studentName: "Nguyễn Tiến Học",
//   },
// ];

// function CheckAttendance() {
//   const location = useLocation();
//   const { item } = location.state || {};
//   console.log(item);
//   const headers = ["Mã sinh viên", "Tên sinh viên", "Avatar", "Điểm danh"];
//   const baseUrl =
//     "https://res.cloudinary.com/dc06mgef2/image/upload/v1731903390/";

//   // State for student list and attendance status
//   const [studentList, setStudentList] = useState([]);
//   const [listNull, setListNull] = useState(false);
//   const [listNotNull, setListNotNull] = useState(true);

//   // get danh sách khi đã có dữ liệu attenced
//   useEffect(() => {
//     if (item && item.clazzId && item.scheduleId) {
//       getAttendanceByClazzId(item.clazzId, item.scheduleId)
//         .then((data) => {
//           if (data && data.length > 0) {
//             const initializedData = data.map((student) => ({
//               ...student,
//               present: student.present,
//             }));
//             setStudentList(initializedData);
//           } else {
//             setListNull(true);
//             setListNotNull(false);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching attendance:", error);
//           setListNull(true);
//         });
//     }
//   }, [item]);

//   //get dữ liệu khi chưa có dữ liệu trong attencedance
//   useEffect(() => {
//     if (listNull && item && item.clazzId) {
//       getAllStudentbyClazzId(item.clazzId)
//         .then((data) => {
//           const initializedData = data.map((student) => ({
//             ...student,
//             present: false,
//           }));
//           setStudentList(initializedData);
//           console.log(studentList);
//         })
//         .catch((error) => {
//           console.error("Error fetching students:", error);
//         });
//     }
//   }, [listNull, item]);

//   // Handle checkbox toggle
//   const handleToggle = (id) => {
//     setStudentList((prevStudents) =>
//       prevStudents.map((student) => {
//         if (student.studentId === id) {
//           return { ...student, present: !student.present };
//         }
//         return student;
//       })
//     );
//   };

//   console.log(studentList);
//   // Table row rendering function
//   const renderRow = (item) => {
//     const isInNotLearn = studentNotLearn.some(
//       (student) => student.studentId === item.studentId
//     );
//     const matchingStudent = studentNotLearn.find(
//       (student) => student.studentId === item.studentId
//     );
//     const present = matchingStudent
//       ? matchingStudent.present
//       : item.present;

//     return [
//       <td
//         key={`item-code-${item.studentId}`}
//         className="p-2 text-lg font-medium"
//       >
//         {item.studentCode}
//       </td>,
//       <td
//         key={`item-name-${item.studentId}`}
//         className="p-2 text-lg font-medium"
//       >
//         {item.studentName || item.fullName}
//       </td>,
//       <td
//         key={`item-avatar-${item.studentId}`}
//         className="p-2 px-0 flex items-center justify-center"
//       >
//         <img
//           className="w-[150px] object-cover"
//           src={item ? (item.avatar ? baseUrl + item.avatar : avatar) : avatar}
//           alt={item.studentName || item.fullName}
//         />
//       </td>,
//       <td key={`item-attendance-${item.studentId}`} className="">
//         <div className="flex items-center justify-center min-h-[50px]">
//           <div className="relative inline-block w-[80px] mr-2 align-middle select-none">
//             <input
//               type="checkbox"
//               name="toggle"
//               id={`item-present-${item.studentId}`}
//               className="toggle-checkbox absolute block w-9 h-9 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               checked={present}
//               onChange={() => handleToggle(item.studentId)}
//               disabled={isInNotLearn ? true : false} // Disable the checkbox if the student is not in studentNotLearn
//             />
//             <label
//               htmlFor={`toggle-${item.studentId}`}
//               className="toggle-label block overflow-hidden h-9 rounded-full bg-red-500 cursor-pointer"
//             ></label>
//           </div>
//         </div>
//       </td>,
//     ];
//   };

//   // Handle attendance submission
//   const handleMarkAttendance = () => {
//     const attendanceList = studentList.map((student) => ({
//       studentId: student.studentId,
//       scheduleId: item.scheduleId,
//       present: student.present,
//     }));

//     console.log("Payload to be sent:", attendanceList);

//     markAttendance(attendanceList)
//       .then((response) => {
//         console.log("Attendance marked successfully:", response);
//         toast.success("LƯU THÀNH CÔNG");
//         setTimeout(() => {
//           window.location.reload();
//         }, 1500);
//       })
//       .catch((error) => {
//         console.error("Error marking attendance:", error);
//         toast.error("LƯU THẤT BẠI");
//       });
//   };

//   const handleUpdateAttendance = () => {
//     const attendanceList = studentList.map((student) => ({
//       studentId: student.studentId,
//       scheduleId: item.scheduleId,
//       present: student.present,
//     }));
//     console.log("Payload to be sent:", attendanceList);

//     updateAttendance(attendanceList)
//       .then((response) => {
//         console.log("Attendance updated successfully:", response);
//         toast.success("CẬP NHẬT THÀNH CÔNG");
//       })
//       .catch((error) => {
//         console.error("Error updating attendance:", error);
//         toast.error("CẬP NHẬT THẤT BẠI");
//       });
//   };

//   return (
//     <Container>
//       <TitleHeader
//         title={`Danh sách lớp id:${item.clazzId} - ${item.code} -${item.scheduleId}`}
//       />
//       <div className="min-h-[600px]">
//         <Table
//           DefaultTable={true}
//           showOptions={true}
//           showSearch={true}
//           showSelectBox={true}
//           showBtnEnd={true}
//           headers={headers}
//           renderRow={renderRow}
//           data={studentList}
//           maxRow={100}
//           showTurnPage={false}
//         />
//         <div className="flex justify-end">
//           {listNull && (
//             <>
//               <Button
//                 label={
//                   <>
//                     <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" /> Lưu
//                   </>
//                 }
//                 className="w-full md:w-[150px] mr-0 md:mr-[60px] bg-blue-400 h-10 p-1 text-white flex justify-center font-medium mt-4"
//                 onClick={handleMarkAttendance}
//               />
//             </>
//           )}
//           {listNotNull && (
//             <>
//               <Button
//                 label={
//                   <>
//                     <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
//                     Cập nhật
//                   </>
//                 }
//                 className="w-full md:w-[150px] mr-0 md:mr-[60px] bg-blue-400 h-10 p-1 text-white flex justify-center font-medium mt-4"
//                 onClick={handleUpdateAttendance}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </Container>
//   );
// }

// export default CheckAttendance;
