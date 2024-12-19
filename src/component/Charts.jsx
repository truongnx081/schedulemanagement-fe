import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "react-apexcharts";

function Charts({
  boxInfo = false,
  boxes = [],
  lineChart = false,
  barChart = false,
  pieChart = false,
  mixedChart = false,
  options,
  mixedchartType,
}) {
  if (mixedChart) {
    mixedchartType = "line"; // Adjust if needed
  } else if (barChart) {
    mixedchartType = "bar";
  } else if (pieChart) {
    mixedchartType = "pie";
  }

  return (
    <div className="w-full">
      {boxInfo && (
        <div className="flex justify-between items-center border p-2">
          {boxes.map((box, index) => (
            <div
              key={index}
              style={{ width: `calc(100% / ${boxes.length})` }}
              className="flex flex-col p-2"
            >
              <div className="border rounded-md">
                <div className="flex items-center justify-between px-4 my-2">
                  <FontAwesomeIcon
                    className="w-14 h-14"
                    icon={box.icon}
                    size="xl"
                  />
                  <span className="text-lg font-medium">{box.value}</span>
                </div>
                <div className="font-medium flex justify-center my-2">
                  {box.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center border p-2">
        {barChart && (
          <div className="w-full">
            <Chart
              options={options}
              series={options.series}
              type="bar"
              height={380}
            />
          </div>
        )}
        {mixedChart && (
          <div className="w-full">
            <Chart
              options={options}
              series={options.series}
              type={mixedchartType} // Use the dynamic chart type
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Charts;
