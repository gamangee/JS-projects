import React, { useRef, useState } from 'react';
import './App.css';
import ImageBox from './components/ImageBox';

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imgList, setImgList] = useState<string[]>([]);
  console.log(imgList);

  return (
    <div className='container'>
      <div className={'gallery-box ' + (imgList.length > 0 && 'row')}>
        {imgList.length === 0 && (
          <div className='text-center'>
            이미지가 없습니다.
            <br />
            이미지를 추가해주세요.
          </div>
        )}
        <input
          type='file'
          ref={inputRef}
          onChange={(e) => {
            if (e.currentTarget.files?.[0]) {
              const file = e.currentTarget.files[0];
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = (e) => {
                setImgList((prev) => [...prev, e.target?.result as string]);
              };
            }
          }}
        />
        {imgList.map((el, idx) => (
          <ImageBox key={el + idx} src={el} />
        ))}
        <div
          className='plus-box'
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          +
        </div>
      </div>
    </div>
  );
}

export default App;
