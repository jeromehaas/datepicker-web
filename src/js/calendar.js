import dayjs from "dayjs";
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

class DatePicker {

	constructor() {
	
		this.selected = {
			month: null,
			year: null,
			daysInMonth: null,
			dates: null,
			firstDayOfMonthWeekday: null
		};

		this.today = dayjs();
		this.choosenDates = [];
		
		this.labels = {
			month: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septempber', 'Oktober', 'November', 'Dezember'],
			weekdays: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
		};
		
		
		this.elements = {
			dates: {
				container: document.querySelector('.calendar__dates'),
				items: null,
			},
			header: {
				month: document.querySelector('.calendar__header .date__month'), 
				year: document.querySelector('.calendar__header .date__year'), 
				arrows: {
					previous: document.querySelector('.calendar__header .arrow--previous'),
					next: document.querySelector('.calendar__header .arrow--next'),
				},
			},
		};

	};
	
	init = () => {
		this.updateCurrentMonth();
		this.addEventListeners();
	};

	updateCurrentMonth = (direction) => {
		switch (direction) {
			case 'next': {
				const updatedDate = dayjs(`${this.selected.year}-${this.selected.month}-01`).add(1, 'month');
				this.selected.month = dayjs(updatedDate).format("M");
				this.selected.year = dayjs(updatedDate).format("YYYY");
				this.printCalendar();
				break;
			}
			case 'previous': {
				const updatedDate = dayjs(`${this.selected.year}-${this.selected.month}-01`).subtract(1, 'month');
				this.selected.month = dayjs(updatedDate).format("M");
				this.selected.year = dayjs(updatedDate).format("YYYY");
				console.log('previus')
				this.printCalendar();
				break;
			}
			default: {
				this.selected.month = dayjs().format("M");
				this.selected.year = dayjs().format("YYYY");
				this.printCalendar();
			}
		}
	}
	


	printCalendar = () => {
		this.selected.amountOfDaysInMonth = this.getAmountOfDaysOfSelectedMonth();
		this.selected.firstDayOfMonthWeekday = this.getFirstDayOfSelectedMonthWeekday();
		this.calculateDatesOfSelectedMonth();
		this.printDates();
		this.printHeader();
	};	

	addEventListeners = () => {
		this.elements.header.arrows.previous.addEventListener('click', () => this.updateCurrentMonth('previous'));
		this.elements.header.arrows.next.addEventListener('click', () => this.updateCurrentMonth('next'));
	};

	chooseDate = () => {
		const element = event.target;
		const date = event.target.getAttribute('data-date');
		element.classList.add('dates__item--choosen');
		this.choosenDates.push(date);
	}

	getFirstDayOfSelectedMonthWeekday = () => {
		return dayjs(`${this.selected.year}-${this.selected.month}-01`).weekday();
	}

	getAmountOfDaysOfSelectedMonth = () => {
		return dayjs(`${this.selected.year}-${this.selected.month}-01`).daysInMonth();
	};
	
	calculateDatesOfSelectedMonth = () => {
		this.selected.dates = [];
		for (let index = 1; index < this.selected.firstDayOfMonthWeekday; index++) { 
			this.selected.dates.push({ date: null, index: null }) 
		};
		for (let index = 1; index < this.selected.amountOfDaysInMonth; index++) { 
			this.selected.dates.push({ date: dayjs(`${this.selected.year}-${this.selected.month}-${index}`).format("YYYY-MM-DD"), dayOfMonth: index }
		)};
		for (let index = this.selected.dates.length; index < 35; index++) { 
			this.selected.dates.push({ date: null, index: null }) 
		};
	};

	printDates = () => {
		this.elements.dates.container.innerHTML = '';
		this.selected.dates.map((item) => {
			const dateItem = document.createElement('p');
			const today = dayjs().format("YYYY-MM-DD");
			const daysBetweenTodayAndDate = dayjs().diff(item.date, 'day');
			dateItem.classList.add('dates__item');
				if (item.date === today) { dateItem.classList.add('dates__item--today')};
				if (daysBetweenTodayAndDate > 0) { dateItem.classList.add('dates__item--past')};
				if (daysBetweenTodayAndDate < 0) { dateItem.classList.add('dates__item--future')}
				if (item.dayOfMonth === null) dateItem.classList.add('dates__item--empty');
				if (item.date !== null) dateItem.innerText = item.dayOfMonth;
				if (item.date !== null) dateItem.setAttribute('data-date', item.date);
				if (item.date !== null && daysBetweenTodayAndDate <= 0) dateItem.addEventListener('click', this.chooseDate);
				console.log(this.choosenDates);
				console.log(item.date);
				if (this.choosenDates.includes(item.date) 
				) dateItem.classList.add('dates__item--choosen');
			this.elements.dates.container.appendChild(dateItem);
			});
		};

		printHeader = () => {
			this.elements.header.month.innerHTML = this.labels.month[this.selected.month - 1];
			this.elements.header.year.innerHTML = this.selected.year;
		}

};

new DatePicker().init();