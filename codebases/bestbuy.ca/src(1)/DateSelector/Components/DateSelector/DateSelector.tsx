import * as moment from "moment";
import * as React from "react";
import { ChevronLeft } from "../../../SvgIcons/ChevronLeft";
import { ChevronRight } from "../../../SvgIcons/ChevronRight";
import * as style from "./style.css";
const NUM_OF_DAYS_IN_WEEK = 7;
const MAX_NUM_OF_DAY_SLOTS = 35;
const DAY_NAMES_EN = Object.freeze(["S", "M", "T", "W", "T", "F", "S"]);
const DAY_NAMES_FR = Object.freeze(["D", "L", "M", "M", "J", "V", "S"]);
export default class DateSelector extends React.Component {
    constructor(props) {
        super(props);
        this.year = () => {
            return this.state.momentObj.format("YYYY");
        };
        this.monthName = () => {
            return this.state.momentObj.format("MMMM");
        };
        this.onNextMonth = () => {
            const nextMoment = this.state.momentObj.add(1, "month");
            const reachedLatestMonth = nextMoment.month() === this.latestDate.month && nextMoment.year() === this.latestDate.year;
            this.setState({
                momentObj: nextMoment,
                reachedEarliestMonth: false,
                reachedLatestMonth,
            });
        };
        this.onPrevMonth = () => {
            const prevMoment = this.state.momentObj.subtract(1, "month");
            const reachedEarliestMonth = prevMoment.month() === this.earliestDate.month && prevMoment.year() === this.earliestDate.year;
            this.setState({
                momentObj: prevMoment,
                reachedEarliestMonth,
                reachedLatestMonth: false,
            });
        };
        this.renderDayNames = () => {
            let names;
            if (this.props.locale === "fr") {
                names = DAY_NAMES_FR;
            }
            else {
                names = DAY_NAMES_EN;
            }
            return names.map((name, i) => {
                const key = `dayName ${name} ${i}`;
                return React.createElement("th", { key: key }, name);
            });
        };
        this.getAvailableDate = (date) => {
            return this.props.availableDates
                ? this.props.availableDates.find((availableDate) => {
                    return this.isSameDate(date, availableDate);
                })
                : undefined;
        };
        this.isSelectedDate = (date) => {
            const { selectedDate } = this.state;
            if (selectedDate) {
                return this.isSameDate(date, selectedDate);
            }
            return false;
        };
        this.handleDateSelect = (day, availableDateId, momentObj) => () => {
            const selectedDate = {
                day,
                id: availableDateId,
                month: momentObj.month(),
                year: momentObj.year(),
            };
            if (this.props.availableDates) {
                this.props.onDateSelect(selectedDate);
            }
            else {
                this.setState({
                    selectedDate,
                }, () => {
                    this.props.onDateSelect(selectedDate);
                });
            }
        };
        this.generateMonthData = (momentObj) => {
            let allDays = [];
            const firstDayOfMonth = ((momentOb) => {
                const firstDay = moment(momentOb)
                    .startOf("month")
                    .format("d");
                return Number(firstDay);
            })(momentObj);
            const daysInMonth = momentObj.daysInMonth();
            // Make an array of length MAX_NUM_OF_DAY_SLOTS with daysInMonth data
            for (let i = 0; i < MAX_NUM_OF_DAY_SLOTS; i++) {
                allDays.push(i < daysInMonth ? i + 1 : null);
            }
            // Rotate the array based on firstDayOfMonth
            allDays = allDays
                .slice(MAX_NUM_OF_DAY_SLOTS - firstDayOfMonth)
                .concat(allDays.slice(0, MAX_NUM_OF_DAY_SLOTS - firstDayOfMonth));
            const monthData = [];
            // Chunk days into weeks
            while (allDays.length > 0) {
                monthData.push(allDays.splice(0, NUM_OF_DAYS_IN_WEEK));
            }
            return monthData;
        };
        this.renderMonth = (month, momentObj) => {
            return month.map((week, i) => {
                const key = `${momentObj.month()} week${i}`;
                return (React.createElement("tr", { className: style.monthDays, key: key }, this.renderWeek(week, momentObj)));
            }, momentObj);
        };
        this.renderWeek = (week, momentObj) => {
            return week.map((day, i) => {
                const key = `${momentObj.month()} day${i}`;
                if (day) {
                    const date = {
                        day,
                        month: momentObj.month(),
                        year: momentObj.year(),
                    };
                    const isSelectedDate = this.isSelectedDate(date);
                    const availableDate = this.getAvailableDate(date);
                    const availableDateId = availableDate ? availableDate.id : undefined;
                    const className = this.constructClassName(isSelectedDate, availableDate);
                    return (React.createElement("td", { className: className, key: key }, this.renderDay(day, momentObj, availableDateId)));
                }
                else {
                    return React.createElement("td", { className: style.blankDay, key: key });
                }
            }, momentObj);
        };
        this.constructClassName = (isSelectedDate, availableDate) => {
            return isSelectedDate
                ? style.selectedDate
                : availableDate
                    ? style.availableDate
                    : this.props.availableDates
                        ? style.unavailableDate
                        : style.availableDate;
        };
        this.renderDay = (day, momentObj, availableDateId) => {
            if (this.props.availableDates) {
                return availableDateId ? (React.createElement("button", { onClick: this.handleDateSelect(day, availableDateId, momentObj), "data-automation": "available-date", value: day, type: "button" },
                    React.createElement("span", null, day))) : (React.createElement("span", { "data-automation": "unavailable-date" }, day));
            }
            return (React.createElement("button", { onClick: this.handleDateSelect(day, undefined, momentObj), "data-automation": "available-date", value: day, type: "button" },
                React.createElement("span", null, day)));
        };
        this.sortAvailableDates = (dates) => {
            return dates.slice().sort((a, b) => {
                return new Date(a.year, a.month, a.day) - new Date(b.year, b.month, b.day);
            });
        };
        this.isSameDate = (date1, date2) => {
            return date1.day === date2.day && date1.month === date2.month && date1.year === date2.year;
        };
        const todayDate = { day: moment().date(), month: moment().month(), year: moment().year() };
        const latestDate = { day: 31, month: 11, year: 2016 };
        this.sortedAvailableDates = props.availableDates
            ? Object.freeze(this.sortAvailableDates(props.availableDates))
            : [];
        this.earliestDate = props.availableDates ? Object.freeze(this.sortedAvailableDates[0]) : latestDate;
        this.latestDate = props.availableDates
            ? Object.freeze(this.sortedAvailableDates[this.sortedAvailableDates.length - 1])
            : todayDate;
        const momentObj = moment();
        if (props.availableDates) {
            momentObj.month(this.earliestDate.month);
            momentObj.year(this.earliestDate.year);
        }
        else {
            momentObj.month(this.latestDate.month);
            momentObj.year(this.latestDate.year);
        }
        momentObj.locale(props.locale);
        const reachedLatestMonth = this.latestDate.month === momentObj.month() && this.latestDate.year === momentObj.year();
        const reachedEarliestMonth = props.availableDates
            ? this.earliestDate.month === momentObj.month() && this.earliestDate.year === momentObj.year()
            : false;
        const selectedDate = props.availableDates
            ? props.availableDates.find((date) => date.id === props.selectedDate.id)
                ? props.selectedDate
                : this.latestDate
            : this.latestDate;
        this.state = {
            momentObj,
            reachedEarliestMonth,
            reachedLatestMonth,
            selectedDate,
        };
    }
    componentDidUpdate(prevProps) {
        const { selectedDate, availableDates } = this.props;
        if (availableDates && prevProps.selectedDate !== selectedDate) {
            this.setState({ selectedDate });
        }
    }
    render() {
        const month = this.generateMonthData(this.state.momentObj);
        const forNextMonth = this.state.momentObj.clone();
        const nextMonth = this.generateMonthData(forNextMonth.add(1, "month"));
        return (React.createElement("div", { className: style.dateSelector, "data-automation": "calendar" },
            React.createElement("div", { "data-automation": "calendar-nav", className: style.calendarNav },
                React.createElement("button", { disabled: this.state.reachedEarliestMonth, onClick: this.onPrevMonth, "data-automation": "prev-month", type: "button", className: `${this.state.reachedEarliestMonth ? `${style.disabled}` : ""} ${style.leftButton}` },
                    React.createElement("span", { className: this.state.reachedEarliestMonth ? style.chevIcon : style.chevIconActive },
                        React.createElement(ChevronLeft, { color: this.state.reachedEarliestMonth ? "darkGrey" : "blue", className: style.chevron, viewBox: "0 0 25 25" }))),
                React.createElement("div", { className: style.monthYearContainer },
                    React.createElement("span", { "data-automation": "month-name" }, `${this.monthName()} `),
                    React.createElement("span", { "data-automation": "year" }, this.year())),
                React.createElement("div", { className: `${style.monthYearContainer} ${style.showTwoMonths}` },
                    React.createElement("span", { "data-automation": "month-name" }, `${forNextMonth.format("MMMM")} `),
                    React.createElement("span", { "data-automation": "year" }, this.year())),
                React.createElement("button", { disabled: this.state.reachedLatestMonth, onClick: this.onNextMonth, "data-automation": "next-month", type: "button", className: `${this.state.reachedLatestMonth ? `${style.disabled}` : ""} ${style.rightButton}` },
                    React.createElement("span", { className: this.state.reachedLatestMonth ? style.chevIcon : style.chevIconActive },
                        React.createElement(ChevronRight, { className: style.chevron, color: this.state.reachedLatestMonth ? "darkGrey" : "blue", viewBox: "0 0 25 25" })))),
            React.createElement("div", { className: style.calendarContainer },
                React.createElement("table", { "data-automation": "calendar-table", className: style.calendarTable },
                    React.createElement("thead", { className: style.calendarTableHeading },
                        React.createElement("tr", { className: style.dayNames }, this.renderDayNames())),
                    React.createElement("tbody", { className: style.calendarTableBody }, this.renderMonth(month, this.state.momentObj))),
                React.createElement("table", { "data-automation": "calendar-table", className: `${style.calendarTable} ${style.showTwoMonths}` },
                    React.createElement("thead", { className: style.calendarTableHeading },
                        React.createElement("tr", { className: style.dayNames }, this.renderDayNames())),
                    React.createElement("tbody", { className: style.calendarTableBody }, this.renderMonth(nextMonth, forNextMonth))))));
    }
}
//# sourceMappingURL=DateSelector.js.map