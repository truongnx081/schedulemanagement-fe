import React, { useState, useEffect } from "react";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getAllStudyResult,getMarkTableByStudentIdAPI } from "../../api/StudyResult.js";
import Accordion from "../../component/Accordion.jsx";
import MarkedTable from "./MarksTable.jsx";
import "./style.css";

function MarkedBoard() {
  // Call API
  const [studyResult, setStudyResult] = useState([]);
  const [averageMark, setAverageMark] = useState(0);
  const [credit, setCredits] = useState(0);
  console.log(studyResult);

  // useEffect(() => {
  //   getAllStudyResult()
  //     .then((data) => {
  //       // Lọc ra các đối tượng có mark_average khác null
  //       const validResults = data.filter((item) => item.mark_average !== null);

  //       // Tính tổng và trung bình của các giá trị total_weighted_score hợp lệ
  //       const total = validResults.reduce(
  //         (sum, item) => sum + item.total_weighted_score,
  //         0
  //       );
  //       const average =
  //         validResults.length > 0 ? total / validResults.length : 0;
  //       setAverageMark(Math.round(average * 10) / 10);

  //       // Tính tổng tín chỉ cho các kết quả hợp lệ
  //       const totalCredits = validResults.reduce(
  //         (sum, item) => sum + item.credits,
  //         0
  //       );
  //       setCredits(totalCredits);

  //       // Logic sắp xếp
  //       const semesterOrder = ["Spring", "Summer", "Fall"];
  //       const sortedData = validResults.sort((a, b) => {
  //         if (a.year !== b.year) {
  //           return a.year - b.year; // Sắp xếp theo năm trước
  //         } else {
  //           return (
  //             semesterOrder.indexOf(a.semester) -
  //             semesterOrder.indexOf(b.semester)
  //           ); // Sau đó theo thứ tự học kỳ
  //         }
  //       });

  //       setStudyResult(sortedData);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching exam:", error);
  //     });
  // }, []);

  useEffect(() => {
    getMarkTableByStudentIdAPI()
      .then((data) => {
        
        const sortedData = data.sort((a, b) => a.study_in_id - b.study_in_id);

        // Set sorted data to the state
        setStudyResult(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching exam:", error);
      });
  }, []);

  console.log(studyResult);

  return (
    <>
      <Container>
        <TitleHeader title={"BẢNG ĐIỂM"} />
        <div className="mb-4"></div>
        <Accordion
          items={studyResult.map((item) => ({
            title: (
              <>
                <table className="style text-sm">
                  <tbody>
                    <tr>
                      <th>Mã môn</th>
                      <th>Tên môn</th>
                      <th>Trung bình</th>
                      <th>Trạng thái</th>
                    </tr>
                    <tr>
                      <td>{item.subject_code}</td>
                      <td>{item.subject_name}</td>
                      <td>{Math.round(item.average_mark * 10) / 10}</td>
                      <td>
                        {item.average_mark < 5 ? (
                          <p className="text-red-500 font-bold">Failed</p>
                        ) : (
                          <p className="text-green-500 font-bold">Passed</p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            ),
            content: (
              <>
                <MarkedTable
                  studyInId={item.study_in_id}
                />
                <div className="flex justify-between h-[40px]">
                  <div className="w-6/12 flex items-center justify-center border-l border-b">
                    <p className="font-medium text-sm">Điểm Trung Bình</p>
                  </div>
                  <div className="w-6/12 flex items-center border-b border-l border-r">
                    <div className="w-full text-center">
                      <p className="font-medium text-sm">
                        {Math.round(item.average_mark * 10) / 10}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ),
          }))}
          maxRow={5}
        />
      </Container>
    </>
  );
}

export default MarkedBoard;
