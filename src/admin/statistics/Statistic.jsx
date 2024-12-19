import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectBox from "../../component/SelectBox";
import { getStatisticByYear } from "../../api/admin.js";
import { getAllYearAPI } from "../../api/years.js";
import {
  faChalkboardUser,
  faF,
  faGraduationCap,
  faPeopleGroup,
  faSchool,
} from "@fortawesome/free-solid-svg-icons";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import CustomLineChart from "./CustomLineChart.jsx";

//line chart

const lines = [
  {
    dataKey: "student",
    stroke: "#8884d8",
    strokeWidth: 3,
    activeDot: { r: 8, fill: "#8884d8" },
    gradientId: "colorStudent",
  },
  {
    dataKey: "pass",
    stroke: "#82ca9d",
    strokeWidth: 3,
    activeDot: { r: 8, fill: "#82ca9d" },
    gradientId: "colorPass",
  },
  {
    dataKey: "fail",
    stroke: "#CA1D20",
    strokeWidth: 3,
    activeDot: { r: 8, fill: "#CA1D20" },
    gradientId: "colorFail",
  },
];

const gradients = [
  {
    id: "colorStudent",
    stops: [
      { offset: "5%", stopColor: "#8884d8", stopOpacity: 0.9 },
      { offset: "45%", stopColor: "#8884d8", stopOpacity: 0.5 },
      { offset: "95%", stopColor: "#8884d8", stopOpacity: 0.1 },
    ],
  },
];

//

function Statistic() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [years, setYears] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await getAllYearAPI();
        if (response && response.data) {
          const formattedYears = response.data.map((item) => ({
            value: item.year.toString(),
            label: item.year.toString(),
          }));
          setYears(formattedYears.reverse());
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };

    fetchYears();
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getStatisticByYear(selectedYear);
        if (response.data) {
          setStatistics(response.data);

          const yearStart = parseInt(selectedYear) - 5;
          const yearEnd = parseInt(selectedYear);
          let tempChartData = [];
          for (let year = yearStart; year <= yearEnd; year++) {
            const response = await getStatisticByYear(year.toString());
            if (response.data) {
              tempChartData.push({
                year: year.toString(),
                student: response.data.student_amout,
                pass: response.data.pass,
                fail: response.data.fail,
              });
            }
          }

          setChartData(tempChartData);
        } else {
          console.error("Invalid data structure:", response);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [selectedYear]);
  console.log(statistics);
  return (
    <Container>
      <TitleHeader title="THỐNG KÊ" />
      {/* SelectBox for Year Selection */}
      <div className="my-6 w-56">
        <SelectBox
          options={years}
          value={selectedYear}
          onChange={handleYearChange}
          name="Năm học"
          nameSelect="Chọn năm"
          nameSelectValue=""
        />
      </div>
      <div className="w-full mt-6 flex md:flex-row flex-col min-h-[500px]">
        <div className="w-3/12 flex flex-col items-center justify-between">
          <div className="w-full flex border items-center rounded-md">
            <FontAwesomeIcon icon={faPeopleGroup} className="w-3/12 text-3xl" />
            <div className="w-9/12 flex flex-col p-4">
              <p className="text-lg font-medium text-blue-500">
                Số lượng sinh viên
              </p>
              <p>{statistics?.student_amout ?? 0} sinh viên</p>
            </div>
          </div>
          <div className="w-full flex border items-center rounded-md">
            <FontAwesomeIcon
              icon={faChalkboardUser}
              className="w-3/12 text-3xl"
            />
            <div className="w-9/12 flex flex-col p-4">
              <p className="text-lg font-medium text-blue-500">
                Số lượng giảng viên
              </p>
              <p>{statistics?.active_instructor ?? 0} giảng viên</p>
            </div>
          </div>
          <div className="w-full flex border items-center rounded-md">
            <FontAwesomeIcon icon={faSchool} className="w-3/12 text-3xl" />
            <div className="w-9/12 flex flex-col p-4">
              <p className="text-lg font-medium text-blue-500">
                Số lượng lớp hiện có
              </p>
              <p>{statistics?.clazz_amount ?? 0} lớp</p>
            </div>
          </div>
          <div className="w-full flex border items-center rounded-md">
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="w-3/12 text-3xl"
            />
            <div className="w-9/12 flex flex-col p-4">
              <p className="text-lg font-medium text-blue-500">
                Sinh viên pass môn
              </p>
              <p>{statistics?.pass ?? 0} học viên</p>
            </div>
          </div>
          <div className="w-full flex border items-center rounded-md">
            <FontAwesomeIcon icon={faF} className="w-3/12 text-3xl" />
            <div className="w-9/12 flex flex-col p-4">
              <p className="text-lg font-medium text-blue-500">
                Sinh viên fail môn
              </p>
              <p>{statistics?.fail ?? 0} học viên</p>
            </div>
          </div>
        </div>

        <div className={`w-9/12 flex items-center`}>
          <CustomLineChart
            data={chartData}
            lines={lines}
            gradients={gradients}
          />
        </div>
      </div>
    </Container>
  );
}
export default Statistic;
