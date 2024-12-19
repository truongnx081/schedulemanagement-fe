import * as React from "react";
import Container from "../../component/Container.tsx";
import TitleHeader from "../../component/TitleHeader.tsx";
import DateCalendarServerRequest from "./DateCalendarServerRequest.tsx";
import SimpleCalendar from "./SimpleCalendar.jsx";

function Calendar() {
  return (
    <Container>
      <TitleHeader title={"GHI CHÚ"} />
      <div className="w-full min-h-[700px]">
        <SimpleCalendar />
      </div>
    </Container>
  );
}

export default Calendar;
