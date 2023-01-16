# 계산기

![calculator.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b4a4a6bf-1a31-475e-bed4-38fb25d40714/calculator.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230116%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230116T084058Z&X-Amz-Expires=86400&X-Amz-Signature=3691d1567fd0059687a2f42dc70e65052de9c528ad050a9a9e8efb259f1bb0a8&X-Amz-SignedHeaders=host&x-id=GetObject)

# 구현 기능

키보드 이벤트가 아닌 onClick 이벤트만으로 사칙연산이 가능한 계산기 구현

# 작업하면서 어려웠던 점

### 음수일 때와 빼기 일 때 구분하기

`문제` 0보다 작은 음수일 때와 사칙연산 중 빼기 기호가 모양이 같아서 적절한 상황에 쓰이도록 분기 처리를 해주어야 한다.

`해결`

```jsx
// 사칙연산(+,-,*,/) 기호를 입력했을 때
function inputOperator(op) {
  // left 변수에 아무것도 입력하지 않고 처음으로 '-'를 입력했을 때
  if (left === null && op === '-') {
    // left 변수가 '-'이다
    // 음수를 입력할 것이라 감지
    left = '-';
    save();
    return;
  }
  // left 변수가 이미 '-'를 입력한 상태라면
  // 빼기가 아니라 숫자를 입력해주어야 하기 때문에
  // 더이상 '-'를 입력 못하도록 return
  if (left === '-') return;

  // '-' 빼기가 이미 있고 right 변수에 아무것도 입력하지 않은 상태라면
  // right 변수가 '-'이다
  // right 변수가 곧 음수를 입력할 것이라 감지
  if (op === '-' && operator !== null && right === null) {
    right = '-';
    save();
    return;
  }

  // 그 외에 inputOperator 함수의 인자로 들어오는 사직연산 기호는 그대로 받아서 계산해준다.
  operator = op;
  save();
}
```

`-` 기호가 2번 입력했을 때 하나는 빼기 기호이고 하나는 음수를 나타내기 위한 작업이라면 이를 허용해주고 그것이 아니라면 입력을 허용해주지 않는 것으로 처리해주었다.

# 새롭게 알게된 점

### 이게 되네?

컴퓨터(PC)에서 계산기를 열면 키보드도 되고 마우스로 클릭해도 계산을 해준다. 예전에는 그냥 당연하다고 생각했다. 하지만 막상 구현해보니 하나 하나 조건을 걸어서 문제가 없도록처리해주야 했다. 계산기는 정말 쉽고 빠르게 만들어서 자신감을 높이는 미니 프로젝트라고 여겼는데 생각보다 오래 걸리고 생각해내야 하는 포인트들이 많았다.
