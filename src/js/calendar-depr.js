import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

class Calendar {

	constructor() {
		this.today = dayjs().format("YYYY-MM-DD");
		this.initialYear = dayjs().format("YYYY");
		this.initialMonth = dayjs().format("M");
		this.selectedMonth = dayjs(new Date(this.initialYear, this.initialMonth - 1, 1 ));
		this.currentMonthDays = null;
		this.previousMonthDays = null;
		this.nextMonthDays = null;
		this.days = {
			all: null,
			previousMonth: null,
			currentMonth: null,
			nextMonth: null,
		};

		this.elements = {
			daysOfWeek: document.getElementById("days-of-week"),
			calendarDays: document.getElementById("calendar-days"),
			selectedMonth: document.getElementById("selected-month"),
			arrows: {
				next: document.getElementById("next-month-selector"),
				previous: document.getElementById("previous-month-selector"),
			},
		};
		
		this.active = {
			raw: dayjs(new Date(this.initialYear, this.initialMonth - 1, 1 )),
			month: dayjs(new Date(this.initialYear, this.initialMonth - 1, 1 )).format("M"),
			year: dayjs(new Date(this.initialYear, this.initialMonth - 1, 1 )).format("YYYY"),
		};

		this.init();
	};

	init = () => {
		this.createCalendar();
		this.addEventListeners();

	};

	updateActive = (date) => {
		this.active.raw = dayjs(date);
		this.active.month = dayjs(date).format("M");
		this.active.year = dayjs(date).format("YYYY")	
	}

	printMonthLabel = () => {
		this.elements.selectedMonth.innerText = dayjs(new Date(this.active.year, this.active.month - 1)).format("MMMM YYYY");
	}

	createCalendar = () => {
		this.printMonthLabel();
		this.removeDays();
		this.createDays();
		this.appendDays();
	};

	createDays = () => {
		this.createDaysForCurrentMonth();
		this.createDaysForPreviousMonth(this.active.year, this.active.month);
		this.createDaysForNextMonth(this.active.year, this.active.month);
		this.createDaysForAllMonths();
	}
	


	removeDays = () => {
		this.elements.calendarDays.innerHTML = null
	};

	appendDays = () => {
		this.days.all.forEach((day) => {
			const dayElement = document.createElement("li");
			const dayElementClassList = dayElement.classList;
			dayElementClassList.add("calendar-day");
			const dayOfMonthElement = document.createElement("span");
			dayOfMonthElement.innerText = day.dayOfMonth;
			dayElement.appendChild(dayOfMonthElement);
			this.elements.calendarDays.appendChild(dayElement);
			if (!day.isCurrentMonth) dayElementClassList.add("calendar-day--not-current");
			if (day.date === this.today) dayElementClassList.add("calendar-day--today");
		});

		}

		createDaysForPreviousMonth = () => {
			const firstDayOfTheMonthWeekday = this.getWeekday(this.days.currentMonth[0].date);
			const previousMonth = dayjs(`${this.active.year}-${this.active.month}-01`).subtract(1, "month");
			const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;
			const previousMonthLastMondayDayOfMonth = dayjs(this.days.currentMonth[0].date).subtract(visibleNumberOfDaysFromPreviousMonth, "day").date();
			this.days.previousMonth = [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
				return {
					date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthLastMondayDayOfMonth + index}`).format("YYYY-MM-DD"),
					dayOfMonth: previousMonthLastMondayDayOfMonth + index,
					isCurrentMonth: false
				};
			});
		};

		createDaysForCurrentMonth = () => {
			const numberOfDaysInMonth = dayjs(`${this.active.year}-${this.active.month}-01`).daysInMonth();
			const array = [...Array(numberOfDaysInMonth)];
			this.days.currentMonth = array.map((day, index) => {
				return {
					date: dayjs(`${this.active.year}-${this.active.month}-${index + 1}`).format("YYYY-MM-DD"),
					dayOfMonth: index + 1,
					isCurrentMonth: true
				};
			});
		};

		createDaysForNextMonth = () => {
			const lastDayOfTheMonthWeekday = this.getWeekday(`${this.active.year}-${this.active.month}-${this.days.currentMonth.length}`);
			const nextMonth = dayjs(`${this.active.year}-${this.active.month}-01`).add(1, "month");
			const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday ? 7 - lastDayOfTheMonthWeekday : lastDayOfTheMonthWeekday;
			this.days.nextMonth = [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
				return {
					date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
					dayOfMonth: index + 1,
					isCurrentMonth: false
				};
			});
		};

		createDaysForAllMonths = () => {
			this.days.all = [...this.days.previousMonth, ...this.days.currentMonth, ...this.days.nextMonth];
		};

		addEventListeners = () => {
			this.elements.arrows.previous.addEventListener("click", () => {
					this.updateActive(dayjs(this.active.raw).subtract(1, "month"));
					this.createDays();
					this.createCalendar();
				});
			this.elements.arrows.next.addEventListener("click", () => {
					this.updateActive(dayjs(this.active.raw).add(1, "month"));
					this.createDays();
					this.createCalendar();
				});
		};

		getWeekday = (date) => {
			return dayjs(date).weekday();
		};

};

new Calendar();