# 그림판

![drawing-board.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e50f5749-8c57-45bc-97ee-6766b16dadca/drawing-board.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230118%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230118T003652Z&X-Amz-Expires=86400&X-Amz-Signature=2ef7393911817dfc4902abf20c90756e88559a021f93c5bbe9a17cde1fac628f&X-Amz-SignedHeaders=host&x-id=GetObject)

# 구현 기능

- FILL/BRUSH/ERASER 모드
- 실행취소, 전체지우기, 미리보기
- 이미지 파일 업로드
- jpg 파일로 저장 및 다운로드
- 입력한 text 더블클릭하여 그림판에 이미지로 보이기

# 새롭게 알게된 점

### 1. 마우스 위치 구하기

위코드에서 팀프로젝트할 때 너네 집 상품태그 기능을 5일동안 고민했던 기억이 났다. 그때는 useRef의 개념도 몰라서 막코딩으로 구현하다가 실패했었다. 결국 멘토님의 도움으로 완성할 수 있었는데 이번에 다시보니 이해가 되고 구현도 간단하게 했다.

```jsx
const getMousePosition = (event) => {
  const boundaries = canvasRef.current.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
};
```

### 2. 그림판 캔버스 초기화 할 때는 useEffect 사용하기

```jsx
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  setGetCtx(ctx);
}, []);
```

그림판 안에서 하는 활동들은 변화를 감지하여 지속적으로 랜더링해야 한다. 하지만 그림판 캔버스 틀 자체는 변할 이유가 전혀 없다. 그렇기 때문에 useEffect를 사용하여 최초 랜더링 했을 때만 변화를 감지해서 그려주도록 처리했다.

# 작업하면서 해결하지 못한 점

### 실행 취소 시 점이 남는 현상

![drawing-board-undo.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ec916280-cb49-494e-a307-22fe9dbc1fac/drawing-board-undo.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230118%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230118T005144Z&X-Amz-Expires=86400&X-Amz-Signature=cd64d7e49e351e59e94761936fbce6f9b380a6978a7f5b84647eca4879ee3b87&X-Amz-SignedHeaders=host&x-id=GetObject)

실행취소를 하면 최초 마우스 클릭한 지점의 포인트가 하나의 획으로 기억해서 지워지지 않는 현상을 발견했다. 자바스크립트로 작업했을 때는 문제가 없었는데 리액트로 작업해보니 이런 현상이 생겼다. 이번엔 실행취소 기능을 구현한 것에 의의를 두고 마무리했다. 조금 더 성장해서 버그를 해결할 수 있는 날이 오기늘.
