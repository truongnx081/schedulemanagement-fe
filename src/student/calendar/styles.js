import styled from "styled-components";

export const CalendarContainer = styled.div`
  max-width: 400px; /* Fixed width */
  margin: 2rem auto;
  padding: 1rem;
  border-radius: 10px; /*main box*/
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

export const StyledCalendar = styled.div`
  .react-calendar {
    width: 100%; /* Ensures it fits the fixed width container */
    border: none;
    font-family: "Arial", sans-serif;
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .react-calendar__navigation__label {
      flex-grow: 1;
      text-align: center;
      min-width: 120px; /* Fixed min-width for the month/year label */
    }
  }

  .react-calendar__navigation button {
    color: #4a90e2;
    min-width: 44px;
    background: none;
    font-size: 16px;
    margin-top: 8px;
    border: none;
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: #1d6dc1;
    }
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    color: #4a90e2;
    margin-bottom: 10px;
    text-decoration: none; /* Remove underline */
  }

  .react-calendar__month-view__weekdays__weekday abbr {
    text-decoration: none; /* Remove underline */
  }

  .react-calendar__tile {
    max-width: 100%;
    padding: 15px 0px;
    background: none;
    text-align: center;
    line-height: 1.5em;
    border: none;
    outline: none;
    border-radius: 50%; /* border-radius hover box */
    color: #2d2d2d;
    transition: background-color 0.3s ease, color 0.3s ease;
    &:hover {
      background-color: #f0f0f0;
    }
    position: relative; /* Needed for positioning the icon absolutely */
  }

  .tile-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .icon {
    position: absolute;
    top: 5px; /* Adjust to position above the date */
    right: 25px;
    font-size: 12px; /* Adjust size as needed */
  }

  .day-container {
    position: relative;
  }

  .react-calendar__tile--now {
    background: #f3f9ff;
    color: #4a90e2;
  }

  .react-calendar__tile--active {
    background: #4a90e2;
    color: white;
  }

  .react-calendar__tile--active:hover {
    background: #1d6dc1;
  }

  .react-calendar__tile--range {
    background: #e0e0e0;
    color: white;
    border-radius: 50%; /*border radious click box*/
  }

  .react-calendar__tile--range:hover {
    background: #c4c4c4;
  }
`;
