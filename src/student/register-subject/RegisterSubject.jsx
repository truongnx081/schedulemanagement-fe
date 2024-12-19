import Tabs from "../../component/Tabs";
import NotYetSubject from "./tabs/NotYetSubject";
import PlanSubject from "./tabs/PlanSubject.tsx";
// import ChangeScheduleSubject from "../current-subject/ChangeScheduleSubject";
import React, { useState, useEffect } from "react";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getCurrentProgressAPI } from "../../api/SemesterProgress.js";
import noDataImage from "../../images/nullData.png";

function RegisterSubject() {
  const tabsSubject = [
    { label: "Môn chưa học", content: <NotYetSubject /> },
    { label: "Môn học dự kiến", content: <PlanSubject /> },
    // { label: 'Doi mon hoc', content: <ChangeScheduleSubject/> },
  ];
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
  console.log(currentProgress);
  const flagPrepair = currentProgress.currentProgress === "prepaire";
  const flagCreate = currentProgress.currentProgress === "create";

  return (
    <Container>
      <TitleHeader title={"ĐĂNH KÝ MÔN HỌC"} />
      {flagPrepair ? (
        <>
          <div className="min-h-[600px]">
            <Tabs tabs={tabsSubject} />
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[600px] flex flex-col items-center justify-center">
            <img src={noDataImage} alt="" className="w-[30%]" />
            <p className="font-medium text-3xl text-[#3c6983]">
              Không phải thời gian đăng ký môn
            </p>
          </div>
        </>
      )}
    </Container>
  );
}
export default RegisterSubject;
