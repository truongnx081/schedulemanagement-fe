import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SelectBox from "./SelectBox";
import Button from "./Button";

function Table({
  data,
  headers,
  renderRow,
  maxRow,
  DefaultTable = false,
  secondTable = false,
  thirdTable = false,
  showTurnPage = true,
  showOptions = false,
  showSearch = false,
  searchClass = "",
  showSelectBox = false,
  optionsValue = [],
  showSelectBoxes = false,
  numberSelectBox = [{}],
  showBtnStart = false,
  btnStart = [],
  showBtnEnd = false,
  btnEnd = [],
  cbWidth = "w-4/12",
  StickyHeader = false,
  nullData = "Không có dữ liệu",
}) {
  const [filteredData, setFilteredData] = useState(data);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [rowsPerPage] = useState(maxRow);

  const debouncedSearchTerm = useCallback(
    debounce((term) => setSearchTerm(term), 300),
    []
  );

  useEffect(() => {
    setFilteredData(
      data.filter(
        (item) =>
          (selectedFilter === "" ||
            Object.values(item).some((val) =>
              val?.toString().includes(selectedFilter)
            )) &&
          Object.values(item).some((val) =>
            val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
    setCurrentPage(0);
  }, [data, searchTerm, selectedFilter]);

  const handleSearchChange = (e) => {
    debouncedSearchTerm(e.target.value);
  };

  const currentData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination: Show range of pages like 1...4...lastNumber
  const getPageNumbers = () => {
    const pageNumbers = [];
    const visiblePages = 5; // Number of visible page buttons (including the first, current, last)

    // Always show the first page
    if (currentPage > visiblePages - 1) pageNumbers.push(0);

    // Show pages before the current page
    for (let i = Math.max(currentPage - 2, 0); i < currentPage; i++) {
      pageNumbers.push(i);
    }

    // Show the current page
    pageNumbers.push(currentPage);

    // Show pages after the current page
    for (
      let i = currentPage + 1;
      i < Math.min(currentPage + 3, totalPages);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Always show the last page if not already included
    if (totalPages - 1 > currentPage + 2) pageNumbers.push(totalPages - 1);

    return pageNumbers;
  };

  return (
    <div className="">
      <div className="w-full">
        {showOptions && (
          <div
            className={`w-full flex flex-col md:flex-row items-center justify-between my-2`}
          >
            {showBtnStart && (
              <div className="md:w-1/4 w-full my-2 mx-2 flex">
                {btnStart.map((button, index) => (
                  <Button
                    key={index}
                    label={button.name}
                    onClick={button.onClick}
                    className="border rounded-md transition-all p-1 m-1 flex-1 h-10 bg-blue-500 text-white justify-center"
                  />
                ))}
              </div>
            )}
            {showSelectBox && (
              <div className={`md:${cbWidth} w-full my-2 mx-2`}>
                {optionsValue.map((selectBox, index) => (
                  <SelectBox
                    key={index}
                    options={selectBox.options}
                    name={selectBox.name}
                    nameSelect={selectBox.nameSelect}
                    onChange={selectBox.onChange}
                    value={selectBox.value}
                    className={selectBox.className}
                    disable={selectBox.disable}
                  />
                ))}
              </div>
            )}
            {showSelectBoxes && (
              /* <div className="md:w-full w-full flex my-2 mx-2 justify-evenly"> */
              <div
                className={`md:${cbWidth} w-full flex my-2 md:mr-2 mr-0 justify-start`}
              >
                {numberSelectBox.map((selectBox, index) => (
                  <SelectBox
                    key={index}
                    options={selectBox.options}
                    name={selectBox.name}
                    nameSelect={selectBox.nameSelect}
                    onChange={selectBox.onChange}
                    value={selectBox.value}
                    className={selectBox.className}
                    optionNameSelect={selectBox.optionNameSelect}
                    avaiableNameSelect={selectBox.avaiableNameSelect}
                    disable={selectBox.disable}
                  />
                ))}
              </div>
            )}
            {showSearch && (
              <div className={`md:w-4/12 w-full my-2 mx-2 ${searchClass}`}>
                <div className="relative">
                  <div className="absolute top-3 left-0 flex items-center pl-3.5 pointer-events-none z-20">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="text-[#808EA1]"
                    />
                  </div>
                </div>

                <input
                  id="search"
                  className={`border text-gray-900 text-sm rounded-lg w-full pl-10 p-2.5 focus:outline-none `}
                  name="search"
                  aria-label="Search Bar"
                  placeholder="Tìm kiếm..."
                  onChange={handleSearchChange}
                />
              </div>
            )}
            {showBtnEnd && (
              <div className="md:w-4/12 w-full my-2 mx-2 flex justify-end">
                {btnEnd.map((button, index) => (
                  <Button
                    key={index}
                    label={button.name}
                    onClick={button.onClick}
                    className={`w-[150px] h-[40px] border rounded-md transition-all bg-blue-500 text-white justify-center`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <table className={`w-full text-xs text-center rtl:text-left`}>
        <thead
          className={`border bg-blue-50 ${StickyHeader ? "sticky top-0" : ""}`}
        >
          <tr>
            <th key="STT" className="px-2 py-4 max-w-[20px]">
              STT
            </th>
            {headers.map((header, index) => (
              <th key={index} className="px-2 py-4 max-w-[50px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="">
          {currentData.map((item, index) => (
            <tr key={index} className="border">
              <th key={`stt-${item.id}`} className="px-2 py-4 max-w-[50px]">
                {index + 1 + currentPage * rowsPerPage}
              </th>
              {renderRow(item)}
            </tr>
          ))}
        </tbody>
      </table>

      {currentData.length === 0 && (
        <div className="border flex justify-center items-center w-full h-[500px] py-20 text-2xl font-medium">
          {nullData}
        </div>
      )}

      {showTurnPage && (
        <section className="flex justify-center items-center my-4 text-xs w-full">
          <button onClick={handlePreviousPage} disabled={currentPage === 0}>
            <p
              className={
                currentPage === 0 ? "text-[#909db0]" : "text-[#000000]"
              }
            >
              Trước
            </p>
          </button>

          <div className="mx-3 flex">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`mx-0 px-4 py-2 font-bold ${
                  currentPage === page ? "bg-blue-50" : ""
                } rounded`}
                onClick={() => setCurrentPage(page)}
              >
                {page + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
          >
            <p
              className={
                currentPage === totalPages - 1
                  ? "text-[#909db0]"
                  : "text-[#000000]"
              }
            >
              Tiếp
            </p>
          </button>
        </section>
      )}
    </div>
  );
}

export default Table;
