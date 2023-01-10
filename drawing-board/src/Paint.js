import { useEffect, useRef, useState } from 'react';
import './Paint.css';

import React from 'react';

const colorPalette = [
  '#e74c3c',
  '#f39c12',
  '#f1c40f',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#bdc3c7',
  '#2c3e50',
];

const brushPanel = [
  'brush',
  'eraser',
  'navigator',
  'undo',
  'clear',
  'download',
];

export default function Paint() {
  const canvasRef = useRef(null);
  const brushSizeRef = useRef(null);
  const [getCtx, setGetCtx] = useState(null);
  const [isPainting, setIsPainting] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [isBrushMode, setIsBrushMode] = useState(false);
  const [undo, setUndo] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    setGetCtx(ctx);
  }, []);

  const initCanvasBackGround = () => {
    getCtx.fillStyle = '#ffffff';
    getCtx.fillRect(
      0,
      0,
      getCtx.canvas.clientWidth,
      getCtx.canvas.clientHeight
    );
  };

  const onMouseDown = (e) => {
    setIsPainting(true);
    const currentPosition = getMousePosition(e);
    getCtx.beginPath();
    getCtx.moveTo(currentPosition.x, currentPosition.y);
    getCtx.lineCap = 'round';
    getCtx.lineWidth = brushSize;
    getCtx.lineTo(currentPosition.x, currentPosition.y);
    getCtx.stroke();
  };

  const onMouseUp = () => {
    setIsPainting(false);
  };

  const onMouseLeave = () => {
    setIsPainting(false);
  };

  const getMousePosition = (event) => {
    const boundaries = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - boundaries.left,
      y: event.clientY - boundaries.top,
    };
  };

  const onMouseMove = (e) => {
    if (!isPainting) return;
    const currentPosition = getMousePosition(e);
    getCtx.lineTo(currentPosition.x, currentPosition.y);
    getCtx.stroke();
  };

  const handleBrushSize = (e) => {
    setBrushSize(e.target.value);
    getCtx.lineWidth = brushSize;
    brushSizeRef.current.style.width = `${brushSize}px`;
    brushSizeRef.current.style.height = `${brushSize}px`;
  };

  const handleColors = (e) => {
    const color = e.target.style.backgroundColor;
    getCtx.strokeStyle = color;
    brushSizeRef.current.style.backgroundColor = color;
    getCtx.fillStyle = getCtx.strokeStyle;
  };

  const handleColorPicker = (e) => {
    getCtx.strokeStyle = e.target.value;
    brushSizeRef.current.style.backgroundColor = e.target.value;
  };

  const handlePanel = (e) => {
    if (e.target.id === 'brush') {
      setIsBrushMode((prev) => !prev);
      e.target.classList.toggle('brush');
    }
    if (e.target.id === 'eraser') {
      e.target.classList.toggle('eraser');
    }
    if (e.target.id === 'navigator') {
      e.target.classList.toggle('navigator');
    }
    if (e.target.id === 'undo') {
      e.target.classList.toggle('undo');
      if (undo.length === 0) {
        alert('실행취소 불가!');
        return;
      }

      console.log(undo);
      const lastDo = undo.length - 1;
      let previousDataUrl = setUndo(undo.filter((_, i) => i === lastDo));
      console.log(previousDataUrl);
    }
    if (e.target.id === 'clear') {
      e.target.classList.toggle('clear');
      getCtx.clearRect(
        0,
        0,
        getCtx.canvas.clientWidth,
        getCtx.canvas.clientHeight
      );
      initCanvasBackGround();
    }
    if (e.target.id === 'download') {
      e.target.classList.toggle('download');
      e.target.children[0].href = canvasRef.current.toDataURL('image/jpeg', 1);
      e.target.children[0].download = 'example.jpeg';
      e.target.children[0].click();
    }
  };

  return (
    <div className='container'>
      <ul className='colors' onClick={handleColors}>
        {colorPalette.map((el, idx) => (
          <li key={idx} className='color' style={{ backgroundColor: el }}></li>
        ))}
        <input
          type='color'
          className='colorPicker'
          onChange={handleColorPicker}
        />
      </ul>
      <canvas
        className='canvas'
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        width='800'
        height='800'
      ></canvas>
      <ul className='panels' onClick={handlePanel}>
        {isBrushMode && (
          <div className='brushPanel'>
            <div className='brushSizeContainer'>
              <div className='brushSize' ref={brushSizeRef}></div>
            </div>
            {brushSize}px
            <input
              type='range'
              onChange={handleBrushSize}
              value={brushSize}
              className='brushRange'
              min='10'
              max='100'
            />
          </div>
        )}
        {brushPanel.map((el, idx) => (
          <li key={idx} className='panel'>
            <button id={el} className={`panelBtn ${el}`}>
              {el}
              {el === 'download' && <a href='html'></a>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
