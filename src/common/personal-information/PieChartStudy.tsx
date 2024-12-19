import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import { getResultStudy } from "../../api/StudyResult";

export default function PieChartStudy() {
  const [resultStudy, setResultStudy] = useState({
    passedSubjects: 0,
    unfinishedSubjects: 0,
  });

  useEffect(() => {
    getResultStudy()
      .then((response) => {
        setResultStudy(response);
      })
      .catch((error) => {
        console.error("Failed to fetch study result:", error);
      });
  }, []); // Ensure useEffect only runs once on component mount

  const data = [
    { value: resultStudy.passedSubjects },
    { value: resultStudy.unfinishedSubjects },
  ];

  const size = {
    width: 300, // Adjusted width
    height: 150, // Adjusted height
  };

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 16, // Adjusted font size for smaller chart
  }));

  const [title, setTitle] = useState("");

  useEffect(() => {
    determineTitle();
  }, [resultStudy]);

  const determineTitle = () => {
    switch (true) {
      case resultStudy.passedSubjects <= 5:
        setTitle("Khởi đầu");
        break;
      case resultStudy.unfinishedSubjects <= 5:
        setTitle("Sắp hoàn thành");
        break;
      case resultStudy.unfinishedSubjects === 0:
        setTitle("Hoàn thành");
        break;
      default:
        setTitle("Chưa hoàn thành");
        break;
    }
  };

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText
        x={left + width / 2}
        y={top + height / 2}
        className="font-medium text-[10px]" // Adjusted text size for better fit
      >
        {children}
      </StyledText>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-end">
      {/* Center the chart */}
      <PieChart series={[{ data, innerRadius: 30 }]} {...size}>
        <PieCenterLabel></PieCenterLabel>
      </PieChart>
    </div>
  );
}
