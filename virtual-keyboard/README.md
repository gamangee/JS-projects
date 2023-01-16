# 가상 키보드

![virtual-keyboard.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/aafd2bee-12a9-4d98-a05e-ceaa53f5ac97/virtual-keyboard.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230116%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230116T072452Z&X-Amz-Expires=86400&X-Amz-Signature=6750ae3cdd78c0b3f4ec570a9502673e9a62e033d31aefe3e309f47f0195ba66&X-Amz-SignedHeaders=host&x-id=GetObject)

# 구현 기능

- CSS filter모드를 이용한 다크모드 효과 구현
- select태그 option value 값으로 키보드 font 변경
- keydown/keyup, mousedown/mouseup event가 동작할 때 event.key와 event.code가 html data-set에 저장된 값과 일치하면 input 입력창에 event.target.value 값이 보여지는 가상 키보드 구현
- 한글 입력 시 error-message가 나오도록 유효성 체크

# 작업하면서 어려웠던 점

### 1. webpack dev-server에서 favicon이 보이지 않았다.

`초기설정`

html-webpack-plugin을 사용하여 favicon의 경로를 지정해주어 html 파일이 생성될 때 favicon을 자동으로 build하게 해주었다.

❗이렇게 설정할 경우 favicon이 캐시가 되지 않아 보이지 않았다.

```jsx
new HtmlWebpackPlugin({
      title: "keyboard",
      template: "./index.html",
      inject: "body",
      favicon: "./favicon.ico"
    }),
```

`해결`

favicons-webpack-plugin라는 favicon을 detail하게 설정할 수 있는 plugin을 설치해주고, 설정 값에 favicon의 경로와 cache를 허용해주니 드디어 보이게 되었다!

```jsx
new FaviconsWebpackPlugin({
  logo: "./favicon.ico",
  cache: true,
});
```

### 2. 한글을 입력했을 때 error-message가 보여야 하는데 보이지 않았다.

`초기설정`

정규식 test( ) 메소드를 이용하여 event.key가 한글이여서 true 값을 반환할 때 classList의 toggle로 true이면 error class를 붙여 error-message가 보이게 구현하였다.

```jsx
this.#inputGroupEl.classList.toggle("error", e.key);
```

`문제`
한글은 입력했을 때 console 창을 확인해보니, Process라는 값으로 찍혔다.

`시도`

처음에는 한글 입력 모드가 안되는 줄 알고 css에서 input 태그의 속성을 ime-mode를 active로바꿔주었다. 하지만 애초에 크롬은 ime-mode가 허용이 안되거니와 한글 입력은 잘 되는 것을 확인하였다.

`찜찜한 해결`

Process라는 값이 영어이기 때문에 test( ) 메소드의 반환값도 false로 찍히지 않을까 하는 생각에 event.key 값이 Process일 때 error-message를 띄어달라고 하니 브라우저 화면에서는 정상적으로 작동하였다.

```jsx
this.#inputGroupEl.classList.toggle("error", e.key === "Process");
```

# 새롭게 알게된 점

### 1. webpack 설정하기

그동안 webpack이란 단어만 들어봤지 webpack 초기 세팅을 해본 적은 없었다. 이렇게 entry, output, mode, plugin 등을 직접 설정해보니 번들링이 어떤 방식으로 이루어지는지 조금은 이해할 수 있는 기회였다. 다음에는 codespliting, treeshaking 과 같은 고급 기능도 공부해보면 좋을 거 같다.

### 2. this 바인딩 이슈

Class를 만들고 메서드를 정의할 때 event function을 따로 분리할 경우 this의 전역객체가 window로 바인딩 되어버리는 issue가 생긴다. 이럴 경우에는 addEventListener 안에 event 함수에 직접 this를 binding 해주면 정상적으로 작동한다.
