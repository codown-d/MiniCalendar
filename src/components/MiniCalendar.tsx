import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import styled from "styled-components";

// 为 DayButton 添加 isSelected 类型
interface DayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  disabled: boolean;
}

// 创建一个容器
const CalendarContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
`;

// 创建日期网格样式
const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  padding: 10px 0;
`;

// 创建日期按钮样式，并为 isSelected 属性提供类型
const DayButton = styled.button<DayButtonProps>`
  padding: 10px;
  background-color: ${(props) =>
    props.isSelected ? "#4caf50" : props.disabled ? "#aaa" : "transparent"};
  color: ${(props) => (props.isSelected ? "#fff" : "#000")};
  border: 1px solid #ddd;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MiniCalendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs()); // 当前日期
  const [selectedDate, setSelectedDate] = useState({
    year: 0,
    month: 0,
    day: 0,
  }); // 选中的日期

  // 获取当前月的第一天
  const startOfMonth = currentDate.startOf("month");
  // 获取当前月的最后一天
  const endOfMonth = currentDate.endOf("month");
  // 获取当前月的第一天是星期几
  const startDay = startOfMonth.day();
  // 获取上个月最后几天的日期来填充
  const prevMonthDays = startOfMonth.subtract(1, "month").daysInMonth();
  // 获取当前月的总天数
  const currentMonthDays = endOfMonth.date();

  // 创建一个日期数组，用于展示
  let days = useMemo(() => {
    const day = [];
    for (let i = prevMonthDays - startDay + 1; i <= prevMonthDays; i++) {
      day.push({
        year: currentDate.year(),
        month: currentDate.month() ,
        day: i,
        isCurrentMonth: false,
        
      });
    }
    for (let i = 1; i <= currentMonthDays; i++) {
      day.push({
        year: currentDate.year(),
        month: currentDate.month()+1,
        day: i,
        isCurrentMonth: true,
      });
    }
    const nextMonthDays = 7 - (day.length % 7);
    if (nextMonthDays != 7) {
      for (let i = 1; i <= nextMonthDays; i++) {
        day.push({
          year: currentDate.year(),
          month: currentDate.month() + 1,
          day: i,
          isCurrentMonth: false,
        });
      }
    }
    console.log(day);
    return day;
  }, [currentDate]);

  // 切换月份
  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const handleDateSelect = (day: React.SetStateAction<{ year: number; month: number; day: number; }>) => {
    setSelectedDate(day);
  };

  return (
    <CalendarContainer>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={goToPreviousMonth}>&lt;</button>
        <span>{currentDate.format("YYYY-MM")}</span>
        <button onClick={goToNextMonth}>&gt;</button>
      </div>

      <DaysGrid>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
          <div key={idx}>{day}</div>
        ))}

        {days.map((day, idx) => (
          <DayButton
            key={idx}
            isSelected={selectedDate.day === day.day&&selectedDate.month === day.month&&selectedDate.year === day.year&&day.isCurrentMonth}
            onClick={() => handleDateSelect(day)}
            disabled={!day.isCurrentMonth}
          >
            {day.day}
          </DayButton>
        ))}
      </DaysGrid>

      {!!selectedDate.year && (
        <div>
          <p>
            当前选择的日期是：{selectedDate.year}-{selectedDate.month}-{selectedDate.day}
          </p>
        </div>
      )}
    </CalendarContainer>
  );
};

export default MiniCalendar;
