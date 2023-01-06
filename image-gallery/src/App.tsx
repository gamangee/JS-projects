import React, { useState, useCallback } from 'react';
import './App.css';
import ImageBox from './components/ImageBox';
import { useDropzone } from 'react-dropzone';

function App() {
  const [imgList, setImgList] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      for (const file of acceptedFiles) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          setImgList((prev) => [...prev, e.target?.result as string]);
        };
      }
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

        {imgList.map((el, idx) => (
          <ImageBox key={el + idx} src={el} />
        ))}
        <div {...getRootProps()} className='plus-box'>
          <input {...getInputProps()} type='file' />+
        </div>
      </div>
    </div>
  );
}

export default App;
