export class Keyboard {
  #containerEl;
  #swithEl;
  #fontSelectEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;

  // 키보드가 눌린 상태 변화
  #keyPress = false;
  // 마우스가 눌린 상태 변화
  #mouseDown = false;

  constructor() {
    this.#assginElement();
    this.#addEvent();
  }

  #assginElement() {
    this.#containerEl = document.getElementById("container");
    this.#swithEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("input");
  }

  #addEvent() {
    // dark mode
    this.#swithEl.addEventListener("change", this.#onChangeTheme);
    // select fonts
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    // keyboard events
    document.addEventListener("keydown", this.#onKeyDown.bind(this));
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    // input event
    this.#inputEl.addEventListener("input", this.#onInput);
    // mouse events
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    // 키보드 밖에서 마우스를 땔 수 있기 때문에 mouseup event는 document에서부터 탐색할 수 있게 해준다.
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  #onMouseUp(e) {
    // mouse가 동작할 때는 keyboard 동작을 못하도록
    if (this.#keyPress) return;
    this.#mouseDown = false;

    const keyEl = e.target.closest("div.key");
    // undefined = falsy
    // !undefined = true
    // !!undefined = false
    // !! boolean 값으로 type casting 시킨다
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;
    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      this.#inputEl.value += val;
    }
    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    }
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }
    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }

  #onMouseDown(e) {
    // mouse가 동작할 때는 keyboard 동작을 못하도록
    if (this.#keyPress) return;
    this.#mouseDown = true;

    // mousedown했을 때 event target에서 가장 가까운 상위 요소가 div이고 class가 key인 요소가 있다면,
    // class 이름이 active인 속성을 추가해준다.
    e.target.closest("div.key")?.classList.add("active");
  }

  #onInput(e) {
    e.target.value = e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
  }

  #onKeyDown(e) {
    // keyboard가 동작할 때는 mouse가 동작하지 못하도록
    if (this.#mouseDown) return;
    this.#keyPress = true;
    // console.log(e.code);
    // console.log(e.key);

    // toggle은 t/f 값에 따라 class를 떼었다 붙일 수 있다.
    // toggle true이면 error class를 붙이고, false이면 error class를 제거한다.
    this.#inputGroupEl.classList.toggle(
      "error",
      // /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.key)
      e.key === "Process"
    );
    // 정규식 표현을 이용하여 한글 사용 불가
    // test()메서드 : 주어진 문자열이 정규 표현식을 만족하는지 판별 (t/f 반환)
    console.log(e.key, /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.key));

    this.#keyboardEl
      .querySelector(`[data-code=${e.code}]`)
      // ?(옵셔널체이닝) 사용
      // data-code에 입력한 값이 없으면 undefined로 출력 (error 발생X)
      ?.classList.add("active");
  }

  #onKeyUp(e) {
    // keyboard가 동작할 때는 mouse가 동작하지 못하도록
    if (this.#mouseDown) return;
    this.#keyPress = false;

    this.#keyboardEl
      .querySelector(`[data-code=${e.code}]`)
      ?.classList.remove("active");
  }

  #onChangeTheme(e) {
    document.documentElement.setAttribute(
      "theme",
      e.target.checked ? "dark-mode" : ""
    );
  }

  #onChangeFont(e) {
    document.body.style.fontFamily = e.target.value;
  }
}
