# 이미지 슬라이더

![image-slider.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/41ab64cc-42b2-4e0c-8ac6-2f73a81acf76/image-slider.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230116%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230116T073252Z&X-Amz-Expires=86400&X-Amz-Signature=cb2a1dba53dd8d73c24c1c96f7e90e2e64284b9b14cb253777c30f4d4f07f3ae&X-Amz-SignedHeaders=host&x-id=GetObject)

# 구현 기능

- setInterval( ) 메소드를 활용한 autoplay가 가능한 이미지 슬라이드 구현
- 전/후 화살표 버튼, indicator 버튼 클릭 시 슬라이드 이미지 이동
- 재생/일시정지 버튼 클릭 시 autoplay 기능 제어

# 작업하면서 어려웠던 점

### 1. 막막할 땐 크게크게 나누기

처음에 기능 구현을 하려고 고민할 때 무엇부터 구현해야할지가 너무 막막했다.

`문제` 전/후 버튼과 indicator, autoplay 기능이 다 연결되어 있기 때문이다. autoplay 기능을 하다가도 전/후 버튼이나 indicator 버튼을 클릭 하여도 이미지 슬라이더가 다음 이미지로 바뀌기 때문이다.

`나름의 계획`

(1) 전/후 버튼 (2) indicator 버튼 (3) autoplay 기능

우선 기능을 크게 3부분으로 나누고 연관된 부분을 제외하고 독립적으로 기능이 작동하도록 코드를 짰다. 그 후에 이미지 순서, indicator에도 click 이벤트를 주는 등 세세하게 분기처리를 해주었다.

### 2. setInterval()과 clearInterval()은 꼭 1번만 써야 한다?

`문제` autoplay 기능이 잘 되다가 전/후 버튼을 누르면 자기멋대로 휘리릭 지나가 버리는 현상이 발생한다.

`해결` 버튼을 클릭하는 이벤트 함수 안에 자동재생 중일 경우에는 setInterval() 메소드를 다시 초기화하고 재실행하도록 넣어주었다.

```jsx
if (this.#autoPlay) {
  clearInterval(this.#intervalId);
  this.#intervalId = setInterval(this.moveToRight.bind(this), 3000);
}
```

# 새롭게 알게된 점

### 1. npm으로 fontawesome 설치

이전까지는 Font Awesome CDN url 주소를 구글링해서 HTML `<link>` 태그에 삽입해주었다. 아니면 개인 kitcode를 이메일로 받아서 그 주소를 활용했다. 하지만 가끔 버전 호환성 문제 때문에 이미지를 불러오지 못해 계속 다른 이미지를 찾아야하는 번거로움을 겪었던 적이 한두번이 아니였다.

이번에는 npm 패키지 관리자로 쉽게 설치해보았는데 아이콘을 정말 쉽게 가져올 수 있어서 편리했다.

[FontAwesome](https://fontawesome.com/docs/web/setup/packages) 설치

```bash
npm install --save @fortawesome/fontawesome-free
```

### 2. 전제 slider 길이 동적으로 가져오기

slide의 개수와 가로 길이를 CSS로 지정하지 않아도 JS로 동적으로 가져와서 슬라이드의 전체 이미지 가로 길이를 계산할 수 있다. 이렇게 코드를 작성하면 슬라이드 이미지 개수과 길이가 갑자기 변하더라도 쉽게 수정할 수 있기 때문에 유지보수면에서 아주 좋다고 생각한다.

```jsx
// slide 개수
initSliderNumber() {
    this.#slideNumber = this.sliderListEl.querySelectorAll('li').length;
  }

// slide 가로 길이
initSlideWidth() {
    this.#slideWidth = this.sliderListEl.clientWidth;
}

// 전체 slide image 가로 길이 = slide 개수 X slide 가로 길이
initSliderListWidth() {
    this.sliderListEl.style.width = `${this.#slideNumber * this.#slideWidth}px`;
}
```
