import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";

let listExam = [];

function DragDrop({
  numberBoard = [],
  initialStudents,
  showOptions = false,
  showSearchItem = false,
  showRandomBtn = false,
  showOtherBtn = false,
  otherBtns = [],
  clazz,
}) {
  // const [dropZones, setDropZones] = useState([]);
  // const [students, setStudents] = useState(initialStudents);
  // const [list, setList] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [canDragDrop, setCanDragDrop] = useState(true);

  // console.log("initialStudents take value from studentListAPI");
  // console.log(students);

  // useEffect(() => {
  //   setDropZones(
  //     numberBoard.map((number, index) => ({ id: index + 1, students: [] }))
  //   );
  // }, [numberBoard]);

  // useEffect(() => {
  //   const combinedDataBase = dropZones
  //     .map(
  //       (dz) =>
  //         `id:${dz.id},students:${JSON.stringify(
  //           dz.students.map((student) => student.studentId)
  //         )}`
  //     )
  //     .join(";");
  //   setList(combinedDataBase);
  // }, [dropZones]);

  // listExam = list;

  // // Handle drag start
  // const onDragStart = (event, student, fromDropZone) => {
  //   if (!canDragDrop || !student.condition) return;
  //   event.dataTransfer.setData(
  //     "student",
  //     JSON.stringify({ student, fromDropZone })
  //   );
  //   event.target.style.opacity = "0.4";
  //   event.target.style.background = "rgba(65,128,238,0.7)";
  //   event.target.style.color = "white";
  //   event.target.style.border = "3px solid blue";
  // };

  // const onDragEnd = (event) => {
  //   event.target.style.opacity = "1";
  //   event.target.style.background = "transparent";
  //   event.target.style.color = "black";
  //   event.target.style.border = "1px solid rgba(0,0,0,0.1)";
  // };

  // const onDragEnter = (event) => {
  //   if (event.target.classList.contains("droptarget")) {
  //     event.target.style.border = "3px solid rgba(65,128,238,0.5)";
  //   }
  // };

  // const onDragOver = (event) => {
  //   if (!canDragDrop) return;
  //   event.preventDefault();
  // };

  // const onDragLeave = (event) => {
  //   if (event.target.classList.contains("droptarget")) {
  //     event.target.style.border = "";
  //   }
  // };

  // const onDrop = (event, dropZoneId) => {
  //   if (!canDragDrop) return;
  //   event.preventDefault();
  //   if (event.target.classList.contains("droptarget")) {
  //     const { student, fromDropZone } = JSON.parse(
  //       event.dataTransfer.getData("student")
  //     );

  //     if (fromDropZone === null) {
  //       setStudents((prevStudents) =>
  //         prevStudents.filter((s) => s.studentId !== student.studentId)
  //       );
  //     }

  //     if (dropZoneId === null) {
  //       setStudents((prevStudents) => [...prevStudents, student]);
  //     }

  //     setDropZones((prevDropZones) =>
  //       prevDropZones.map((dz) => {
  //         if (dz.id === dropZoneId) {
  //           return { ...dz, students: [...dz.students, student] };
  //         } else if (dz.id === fromDropZone) {
  //           return {
  //             ...dz,
  //             students: dz.students.filter(
  //               (s) => s.studentId !== student.studentId
  //             ),
  //           };
  //         }
  //         return dz;
  //       })
  //     );
  //   }
  // };

  // const shuffleStudents = () => {
  //   const studentsWithCondition = [
  //     ...students.filter((student) => student.condition),
  //     ...dropZones.flatMap((dz) =>
  //       dz.students.filter((student) => student.condition)
  //     ),
  //   ];
  //   const studentsWithoutCondition = [
  //     ...students.filter((student) => !student.condition),
  //     ...dropZones.flatMap((dz) =>
  //       dz.students.filter((student) => !student.condition)
  //     ),
  //   ];

  //   const shuffledStudents = studentsWithCondition.sort(
  //     () => 0.5 - Math.random()
  //   );

  //   const newDropZones = dropZones.map((dz) => ({ ...dz, students: [] }));
  //   shuffledStudents.forEach((student, index) => {
  //     const dropZoneIndex = index % newDropZones.length;
  //     newDropZones[dropZoneIndex].students.push(student);
  //   });

  //   studentsWithoutCondition.forEach((student) => {
  //     if (student.dropZoneId) {
  //       const dropZone = newDropZones.find(
  //         (dz) => dz.id === student.dropZoneId
  //       );
  //       if (dropZone) {
  //         dropZone.students.push(student);
  //       }
  //     } else {
  //       setStudents((prevStudents) => [...prevStudents, student]);
  //     }
  //   });

  //   setDropZones(newDropZones);
  //   setStudents(
  //     studentsWithoutCondition.filter((student) => !student.dropZoneId)
  //   );
  // };

  // const disableShuffle = dropZones.some((dz) => dz.students.length > 0);

  // const filterStudents = (students) => {
  //   return students.filter(
  //     (student) =>
  //       student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // };

  const [dropZones, setDropZones] = useState([]);
  const [students, setStudents] = useState(initialStudents);
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [canDragDrop, setCanDragDrop] = useState(true);
  console.log("initialStudents take value from studentListAPI");
  console.log(students);
  useEffect(() => {
    setDropZones(
      numberBoard.map((number, index) => ({ id: index + 1, students: [] }))
    );
  }, [numberBoard]);

  // useEffect(() => {
  //   const combinedDataBase = dropZones
  //     .map(
  //       (dz) =>
  //         `id:${dz.id},students:${JSON.stringify(
  //           dz.students.map((student) => student.student_id)
  //         )}`
  //     )
  //     .join(";");
  //   setList(combinedDataBase);
  // }, [dropZones]);

  // useEffect(() => {
  //   const combinedDataBase = dropZones
  //     .flatMap((dz) =>
  //       dz.students.map((student) => ({
  //         clazz_id: dz.id, // Add the dropZone id as clazz_id
  //         student_id: student.student_id,
  //         batch: student.batch, // Assuming `batch` is a property of the student object
  //       }))
  //     )
  //     .join(";");

  //   setList(combinedDataBase); // Set the list for display or further processing
  // }, [dropZones]);

  useEffect(() => {
    const combinedDataBase = dropZones
      .flatMap((dz) =>
        dz.students.map((student) => ({
          clazz_id: clazz.clazz_id, // The dropZone id as clazz_id
          student_id: student.student_id,
          batch: dz.id, // Set batch as the id (which corresponds to index + 1)
        }))
      )
      .map((item) => JSON.stringify(item)) // Convert each object to a JSON string
      .join(";"); // Now join them as a string with semicolons

    setList(combinedDataBase); // Set the list for display or further processing
    console.log(combinedDataBase); // Check the output
  }, [dropZones]);

  console.log(list);

  listExam = list; // Handle drag start
  const onDragStart = (event, student, fromDropZone) => {
    if (!canDragDrop || !student.qualify) return;
    event.dataTransfer.setData(
      "student",
      JSON.stringify({ student, fromDropZone })
    );
    event.target.style.opacity = "0.4";
    event.target.style.background = "rgba(65,128,238,0.7)";
    event.target.style.color = "white";
    event.target.style.border = "3px solid blue";
  };
  const onDragEnd = (event) => {
    event.target.style.opacity = "1";
    event.target.style.background = "transparent";
    event.target.style.color = "black";
    event.target.style.border = "1px solid rgba(0,0,0,0.1)";
  };
  const onDragEnter = (event) => {
    if (event.target.classList.contains("droptarget")) {
      event.target.style.border = "3px solid rgba(65,128,238,0.5)";
    }
  };
  const onDragOver = (event) => {
    if (!canDragDrop) return;
    event.preventDefault();
  };
  const onDragLeave = (event) => {
    if (event.target.classList.contains("droptarget")) {
      event.target.style.border = "";
    }
  };
  const onDrop = (event, dropZoneId) => {
    if (!canDragDrop) return;
    event.preventDefault();
    if (event.target.classList.contains("droptarget")) {
      const { student, fromDropZone } = JSON.parse(
        event.dataTransfer.getData("student")
      );
      if (fromDropZone === null) {
        setStudents((prevStudents) =>
          prevStudents.filter((s) => s.student_id !== student.student_id)
        );
      }
      if (dropZoneId === null) {
        setStudents((prevStudents) => [...prevStudents, student]);
      }
      setDropZones((prevDropZones) =>
        prevDropZones.map((dz) => {
          if (dz.id === dropZoneId) {
            return { ...dz, students: [...dz.students, student] };
          } else if (dz.id === fromDropZone) {
            return {
              ...dz,
              students: dz.students.filter(
                (s) => s.student_id !== student.student_id
              ),
            };
          }
          return dz;
        })
      );
    }
  };
  const shuffleStudents = () => {
    const studentsWithQualify = [
      ...students.filter((student) => student.qualify),
      ...dropZones.flatMap((dz) =>
        dz.students.filter((student) => student.qualify)
      ),
    ];
    const studentsWithoutQualify = [
      ...students.filter((student) => !student.qualify),
      ...dropZones.flatMap((dz) =>
        dz.students.filter((student) => !student.qualify)
      ),
    ];
    const shuffledStudents = studentsWithQualify.sort(
      () => 0.5 - Math.random()
    );
    const newDropZones = dropZones.map((dz) => ({ ...dz, students: [] }));
    shuffledStudents.forEach((student, index) => {
      const dropZoneIndex = index % newDropZones.length;
      newDropZones[dropZoneIndex].students.push(student);
    });
    studentsWithoutQualify.forEach((student) => {
      if (student.dropZoneId) {
        const dropZone = newDropZones.find(
          (dz) => dz.id === student.dropZoneId
        );
        if (dropZone) {
          dropZone.students.push(student);
        }
      } else {
        setStudents((prevStudents) => [...prevStudents, student]);
      }
    });
    setDropZones(newDropZones);
    setStudents(
      studentsWithoutQualify.filter((student) => !student.dropZoneId)
    );
  };
  const disableShuffle = dropZones.some((dz) => dz.students.length > 0);
  const filterStudents = (students) => {
    return students.filter(
      (student) =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  return (
    <div className="flex flex-col justify-between h-[calc(100%-32px)]">
      {showOptions && (
        <div className="flex flex-col md:flex-row items-center justify-between my-2">
          {showOtherBtn && (
            <div className="md:w-4/12 w-full flex my-2 md:mr-2 mr-0 justify-start">
              {otherBtns.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className="w-[150px] h-[40px] border rounded-md transition-all bg-blue-500 text-white justify-center"
                  disabled={button.disabled}
                >
                  {button.name}
                </button>
              ))}
            </div>
          )}
          {showSearchItem && (
            <div className="md:w-4/12 w-full my-2 mx-2">
              <div className="relative">
                <div className="absolute top-3 left-0 flex items-center pl-3.5 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-[#808EA1]"
                  />
                </div>
                <input
                  id="search"
                  className="border text-gray-900 text-sm rounded-lg w-full pl-10 p-2.5 focus:outline-none"
                  name="search"
                  aria-label="Search Bar"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}
          {showRandomBtn && (
            <div className="md:w-4/12 w-full my-2 mx-2 flex justify-end">
              <button
                onClick={shuffleStudents}
                disabled={disableShuffle}
                className={`w-[150px] h-[40px] border rounded-md transition-all bg-blue-500 text-white justify-center ${
                  disableShuffle ? "bg-gray-500" : "bg-blue-500"
                }`}
              >
                <FontAwesomeIcon icon={faShuffle} className="mr-2" />
                Random
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between h-full">
        {dropZones.map((dropZone) => (
          <div key={dropZone.id} className="w-1/5 h-[650px]">
            <div className="w-full text-center h-8 flex items-center justify-center border-blue-300 bg-blue-300 text-white">
              <label>Đợt {dropZone.id}</label>
            </div>
            <div
              className="droptarget p-2 px-4 pb-[120px] border-l border-r border-b rounded-b-md border-blue-300 overflow-y-scroll no-scrollbar"
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, dropZone.id)}
              data-base={`id:${dropZone.id},students:${JSON.stringify(
                dropZone.students.map((student) => student.student_id)
              )}`}
              style={{ height: "calc(100% - 30px)" }}
            >
              {filterStudents(dropZone.students).map((student) => (
                <div
                  key={student.student_id}
                  id={`dragtarget-${student.student_id}`}
                  draggable="true"
                  onDragStart={(e) => onDragStart(e, student, dropZone.id)}
                  onDragEnd={onDragEnd}
                  className="cursor-move border w-full mb-1 rounded-md p-1 text-sm"
                >
                  <p>Tên: {student.full_name}</p>
                  <p>Code: {student.code}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="w-1/3 h-[650px]">
          <div
            className="droptarget w-full h-full border-blue-300 p-2 px-4 pb-[120px] border rounded-b-md overflow-y-scroll no-scrollbar"
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, null)}
          >
            {filterStudents(students).map((student) => (
              <div
                key={student.student_id}
                id={`dragtarget-${student.student_id}`}
                draggable={canDragDrop && student.qualify}
                onDragStart={(e) => onDragStart(e, student, null)}
                onDragEnd={onDragEnd}
                className={`cursor-move border w-full mb-1 rounded-md p-1 relative ${
                  student.qualify
                    ? "hover:bg-blue-200"
                    : "bg-gray-200 cursor-not-allowed"
                } transition ease-in-out 0.2s`}
              >
                <p>Tên: {student.full_name}</p>
                <p>Code: {student.code}</p>
                <p className="absolute bottom-2 right-2 text-sm text-red-700">
                  {student.absent != 0 ? `Nghỉ: ${student.absent}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { listExam };
export default DragDrop;
