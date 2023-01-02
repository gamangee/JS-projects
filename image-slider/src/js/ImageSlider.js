export default class ImageSlider {
  #currentPostion = 0;

  #slideNumber = 0;

  #slideWidth = 0;

  #intervalId;

  #autoPlay = true;

  sliderWrapEl;

  sliderListEl;

  nextBtnEl;

  previousBtnEl;

  indicatorWrapEl;

  controlWrapEl;

  constructor() {
    this.assignElement();
    this.initSliderNumber();
    this.initSlideWidth();
    this.initSliderListWidth();
    this.addEvent();
    this.createIndicator();
    this.setIndicator();
    this.initAutoplay();
  }

  assignElement() {
    this.sliderWrapEl = document.getElementById('slider-wrap');
    this.sliderListEl = this.sliderWrapEl.querySelector('#slider');
    this.nextBtnEl = this.sliderWrapEl.querySelector('#next');
    this.previousBtnEl = this.sliderWrapEl.querySelector('#previous');
    this.indicatorWrapEl = this.sliderWrapEl.querySelector('#indicator-wrap');
    this.controlWrapEl = this.sliderWrapEl.querySelector('#control-wrap');
  }

  // setInverval 함수를 이용하여 3초마다 계속 slide 이미지 변경
  initAutoplay() {
    this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
  }

  initSliderNumber() {
    this.#slideNumber = this.sliderListEl.querySelectorAll('li').length;
  }

  initSlideWidth() {
    this.#slideWidth = this.sliderListEl.clientWidth;
  }

  initSliderListWidth() {
    this.sliderListEl.style.width = `${this.#slideNumber * this.#slideWidth}px`;
  }

  addEvent() {
    // 전/후 버튼 클릭 시 slide 움직임
    this.nextBtnEl.addEventListener('click', this.moveToRight.bind(this));
    this.previousBtnEl.addEventListener('click', this.moveToLeft.bind(this));
    // indicator 클릭 시 slide 움직임
    this.indicatorWrapEl.addEventListener(
      'click',
      this.onClickIndicator.bind(this),
    );
    // 재생/일시정지 버튼 클릭 시 slide 움직임
    this.controlWrapEl.addEventListener('click', this.togglePlay.bind(this));
  }

  // image slide 재생/일시정지 버튼 활성화
  togglePlay(event) {
    // play 버튼을 눌렀을 경우
    if (event.target.dataset.status === 'play') {
      this.#autoPlay = true;
      // 버튼 모양 변경
      this.controlWrapEl.classList.add('play');
      this.controlWrapEl.classList.remove('pause');
      // slide 자동 재생
      this.initAutoplay();
      // pause 버튼 눌렀을 경우
    } else if (event.target.dataset.status === 'pause') {
      this.#autoPlay = false;
      // 버튼 모양 변경
      this.controlWrapEl.classList.remove('play');
      this.controlWrapEl.classList.add('pause');
      // slide 일시정지
      clearInterval(this.#intervalId);
    }
  }

  // indicator 클릭 시
  onClickIndicator(event) {
    const indexPosition = parseInt(event.target.dataset.index, 10);
    // 클릭한 indicator dataset 값이 slide 현재 위치와 같을 때
    // image slide 위치 이동
    if (Number.isInteger(indexPosition)) {
      this.#currentPostion = indexPosition;
      this.sliderListEl.style.left = `-${
        this.#slideWidth * this.#currentPostion
      }px`;
      // indicator 활성화
      this.setIndicator();
    }
  }

  moveToRight() {
    this.#currentPostion += 1;
    // slider가 끝나면 다시 처음 부터
    if (this.#currentPostion === this.#slideNumber) {
      this.#currentPostion = 0;
    }
    this.sliderListEl.style.left = `-${
      this.#slideWidth * this.#currentPostion
    }px`;
    // 자동 재생중일 때 time-reset
    if (this.#autoPlay) {
      clearInterval(this.#intervalId);
      this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
    }
    // indicator 활성화
    this.setIndicator();
  }

  moveToLeft() {
    this.#currentPostion -= 1;
    // 처음 이미지 보다 더 전으로 가려고 할 때 마지막 이미지로
    if (this.#currentPostion === -1) {
      this.#currentPostion = this.#slideNumber - 1;
    }
    this.sliderListEl.style.left = `-${
      this.#slideWidth * this.#currentPostion
    }px`;
    // 자동 재생중일 때 time-reset
    if (this.#autoPlay) {
      clearInterval(this.#intervalId);
      this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
    }
    this.setIndicator();
  }

  // slide 개수에 따라 동적으로 indicator 생성
  createIndicator() {
    const docFragment = document.createDocumentFragment();
    for (let i = 0; i < this.#slideNumber; i += 1) {
      const li = document.createElement('li');
      li.dataset.index = i;
      docFragment.appendChild(li);
    }
    this.indicatorWrapEl.querySelector('ul').appendChild(docFragment);
  }

  // indicator 초기화 후 활성화
  setIndicator() {
    this.indicatorWrapEl.querySelector('li.active')?.classList.remove('active');
    this.indicatorWrapEl
      .querySelector(`ul li:nth-child(${this.#currentPostion + 1})`)
      .classList.add('active');
  }
}
