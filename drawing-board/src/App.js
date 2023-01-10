import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AiOutlineRight,
  AiOutlineLeft,
  AiOutlinePlayCircle,
  AiOutlinePauseCircle,
} from 'react-icons/ai';
import './App.css';

const sliderImgUrl = [
  'orange.jpeg',
  'yellow.jpeg',
  'green.jpeg',
  'blue.jpeg',
  'indigo.jpeg',
  'violet.jpeg',
];

function App() {
  const ref = useRef();
  // const [slidePx, setSlidePx] = useState(0);
  // const [slideCount, setSlideCount] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  // const [indexPosition, setIndexPosition] = useState(0);

  const goToNext = () => {
    console.log('currentPosition', currentPosition);
    if (currentPosition === sliderImgUrl.length) {
      setCurrentPosition(0);
    }
    setCurrentPosition((prev) => prev + 1);
    ref.current.style.transform = `translateX(-${
      ref.current.clientWidth * currentPosition
    }px)`;
  };

  const goToPrev = () => {
    if (currentPosition < 0) {
      setCurrentPosition(sliderImgUrl.length - 1);
    }
    setCurrentPosition((prev) => prev - 1);
    ref.current.style.transform = `translateX(${
      ref.current.clientWidth * currentPosition
    }px)`;
  };

  return (
    <div className='slider-wrap'>
      <ul className='slider-list' ref={ref}>
        {sliderImgUrl?.map((el, idx) => (
          <li key={el + idx}>
            {idx}
            <img src={`images/${el}`} alt={`slideImg ${idx + 1}`} />
          </li>
        ))}
      </ul>
      <div className='btn next' onClick={goToNext}>
        <AiOutlineRight />
      </div>
      <div className='btn previous' onClick={goToPrev}>
        <AiOutlineLeft />
      </div>
      <div className='indicator-wrap'>
        <ul>
          {sliderImgUrl?.map((el) => (
            <li key={el}></li>
          ))}
        </ul>
      </div>
      <div className='control-wrap play'>
        <AiOutlinePlayCircle className='play' />
      </div>
    </div>
  );
}

export default App;
