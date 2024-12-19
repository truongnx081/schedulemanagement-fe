import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../component/Table";
import Button from "../../component/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import { getClazzesByInstructor } from "../../api/clazzs.js";
import { getAllBlocksAPI } from "../../api/Block.js";
import { getAllSemesterAPI } from "../../api/Semester.js";
import { getAllYearAPI } from "../../api/years.js";

function TeachManage() {
  const navigate = useNavigate();

  const headers = ["Ca", "Phòng", "Lớp", "Mã Môn", "Tên Môn", ""];

  const renderRow = (item) => [
    <td key={`item-shift-${item.id}`} className="px-6 py-4">
      Ca {item.shift}
    </td>,
    <td key={`item-room_name-${item.id}`} className="px-6 py-4">
      {item.room_name}
    </td>,
    <td key={`item-clazz_code-${item.id}`} className="px-6 py-4">
      {item.clazz_code}
    </td>,
    <td key={`item-subject_code-${item.id}`} className="px-6 py-4">
      {item.subject_code}
    </td>,
    <td key={`item-subject_name-${item.id}`} className="px-6 py-4">
      {item.subject_name}
    </td>,
    <td key={`item-option-${item.id}`} className="px-6 py-4">
      <div className="flex justify-center w-full">
        <Button
          label={
            <>
              <FontAwesomeIcon icon={faClipboardList} className="mr-2" /> Danh
              sách
            </>
          }
          className="w-[150px] h-[40px] flex items-center justify-center text-white"
          onClick={() => handleStudentListClick(item)}
        />
      </div>
    </td>,
  ];

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

  // Call API
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedSemester, setSelectedSemester] = useState("Fall");
  const [selectedBlock, setSelectedBlock] = useState(2);

  const [clazzTeaching, setClazzTeaching] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [years, setYears] = useState([]);

  // GET API VALUE CB BLOCK
  useEffect(() => {
    const fetchBlocks = async () => {
      const data = await getAllBlocksAPI();
      const formattedBlocks = data.map((block) => ({
        value: block.block,
        label: block.block,
      })); // Format data with value and label
      setBlocks(formattedBlocks);
    };

    fetchBlocks(); // Call the API function
  }, []);

  // GET API VALUE CB SEMESTER
  useEffect(() => {
    const fetchSemesters = async () => {
      const data = await getAllSemesterAPI();
      const formattedSemesters = data.map((semester) => ({
        value: semester.semester,
        label: semester.semester,
      })); // Format data with value and label
      setSemesters(formattedSemesters);
    };

    fetchSemesters(); // Call the API function
  }, []);

  // GET API VALUE CB YEAR
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await getAllYearAPI();
        const formattedYears = response.data
          .map((year) => ({
            value: year.year,
            label: year.year.toString(),
          }))
          .reverse();
        setYears(formattedYears);
      } catch (error) {
        console.error("Failed to fetch years:", error);
      }
    };

    fetchYears();
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };
  const handleBlockChange = (event) => {
    setSelectedBlock(event.target.value);
  };

  // Fetch students whenever course or major is selected
  useEffect(() => {
    if (selectedBlock && selectedSemester && selectedYear) {
      getClazzesByInstructor(selectedBlock, selectedSemester, selectedYear)
        .then((data) => {
          setClazzTeaching(data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });
    }
  }, [selectedBlock, selectedSemester, selectedYear]);

  const selectBoxs = [
    {
      options: blocks,
      name: "Block",
      onChange: handleBlockChange,
      value: selectedBlock,
      className: "md:mr-1 w-full md:w-[200px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      options: semesters,
      name: "Kỳ",
      onChange: handleSemesterChange,
      value: selectedSemester,
      className: "md:mr-1 w-full md:w-[200px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
    {
      options: years,
      name: "Năm",
      onChange: handleYearChange,
      value: selectedYear,
      className: "md:mr-1 w-full md:w-[200px] pt-4 md:pt-4",
      avaiableNameSelect: false,
    },
  ];

  return (
    <Container>
      <TitleHeader
        title={
          <>
            <p className="upper-case">
              DANH SÁCH LỚP PHỤ TRÁCH BLOCK {selectedBlock} KỲ{" "}
              {selectedSemester} NĂM {selectedYear}
            </p>
          </>
        }
      />
      <div className="min-h-[800px]">
        <Table
          DefaultTable={true}
          showOptions={true}
          showSearch={true}
          showSelectBoxes={true}
          numberSelectBox={selectBoxs}
          showBtnEnd={true}
          headers={headers}
          renderRow={renderRow}
          data={clazzTeaching}
          maxRow={10}
          searchClass={"mt-7"}
        />
      </div>
    </Container>
  );
}

export default TeachManage;
