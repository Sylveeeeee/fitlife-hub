"use client";
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DatePicker: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <Calendar 
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        locale="en-US"
      />
    </div>
  );
};

export default DatePicker;
