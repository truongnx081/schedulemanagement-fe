import React, { useState, useEffect } from "react";
import Table from "../../component/Table";
import { getMarkDetail } from "../../api/StudyResult.js";

function MarkedTable({ studyInId }) {
  const headers = ["Tên đầu điểm", "Trọng số", "Điểm", "Ghi chú"];

  const renderRow = (item) => [
    <td key={`item-mark_column_name-${item.id}`} className="px-6 py-4">
      {item.mark_column_name}
    </td>,
    <td key={`item-percentage-${item.id}`} className="px-6 py-4">
      {item.percentage}
    </td>,
    <td key={`item-marked-${item.id}`} className="px-6 py-4">
      {item.marked}
    </td>,
    <td key={`item-note-${item.id}`} className="px-6 py-4"></td>,
  ];

  const [markDetail, setMarkDetail] = useState([]);
  const [number, setNumber] = useState(20);

  // Fetching mark detail when studyInId changes
  useEffect(() => {
    if (studyInId) {
      getMarkDetail(studyInId)
        .then((response) => {
          setMarkDetail(response); // Set mark details
          
          // Set the number of rows (length - 1) if data is available
          const lengthMinusOne = response.length > 0 ? response.length - 1 : 0;
          setNumber(lengthMinusOne); 
        })
        .catch((error) => {
          console.error("Error fetching mark details:", error);
        });
    }
  }, [studyInId]); // Only trigger when studyInId changes

  if (!markDetail || markDetail.length === 0) {
    return <p>Loading...</p>; // Show loading if no data is fetched
  }

  return (
    <>
      <Table
        DefaultTable={true}
        showTurnPage={false}
        headers={headers}
        renderRow={renderRow}
        data={markDetail}
        maxRow={number} // Pass the number to control the rows
      />
    </>
  );
}

export default MarkedTable;
