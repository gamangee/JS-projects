class DatePicker {
  monthData = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // 현재 보여지는 달력 날짜
  #calendarDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  // 사용자가 선택한 달력 날짜
  selectedDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  datePickerEl;
  dateInputEl;
  calendarMonthEl;
  montnContentEl;
  nextBtnEl;
  prevBtnEl;
  calendarDatesEl;

  constructor() {
    this.initCalendarDate();
    this.initSelectedDate();
    this.assignElement();
    this.setDateInput();
    this.addEvent();
  }

  // select한 날짜 정보 초기화
  initSelectedDate() {
    this.selectedDate = { ...this.#calendarDate };
  }

  // date input창에 날짜 정보 format
  setDateInput() {
    this.dateInputEl.textContent = this.formateDate(this.selectedDate.data);
    // input의 value에 초기값을 넣어 첫화면에서도 보이게 만들기
    this.dateInputEl.dataset.value = this.selectedDate.data;
  }

  initCalendarDate() {
    const data = new Date();
    const date = data.getDate();
    const month = data.getMonth();
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  assignElement() {
    this.datePickerEl = document.getElementById('date-picker');
    this.dateInputEl = this.datePickerEl.querySelector('#date-input');
    this.calendarEl = this.datePickerEl.querySelector('#calendar');
    this.calendarMonthEl = this.calendarEl.querySelector('#month');
    this.monthContentEl = this.calendarMonthEl.querySelector('#content');
    this.nextBtnEl = this.calendarMonthEl.querySelector('#next');
    this.prevBtnEl = this.calendarMonthEl.querySelector('#prev');
    this.calendarDatesEl = this.calendarEl.querySelector('#dates');
  }

  addEvent() {
    this.dateInputEl.addEventListener('click', this.toggleCalendar.bind(this));
    this.nextBtnEl.addEventListener('click', this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener('click', this.moveToPrevMonth.bind(this));
    this.calendarDatesEl.addEventListener(
      'click',
      this.onClickSelectDate.bind(this),
    );
  }

  // 사용자가 달력에 select한 날짜 표시
  onClickSelectDate(event) {
    const eventTarget = event.target;
    if (eventTarget.dataset.date) {
      // select 하기 전 초기화
      this.calendarDatesEl
        .querySelector('.selected')
        ?.classList.remove('selected');
      // select 하면 달력에 표시
      eventTarget.classList.add('selected');
      // select한 날짜 정보 update
      this.selectedDate = {
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          eventTarget.dataset.date,
        ),
        year: this.#calendarDate.year,
        month: this.#calendarDate.month,
        date: eventTarget.dataset.date,
      };
      // input창에 select한 날짜 update
      this.setDateInput();
      // 달력 안보이게
      this.calendarEl.classList.remove('active');
    }
  }

  // 날짜 정보 format
  formateDate(dateData) {
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let year = dateData.getFullYear();
    return `${year}/${month}/${date}`;
  }

  // 이전 달로 이동 버튼
  moveToNextMonth() {
    this.#calendarDate.month++;
    // 13월은 없다
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }
    this.updateMonth();
    this.updateDates();
  }

  // 다음 달로 이동 버튼
  moveToPrevMonth() {
    this.#calendarDate.month--;
    // 0월은 없다
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateMonth();
    this.updateDates();
  }

  toggleCalendar() {
    // select한 날짜 보여지는 달력에서 기억하기
    if (this.calendarEl.classList.contains('active')) {
      this.#calendarDate = { ...this.selectedDate };
    }
    this.calendarEl.classList.toggle('active');
    this.updateMonth();
    this.updateDates();
  }

  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    }`;
  }

  updateDates() {
    // month마다 day수가 다르기 때문에 전/후의 달력을 보려면 초기화를 먼저 해준다.
    this.calendarDatesEl.innerHTML = '';
    // 0000년 00월의 day수 구하기
    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0,
    ).getDate();
    // month마다 동적으로 day수를 달력에 채우기
    const fragment = new DocumentFragment();
    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement('div');
      dateEl.classList.add('date');
      dateEl.textContent = i + 1;
      dateEl.dataset.date = i + 1;
      fragment.appendChild(dateEl);
    }
    // month마다 1일이 시작하는 요일 구하기
    fragment.firstChild.style.gridColumnStart =
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1;
    this.calendarDatesEl.appendChild(fragment);
    // 토요일은 파란색으로 표시
    this.colorSaturday();
    // 일요일은 빨간색으로 표시
    this.colorSunday();
    // 오늘 날짜 표시
    this.markToday();
    // select한 날짜를 달력에 표시
    this.markSelectedDate();
  }

  // select한 날짜를 dataset에 담고 scss로 class를 붙여서 select한 날짜만 style 다르게 주기
  markSelectedDate() {
    if (
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectedDate.date}']`)
        .classList.add('selected');
    }
  }

  // 오늘 날짜 표시
  markToday() {
    // 현재의 날짜
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    if (
      currentYear === this.#calendarDate.year &&
      currentMonth === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${today}']`)
        .classList.add('today');
    }
  }

  // **동적으로 토요일만 파란색으로 표기하는 방법**
  // 1. 0000년 00월 1일이 무슨 요일(=x)인지 파악
  // 2. 7-x(=y) : 1주차 토요일이 몇 일인지 파악
  // 3-1. 7n+y : month의 토요일 day 모두 파악
  // 3-2. 여기서 n은 nth-child의 n이므로 7n+y가 총 days를 넘지 않는다.
  // 4. month의 토요일 day에 for문으로 color를 blue로 style을 준다.
  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`,
    );
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = 'blue';
    }
  }

  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        (8 -
          new Date(
            this.#calendarDate.year,
            this.#calendarDate.month,
            1,
          ).getDay()) %
        7
      })`,
    );
    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = 'red';
    }
  }
}

new DatePicker();
