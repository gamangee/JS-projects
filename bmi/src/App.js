import { useState } from 'react';
import './App.css';

function App() {
  const [userInfo, setUserInfor] = useState({ weight: '', height: '' });
  const [common, setCommon] = useState(true);
  const [state, setState] = useState('');
  const [submit, setSubmit] = useState(false);

  const handleUserInfo = (e) => {
    const { name, value } = e.target;
    setUserInfor({ ...userInfo, [name]: value });
  };

  const { weight, height } = userInfo;
  const w = parseInt(weight);
  const h = parseFloat(height);
  const bmi = w / (h * h);

  const onSubmit = (e) => {
    e.preventDefault();

    setSubmit(true);

    if (isNaN(bmi) || w <= 0 || h <= 0) {
      alert('적절한 값을 입력하시오');
      return;
    }

    if (bmi < 18.5) {
      setState('저체중');
      setCommon(false);
    } else if (bmi >= 25) {
      setState('과체중');
      setCommon(false);
    } else {
      setState('정상');
    }
  };

  const onReset = (e) => {
    setSubmit(false);
    setUserInfor({ weight: '', height: '' });
  };

  return (
    <form id='form' onSubmit={onSubmit}>
      <h1>BMI 계산기</h1>
      <div className='container'>
        <div className='area weight'>
          <label className='label' htmlFor='w'>
            몸무게(kg)
          </label>
          <input
            type='number'
            className='input'
            name='weight'
            step='0.01'
            min='20'
            value={weight}
            onChange={handleUserInfo}
            readOnly={submit}
          />
        </div>
        <div className='area height'>
          <label className='label' htmlFor='h'>
            신장(m)
          </label>
          <input
            type='number'
            className='input'
            name='height'
            step='0.01'
            min='0.5'
            value={height}
            onChange={handleUserInfo}
            readOnly={submit}
          />
        </div>
        <button type='submit' className='btn'>
          결과
        </button>
      </div>
      {submit && !isNaN(bmi) && (
        <div>
          <meter
            id='meter'
            min='10'
            max='40'
            optimum='20'
            low='18.5'
            high='25'
            value={bmi}
          ></meter>
          <div className='bmiNum'>
            당신의 BMI 지수는 <span id='bmi'>{Math.floor(bmi)}</span>입니다.
          </div>
          <div>
            <strong id='state' className={common ? 'green' : 'coral'}>
              {state}
            </strong>
            입니다.
          </div>
          <button className='btn red' onClick={onReset}>
            초기화
          </button>
        </div>
      )}
    </form>
  );
}

export default App;
