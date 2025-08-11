import React, { type Dispatch, type SetStateAction } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Props = {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
};

const TaskCalendar: React.FC<Props> = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="bg-white rounded p-4 shadow mb-4">
      <Calendar
        onChange={(value) => {
          if (value instanceof Date) {
            setSelectedDate(value);
          } else if (Array.isArray(value) && value[0] instanceof Date) {
            // If range selection is enabled, take the first date
            setSelectedDate(value[0]);
          }
        }}
        value={selectedDate}
        calendarType="iso8601"
      />
    </div>
  );
};

export default TaskCalendar;
