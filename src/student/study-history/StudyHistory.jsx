import Table from "../../component/Table";
import React, { useState, useEffect } from "react";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getAllStudyResult,getStudyHistoryByStudentIdAPI } from "../../api/StudyResult.js";
function StudyHistory() {
  const headers = [
    "Lớp",
    "Mã môn",
    "Tên môn",
    "Tín chỉ",
    "Block",
    "Kỳ",
    "Năm",
    "Trung bình",
    "Kết Quả",
    "Trạng thái",
  ];

  const header1s = [
    "Lớp",
    "Mã môn",
    "Tín chỉ",
    "Trung bình",
    "Kết Quả",
    "Trạng thái",
  ];

  const renderRow = (item) => [
    <td key={`item-clazzCode-${item.id}`} className="px-6 py-4">
      {item.clazz_code}
    </td>,
    <td key={`item-subjectCode-${item.id}`} className="px-6 py-4">
      {item.subject_code}
    </td>,
    <td key={`item-subjectName-${item.id}`} className="px-6 py-4">
      {item.subject_name}
    </td>,
    <td key={`item-credits-${item.id}`} className="px-6 py-4">
      {item.credits}
    </td>,
    <td key={`item-block-${item.id}`} className="px-6 py-4">
      {item.block}
    </td>,
    <td key={`item-semester-${item.id}`} className="px-6 py-4">
      {item.semester}
    </td>,
    <td key={`item-year-${item.id}`} className="px-6 py-4">
      {item.year}
    </td>,
    <td key={`item-average_mark-${item.id}`} className="px-6 py-4">
      {item.average_mark == null ? (
        <p></p>
      ) : (
        <p>{Math.round(item.average_mark * 10) / 10}</p>
      )}
    </td>,
    <td key={`item-result-${item.id}`} className="px-6 py-4 font">
      {item.average_mark == null ? (
        <p></p>
      ) : item.average_mark < 5 ? (
        <p className="text-red-500 font-bold">Failed</p>
      ) : (
        <p className="text-green-500 font-bold">Passed</p>
      )}
    </td>,
    <td key={`item-status-${item.id}`} className="px-6 py-4">
      {item.clazz_code != null &&
      item.block != null &&
      item.semester != null &&
      item.year != null &&
      item.average_mark != null ? (
        <p>Đã hoàn thành</p>
      ) : item.clazz_code != null &&
        item.block != null &&
        item.semester != null &&
        item.year != null &&
        item.average_mark == null ? (
        <p>Chưa hoàn thành</p>
      ) : (
        <p>Chưa học</p>
      )}
    </td>,
  ];

  const renderRow1 = (item) => [
    <td key={`item-clazzCode-${item.id}`} className="px-6 py-4">
      {item.clazz_code}
    </td>,
    <td key={`item-subjectCode-${item.id}`} className="px-6 py-4">
      {item.subject_code}
    </td>,
    <td key={`item-credits-${item.id}`} className="px-6 py-4">
      {item.credits}
    </td>,
    <td key={`item-average_mark-${item.id}`} className="px-6 py-4">
      {Math.round(item.average_mark * 10) / 10}
    </td>,
    <td key={`item-result-${item.id}`} className="px-6 py-4 font">
      {item.average_mark < 5 ? (
        <p className="text-red-500 font-bold">Failed</p>
      ) : (
        <p className="text-green-500 font-bold">Passed</p>
      )}
    </td>,
    <td key={`item-status-${item.id}`} className="px-6 py-4">
      {item.credits}
    </td>,
  ];

  const [desktop, setDesktop] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 783) {
        setMobile(true);
        setDesktop(false);
      } else {
        setMobile(false);
        setDesktop(true);
      }
    };
    window.addEventListener("resize", handleResize);
    // Kiểm tra kích thước màn hình khi component được mount
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobile, desktop]);

  //call api
  const [studyResult, setStudyResult] = useState([]);
  const [averageMark, setAverageMark] = useState(0);

  const [credit, setCredits] = useState(0);
  // useEffect(() => {
  //   getStudyHistoryByStudentIdAPI()
  //     .then((data) => {
  //       setStudyResult(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching exam:", error);
  //     });
  // }, []);
  console.log(studyResult)

  // useEffect(() => {
  //   getStudyHistoryByStudentIdAPI()
  //     .then((data) => {
  //       // Filter out items with null average_mark
  //       const validResults = data.filter((item) => item.average_mark !== null);
  //       // Calculate total and average of valid average_mark values
  //       const total = validResults.reduce(
  //         (sum, item) => sum + item.average_mark,
  //         0
  //       );

  //       const average =
  //         validResults.length > 0 ? total / validResults.length : 0;
  //       setAverageMark(Math.round(average * 10) / 10);

  //       // Calculate total credits for valid results
  //       const totalCredits = validResults.reduce(
  //         (sum, item) => sum + item.credits,
  //         0
  //       );

  //       setCredits(totalCredits);
  //       // Sorting logic
  //       const semesterOrder = ["Spring", "Summer", "Fall"];
  //       const sortedData = data.sort((a, b) => {
  //         const allNonNullA =
  //           a.block != null &&
  //           a.clazz_code != null &&
  //           a.credits != null &&
  //           a.semester != null &&
  //           a.subject_code != null &&
  //           a.subject_id != null &&
  //           a.subject_name != null &&
  //           a.average_mark != null &&
  //           a.year != null;
  //         const allNonNullB =
  //           b.block != null &&
  //           b.clazz_code != null &&
  //           b.credits != null &&
  //           b.semester != null &&
  //           b.subject_code != null &&
  //           b.subject_id != null &&
  //           b.subject_name != null &&
  //           b.average_mark != null &&
  //           b.year != null;
  //         const nonNullExceptScoreA =
  //           a.block != null &&
  //           a.clazz_code != null &&
  //           a.credits != null &&
  //           a.semester != null &&
  //           a.subject_code != null &&
  //           a.subject_id != null &&
  //           a.subject_name != null &&
  //           a.average_mark == null &&
  //           a.year != null;
  //         const nonNullExceptScoreB =
  //           b.block != null &&
  //           b.clazz_code != null &&
  //           b.credits != null &&
  //           b.semester != null &&
  //           b.subject_code != null &&
  //           b.subject_id != null &&
  //           b.subject_name != null &&
  //           b.average_mark == null &&
  //           b.year != null;
  //         if (allNonNullA && !allNonNullB) return -1;
  //         if (!allNonNullA && allNonNullB) return 1;
  //         if (nonNullExceptScoreA && !nonNullExceptScoreB) return -1;
  //         if (!nonNullExceptScoreA && nonNullExceptScoreB) return 1; // Sort by year first, then by semester order
  //         if (a.year !== b.year) {
  //           return a.year - b.year;
  //         } else {
  //           return (
  //             semesterOrder.indexOf(a.semester) -
  //             semesterOrder.indexOf(b.semester)
  //           );
  //         }
  //       });
  //       setStudyResult(sortedData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching exam:", error);
  //     });
  // }, []);

  useEffect(() => {
    getStudyHistoryByStudentIdAPI()
      .then((data) => {
        // LỌC RA CÁC MÃNG CÓ TRUNG BÌNH KHÁC NULL
        const validResults = data.filter((item) => item.average_mark != null);
  
        // TÍNH TỔNG ĐIỂM TRUNG BÌNH
        const total = validResults.reduce(
          (sum, item) => sum + item.average_mark,
          0
        );
        const average =
          validResults.length > 0 ? total / validResults.length : 0;
        setAverageMark(Math.round(average * 10) / 10);
  
        // TÍNH TỐNG TÍN CHỈ 
        const totalCredits = validResults.reduce(
          (sum, item) => sum + item.credits,
          0
        );
        setCredits(totalCredits);
  
        // Sorting logic for year, semester, and block
        const semesterOrder = ["Spring", "Summer", "Fall"];
        const sortedData = data.sort((a, b) => {
          // First, sort by year
          if (a.year !== b.year) {
            return a.year - b.year;
          }
  
          // Next, sort by semester (Spring < Summer < Fall)
          const semesterComparison = semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester);
          if (semesterComparison !== 0) {
            return semesterComparison;
          }
  
          // Finally, sort by block (1 before 2)
          return a.block - b.block;
        });
  
        setStudyResult(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching exam:", error);
      });
  }, []);
  
  
  
  return (
    <>
      <Container>
        <TitleHeader title={"LỊCH SỬ HỌC TẬP"} />
        <div className="py-4">
          {desktop && (
            <>
              <Table
                DefaultTable={true}
                headers={headers}
                renderRow={renderRow}
                data={studyResult}
                maxRow={10}
              />
            </>
          )}
          {mobile && (
            <>
              <Table
                DefaultTable={true}
                headers={header1s}
                renderRow={renderRow1}
                data={studyResult}
                maxRow={10}
              />
            </>
          )}
        </div>

        <div className="flex flex-col text-sm w-full">
          <div className="h-10">
            <span className="px-6 py-2 mr-1 text-base">Điểm trung bình</span>
            <span className="font-medium text-base">{` ${averageMark}`}</span>
          </div>
          <div className="h-10">
            <span className="px-6 py-2 mr-14 text-base">Số tín chỉ </span>
            <span className="font-medium text-base">{` ${credit}`}</span>
          </div>
        </div>
      </Container>
    </>
  );
}
export default StudyHistory;
