import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./style/FoodDiaryCalendar.css"; // ✅ ใช้ CSS ที่เราแก้ไข

interface FoodDiaryCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  onChange: (date: Date) => void;
}

const FoodDiaryCalendar: React.FC<FoodDiaryCalendarProps> = ({ selectedDate, setSelectedDate }) => {
  const [foodDiaryDates, setFoodDiaryDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchFoodDiaryDates = async () => {
      try {
        const response = await fetch("/api/auth/diary/dates", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch food diary dates.");
        }

        const data: string[] = await response.json();
        setFoodDiaryDates(new Set(data)); // ✅ แปลงเป็น Set เพื่อให้ตรวจสอบง่าย
      } catch (error) {
        console.error("❌ Error fetching food diary dates:", error);
      }
    };

    fetchFoodDiaryDates();
  }, []);
  
  return (
    <Calendar
    onChange={(date) => {
      console.log("📅 Date selected from Calendar:", date);
      setSelectedDate(date as Date);
    }}    
  value={selectedDate}
  tileClassName={({ date, view }) => {
    if (view === "month") {
      const dateString = date.toLocaleDateString("en-CA"); // ✅ ใช้ local date string
      return foodDiaryDates.has(dateString) ? "food-day" : "";
    }
  }}
/>

  );
};

export default FoodDiaryCalendar;
