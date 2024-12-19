import * as React from "react";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs"; // Import dayjs to create date objects

export default function BasicDateCalendar() {
  // Initialize with the current date formatted as "yyyy-MM-dd"
  const [value, setValue] = useState(dayjs().format("YYYY-MM-DD"));

  // Handle the change of date, and format it as "yyyy-MM-dd"
  const handleChange = (newValue) => {
    setValue(newValue.format("YYYY-MM-DD")); // Format date when it's selected
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar value={dayjs(value)} onChange={handleChange} />
    </LocalizationProvider>
  );
}
