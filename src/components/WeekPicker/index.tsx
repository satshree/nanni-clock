import { FC, useState } from "react";
import moment, { Moment } from "moment";
import { CalendarDayShape, SingleDatePicker } from "react-dates";
import styled from "@emotion/styled";
// @ts-ignore
import classNames from "classnames";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

const WeekPickerWrapper = styled.div`
  display: inline-flex;

  .DateInput {
    display: none;
  }

  .DateInput_input {
    width: 100%;
    border: 0;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-radius: 0;
    display: inline-block;
    line-height: 44px;
    cursor: pointer;
    text-align: center;
    padding: 0;
    outline: none;
  }

  .SingleDatePickerInput_calendarIcon {
    color: #42526e !important;
    font-weight: 500;
  }
`;

const StyledDay = styled.td<{ isDisabled?: boolean }>`
  width: 39px;
  height: 38px;
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
`;

export const calculateActiveWeek = (date: moment.Moment): Moment[] => {
  const mon = date.clone().startOf("isoWeek");
  const tue = mon.clone().add(1, "d");
  const wed = mon.clone().add(2, "d");
  const thu = mon.clone().add(3, "d");
  const fri = mon.clone().add(4, "d");
  const sat = mon.clone().add(5, "d");
  const sun = mon.clone().add(6, "d");

  return [mon, tue, wed, thu, fri, sat, sun];
};

interface Props {
  onWeekChange: (dates: Moment[]) => void;
  selectedDays: Moment[];
}

const WeekPicker: FC<Props> = ({ onWeekChange, selectedDays }) => {
  const [date, setDate] = useState(moment());
  const [focusedInput, setFocusedInput] = useState<boolean>(false);
  const [hoveredDays, setHoveredDays] = useState(selectedDays);

  const isDayHighlighted = (date: moment.Moment) =>
    hoveredDays.some((hoveredDay) => hoveredDay.isSame(date, "day"));

  const onDateHovered = (date?: moment.Moment | null) => {
    if (!date) return;

    setHoveredDays(calculateActiveWeek(date));
  };

  const onDateChange = (date?: Moment | null) => {
    if (!date) return;

    setDate(date);
    setFocusedInput(false);
    onWeekChange(calculateActiveWeek(date));
  };

  const renderCalendarDay = (date: CalendarDayShape) => {
    const dayClasses = classNames(
      "CalendarDay",
      "CalendarDay__default",
      "CalendarDay_1",
      "CalendarDay__default_2"
    );

    if (date && date.day) {
      const dayOfMonth = date.day.date();
      const isHighlighted = isDayHighlighted(date.day);
      const style = {
        backgroundColor: isHighlighted ? "#3182CE" : "#FFFFFF",
        color: isHighlighted ? "#FFFFFF" : "#000000",
      };

      const nextWeek = moment().add(1, "week").startOf("week").add(1, "day");

      if (date.day.isAfter(nextWeek)) {
        return (
          <StyledDay
            isDisabled
            className={dayClasses}
            style={{ backgroundColor: "#F2F2F2", color: "#DDDDDD" }}
          >
            {dayOfMonth}
          </StyledDay>
        );
      }

      return (
        <StyledDay
          style={style}
          className={dayClasses}
          onClick={() => onDateChange(date.day)}
          onMouseEnter={() => onDateHovered(date.day)}
        >
          {dayOfMonth}
        </StyledDay>
      );
    } else {
      return <StyledDay className={dayClasses} />;
    }
  };

  return (
    <WeekPickerWrapper>
      <SingleDatePicker
        date={date}
        id="week_date_picker"
        focused={focusedInput}
        onFocusChange={({ focused }) => setFocusedInput(focused)}
        numberOfMonths={1}
        hideKeyboardShortcutsPanel
        renderCalendarDay={renderCalendarDay}
        onDateChange={onDateChange}
        displayFormat="DD/MM/YYYY"
        showDefaultInputIcon
        firstDayOfWeek={1}
        customInputIcon={
          <>
            {moment(selectedDays[0]).format("DD/MM/YYYY")} -{" "}
            {moment(selectedDays[4]).format("DD/MM/YYYY")}{" "}
          </>
        }
      />
    </WeekPickerWrapper>
  );
};

export default WeekPicker;
