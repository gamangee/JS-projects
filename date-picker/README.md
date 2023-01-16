# 달력

![date-picker.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9c2290cd-fb4d-4639-ade6-74ecdb68ff0e/date-picker.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230116%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230116T073817Z&X-Amz-Expires=86400&X-Amz-Signature=c6fa3306e2d26e5eac888c9f9acebd4bd76d1887d5643b80552e178d2c621e9c&X-Amz-SignedHeaders=host&x-id=GetObject)

# 구현 기능

- Date 객체로 기본 달력 구현
  - 달(month)마다 다른 날짜(day) 수 동적으로 구현
  - 매달 1일에 시작하는 요일 구하기
  - 토요일은 파란색, 일요일은 빨간색으로 주말 구분
- 오늘 날짜와 사용자가 선택한 날짜 다른 색깔로 표시

# 작업하면서 어려웠던 점

### 1. 달마다 다른 날짜 수 구하기

Date 객체를 생성해서 날짜를 구할 줄만 알았지 그 외의 방식으로 활용할 생각을 못했었다.

`문제` 1월은 31일까지, 2월은 28일까지 각각의 달마다 날짜가 고정되어 있지 않는다. 매월 날짜수를 세워서 다르게 채워주어야 한다.

`해결`

```jsx
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
```

new Date 함수에 인자로 년도와 월만 넣고 그 달에 대한 날짜수를 구할 수 있다. 그렇게 해서 구한 값을 변수 numberOfDates에 저장한 후 for문을 돌려 하나씩 날짜를 채운다.

### 2. 토요일만 파란식으로 표시하기

`문제` 1주차 토요일이 몇 일인지를 구하고, 2주차부터는 구한 수에 7배수로 더해주면 구할 수 있다.

`해결`

1. 0000년 00월 1일이 무슨 요일(=x)인지 파악
2. 7-x(=y) : 1주차 토요일이 몇 일인지 파악
3. 7n+y : month의 토요일 day 모두 파악
4. 여기서 n은 nth-child의 n이므로 7n+y가 총 days를 넘지 않는다.
5. month의 토요일 day에 for문으로 color를 blue로 style을 준다.

```jsx
const saturdayEls = this.calendarDatesEl.querySelectorAll(
  `.date:nth-child(7n+${
    7 - new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
  })`,
);
for (let i = 0; i < saturdayEls.length; i++) {
  saturdayEls[i].style.color = 'blue';
}
```

# 새롭게 알게된 점

### 1. Snowpack

`컨셉` unbundled during development : 번들링을 하지 않아 webpack보다 빠른 빌드툴

`특징`

- **Snowpack은 번들러가 아니다.**
- 기존의 Webpack, Rollup, Parcel 같은 무겁고 복잡한 번들러보다 번들 소요 시간이 짧다.
- JavaScript의 ESM(ES Modules)을 활용하여 동일 파일을 다시 빌드하지 않는 최초의 빌드 시스템을 생성해 변경사항을 브라우저에 즉시 적용할 수 있다.

### 2. Webpack vs Snowpack

|  | 비교 |
| --- | --- |
| webpack | 파일 1개가 변경될 경우 연관된 모든 파일을 다시 빌드하고 번들링 한다. |
| snowpack | 1. 모든 파일을 단일 파일로 빌드하고 ESM(ES Modules)방식으로 import한다.<br>2. 어떤 파일이 변경되면 그 파일만 새로 빌드한다. |
