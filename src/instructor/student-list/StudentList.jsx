import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Table from "../../component/Table";
import Button from "../../component/Button";
import Modal from "../../component/Modal";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import TextFieldGroup from "./TextFieldGroup.jsx";
import { getStudentWithQualifiByClazzIdAPI } from "../../api/Student.js";
import { getSubjectMarkByClazzIdAPI } from "../../api/SubjectMark.js";
import { getMarkByClazzId } from "../../api/StudyResult.js";
import { getCurrentProgressAPI } from "../../api/SemesterProgress.js";
import { toast } from "react-toastify";

function StudentList() {
  const location = useLocation();
  const { item } = location.state || {};
  const navigate = useNavigate();

  // CALL API CURRENT PROGRESS
  const [currentProgress, setCurrentProgress] = useState("");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getCurrentProgressAPI();
        setCurrentProgress(response.data);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      }
    };
    fetchSchedule();
  }, []);

  const flag2 = currentProgress.currentProgress === "second-part";

  // Fetch marks list by clazz ID
  const [marksList, setMarksList] = useState([]);
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

  const [resultList, setResultList] = useState([]);
  useEffect(() => {
    if (item.clazz_id) {
      getMarkByClazzId(item.clazz_id)
        .then((data) => {
          setResultList(data);
        })
        .catch((error) => {
          console.error("Error fetching subject marks:", error);
        });
    }
  }, [item.clazz_id]);
  console.log(resultList);

  // Generate table headers dynamically
  const headers = [
    "Mã sinh viên",
    "Tên sinh viên",
    ...marksList.map((item) => item.mark_column_name),
    "Cập nhật",
  ];

  const [selectedStudent, setSelectedStudent] = useState(null);

  const openModal = (student) => setSelectedStudent(student);
  const closeModal = () => setSelectedStudent(null);

  const handleFieldChange = (field, value) => {
    setSelectedStudent((prev) => {
      const updatedStudent = { ...prev, [field]: value };

      // Update the result list to reflect the change in the selected student
      setResultList((prevList) =>
        prevList.map((student) =>
          student.id === prev.id ? { ...student, [field]: value } : student
        )
      );

      return updatedStudent; // Return updated student
    });
  };

  const renderRow = (student) => [
    <td key={`studentCode-${student.studentId}`} className="px-1 ">
      {student.studentCode}
    </td>,
    <td key={`studentFullName-${student.studentId}`} className="px-1">
      {student.studentFullName}
    </td>,
    ...marksList.map((mark) => {
      const studentMark =
        student.marks.find((m) => m.markName === mark.mark_column_name)
          ?.studentMark || 0;
      return (
        <td
          key={`mark-${mark.mark_column_name}-${student.studentId}`}
          className="px-1"
        >
          {studentMark}
        </td>
      );
    }),
    <td key={`update-${student.studentId}`} className="flex justify-center p-1">
      <div className="w-full h-full flex items-center justify-center">
        <Button
          onClick={() => openModal(student)}
          label={<FontAwesomeIcon icon={faPenToSquare} />}
          className="w-full md:w-1/2 p-4 justify-center text-white"
        />
      </div>
    </td>,
  ];

  // CALL API DATA TABLE DANH SACH SINH VIEN VÀ DIEM
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await getStudentWithQualifiByClazzIdAPI(item.clazz_id);
      setStudents(data);
    };
    fetchStudents();
  }, [item.clazz_id]);

  // Function to reload the data (trigger state change)
  const reloadData = async () => {
    try {
      // Re-fetch data for the table
      const studentsData = await getStudentWithQualifiByClazzIdAPI(
        item.clazz_id
      );
      const marksData = await getSubjectMarkByClazzIdAPI(item.clazz_id);
      const resultsData = await getMarkByClazzId(item.clazz_id);

      // Set the new data to the state
      setStudents(studentsData);
      setMarksList(marksData);
      setResultList(resultsData);
    } catch (error) {
      console.error("Error reloading data:", error);
    }
  };

  const btnEnd = [
    {
      id: 1,
      name: (
        <>
          <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
          Xếp lịch thi
        </>
      ),
      onClick: () => {
        if (flag2) {
          navigate(
            `/xep-dot-thi/${encodeURIComponent(
              item.subject_code
            )}/${encodeURIComponent(item.clazz_code)}`,
            {
              state: { item, students },
            }
          );
        } else {
          toast.error("Hiện không phải thời điểm sắp lịch thi");
        }
      },
    },
  ];

  const [className, setClassName] = useState("w-4/12 h-[620px]");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 985) {
        setClassName("w-[95%] h-[95%] overflow-auto relative");
      } else {
        setClassName("w-4/12 h-[620px]");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container>
      <TitleHeader
        title={`DANH SÁCH SINH VIÊN ${item.clazz_code} - MÔN ${item.subject_name}`}
        titleClassName="uppercase text-[1.25rem] font-medium"
      />
      <div className="min-h-[800px]">
        <Table
          DefaultTable={true}
          showOptions={true}
          showSearch={true}
          showBtnEnd={true}
          showSelectBox={true}
          btnEnd={btnEnd}
          headers={headers}
          renderRow={renderRow}
          data={resultList}
          maxRow={50}
          showTurnPage={false}
        />
        {selectedStudent && (
          <Modal
            isOpen={true}
            onClose={closeModal}
            className={className}
            label={`${selectedStudent.studentFullName} - ${selectedStudent.studentCode}`}
          >
            <div>
              <TextFieldGroup
                thisStudent={selectedStudent}
                onFieldChange={handleFieldChange}
                item={item}
                currentProgress={currentProgress}
                reloadData={reloadData}
                closeModal={closeModal}
              />
            </div>
          </Modal>
        )}
      </div>
    </Container>
  );
}

export default StudentList;
