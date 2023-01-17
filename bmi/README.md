# BMI 계산기

![bmi.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c8e9c8cc-93da-469d-a41f-7257d9c4b580/bmi.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230117%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230117T125805Z&X-Amz-Expires=86400&X-Amz-Signature=af0a7a1bc339b13439bdf18624110e514a9e63d25be3bef0549f3a1deb58e1fd&X-Amz-SignedHeaders=host&x-id=GetObject)

# 구현 기능

몸무게와 신장을 입력하여 bmi 지수를 계산하고 체중 상태를 알려주는 BMI 계산기

# 작업하면서 신기했던 점

### 바닐라 자바스크립트와 리액트 차이

순수 자바스크립트로 구현해보니 생각보다 간단해서 리액트로도 만들어보았다. 확실히 태그 하나 하나를 `getElementById`, `querySelector`로 불러오지 않아도 되니 세상 간단했다. 집에 건조기가 없다가 새로 하나 장만해서 가사노동이 줄어든 느낌이랄까.

`예시`

```jsx
import { useState } from 'react';

function App() {
  const [submit, setSubmit] = useState(false);

// 결과 버튼을 눌렀을 때
// 변수 submit 상태를 true로 바꾸기
	const onSubmit = (e) => {
    setSubmit(true);
	}

// 초기화 버튼을 눌렀을 때
// 변수 submit 상태를 false로 바꾸기
	const onReset= (e) => {
    setSubmit(false);
	}

	return(
// 변수 submit이 true 일 때
// <input> 태그에 더이상 입력 못하도록 막기
		<input readOnly={submit} />

// 변수 submit이 true 일 때
// <div> 태그 보이기
		{submit && <div>결과</div>}
	);
}
```

useState로 boolean(true/false)값으로 할 수 있는 작업이 많았다.

# 새롭게 알게된 점

### 여러 input값 한개의 useState로 관리 하기

신장과 몸무게를 모두 입력한 후에야 bmi 지수를 계산할 수 있다. 신장이나 몸무게 하나의 값만 변화한다고 해서 랜더링을 할 필요가 없는 셈이다.

`예시`

```jsx
import { useState } from 'react';

function App() {
  const [userInfo, setUserInfor] = useState({ weight: '', height: '' });

  // 구조분해할당
  const { weight, height } = userInfo;

  const handleUserInfo = (e) => {
    // e.target 에서 name 과 value 를 추출
    const { name, value } = e.target;
    // 기존 input 값을 복사한 뒤
    // name키를 가진 값을 value로 설정
    setUserInfor({ ...userInfo, [name]: value });
  };

  return (
    <div className='container'>
      <div className='area weight'>
        <label className='label' htmlFor='w'>
          몸무게(kg)
        </label>
        <input value={weight} onChange={handleUserInfo} />
      </div>
      <div className='area height'>
        <label className='label' htmlFor='h'>
          신장(m)
        </label>
        <input value={height} onChange={handleUserInfo} />
      </div>
      <button type='submit' className='btn'>
        결과
      </button>
    </div>
  );
}
```

input의 onChange에 각각 다른 useState를 생성해서 넣어주는 것이 아니라 공통의 useState를 생성하여 관리했다.
