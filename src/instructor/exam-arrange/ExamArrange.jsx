import React, { useState, useCallback, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DragDrop, { listExam } from "../../component/DragDrop";
import Button from "../../component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { doArrangeBatchAPI } from "../../api/ArrangeBatch.js";
import { toast } from "react-toastify";

function ExamArrange() {
  const location = useLocation();
  const { item, students } = location.state || {};

  const navigate = useNavigate();
  const numberBoard = Array.from({ length: 3 }, (_, index) => index + 1);

  const handleStudentListClick = useCallback(
    (item) => {
      navigate(
        `/danh-sach-sinh-vien/${encodeURIComponent(
          item.subject_code
        )}/${encodeURIComponent(item.clazz_code)}`,
        { state: { item } }
      );
    },
    [navigate]
  );

  const getbackBtn = [
    {
      id: 1,
      name: (
        <>
          <FontAwesomeIcon icon={faCircleLeft} className="mr-2" />
          Trở về
        </>
      ),
      onClick: () => handleStudentListClick(item),
    },
  ];

  // const saveList = () => {
  //   console.log("danh sach thi cua idClazz: " + item.clazz_id + "|" + listExam);
  // };

  const saveList = async () => {
    try {
      const arrangeBatchDTOS = listExam.split(";").map((entry) => {
        const { clazz_id, student_id, batch } = JSON.parse(entry);
        return {
          clazzId: clazz_id,
          studentId: student_id,
          batch: batch,
        };
      });

      await doArrangeBatchAPI(arrangeBatchDTOS);
      toast.success("Xếp lịch thi thành công!");
    } catch (error) {
      console.error("Error arranging batch:", error);
      toast.error("Lỗi khi xếp lịch thi!");
    }
  };

  return (
    <Container>
      <TitleHeader
        title={`XẾP DANH SÁCH ĐỢT THI ${item.clazz_code} - MÔN ${item.subject_name}`}
        titleClassName="uppercase text-[1.25rem] font-medium"
      />
      <div className="min-h-[800px]">
        <div className="h-[700px]">
          <DragDrop
            numberBoard={numberBoard}
            initialStudents={students}
            showOptions={true}
            showSearchItem={true}
            showRandomBtn={true}
            showOtherBtn={true}
            otherBtns={getbackBtn}
            clazz={item}
          />
        </div>

        <div className="flex md:mt-10 mt-36 justify-end">
          <Button
            label={
              <>
                <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" /> Lưu
              </>
            }
            className="w-full md:w-[150px] mr-0 md:mr-[60px] bg-blue-400 h-10 p-1 text-white flex justify-center font-medium"
            onClick={saveList}
          />
        </div>
      </div>
    </Container>
  );
}

export default ExamArrange;
