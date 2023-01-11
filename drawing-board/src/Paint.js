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

const controlPanel = [
  'brush',
  'eraser',
  'undo',
  'clear',
  'download',
  'navigator',
];

export default function Paint() {
  const canvasRef = useRef(null);
  const brushSizeRef = useRef(null);
  const [naviImg, setNaviImg] = useState('');
  const [mode, setMode] = useState('NONE');
  const [getCtx, setGetCtx] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [showBrushPanel, setShowBrushPanel] = useState(false);
  const [showNaviPanel, setshowNaviPanel] = useState(false);
  const [undo, setUndo] = useState([]);
  const [pickedColor, setPickedColor] = useState('#000000');

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

  const getMousePosition = (event) => {
    const boundaries = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - boundaries.left,
      y: event.clientY - boundaries.top,
    };
  };

  const onMouseDown = (e) => {
    if (mode === 'NONE') return;
    setIsMouseDown(true);
    const currentPosition = getMousePosition(e);
    getCtx.beginPath();
    getCtx.moveTo(currentPosition.x, currentPosition.y);
    getCtx.lineCap = 'round';

    if (mode === 'BRUSH') {
      getCtx.lineWidth = brushSize;
      getCtx.strokeStyle = pickedColor;
    } else if (mode === 'ERASER') {
      getCtx.lineWidth = 50;
      getCtx.strokeStyle = '#ffffff';
    }

    getCtx.lineTo(currentPosition.x, currentPosition.y);
    getCtx.stroke();

    saveState();
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) return;
    const currentPosition = getMousePosition(e);
    getCtx.lineTo(currentPosition.x, currentPosition.y);
    getCtx.stroke();
  };

  const onMouseUp = () => {
    if (mode === 'NONE') return;
    setIsMouseDown(false);
    updateNavigator();
  };

  const onMouseLeave = () => {
    if (mode === 'NONE') return;
    setIsMouseDown(false);
    updateNavigator();
  };

  const onMouseOut = () => {
    if (mode === 'NONE') return;
    setIsMouseDown(false);
    updateNavigator();
  };

  const handleBrushSize = (e) => {
    setBrushSize(e.target.value);
    getCtx.lineWidth = brushSize;
    brushSizeRef.current.style.width = `${brushSize}px`;
    brushSizeRef.current.style.height = `${brushSize}px`;
  };

  const handleColors = (e) => {
    if (mode === 'NONE') return;
    setPickedColor(e.target.id);
    getCtx.strokeStyle = pickedColor;
    getCtx.fillStyle = getCtx.strokeStyle;
  };

  const handleColorPicker = (e) => {
    if (mode === 'NONE') return;
    setPickedColor(e.target.value);
    getCtx.strokeStyle = pickedColor;
    brushSizeRef.current.style.backgroundColor = pickedColor;
  };

  const updateNavigator = () => {
    setNaviImg(canvasRef.current.toDataURL());
  };

  const saveState = () => {
    const undo = canvasRef.current.toDataURL();
    setUndo((prev) => [...prev, undo]);
  };

  const handlePanel = (e) => {
    if (e.target.id === 'brush') {
      e.target.classList.toggle('brush');
      const modeActive = e.target.classList.contains('brush');
      setMode(modeActive ? 'BRUSH' : 'NONE');
      getCtx.canvas.style.cursor = modeActive ? 'crosshair' : 'default';
      setShowBrushPanel((prev) => !prev);
      e.target.classList.remove('eraser');
    }

    if (e.target.id === 'eraser') {
      e.target.classList.toggle('eraser');
      const modeActive = e.target.classList.contains('eraser');
      setMode(modeActive ? 'ERASER' : 'NONE');
      getCtx.canvas.style.cursor = modeActive ? 'crosshair' : 'default';
      setShowBrushPanel(false);
      e.target.classList.remove('brush');
    }

    if (e.target.id === 'navigator') {
      e.target.classList.toggle('navigator');
      setshowNaviPanel((prev) => !prev);
      updateNavigator();
    }

    if (e.target.id === 'undo') {
      if (undo.length === 0) {
        alert('실행취소 불가!');
        return;
      }

      setUndo(undo.filter((_, i, a) => i !== a.length - 1));
      let previousImg = new Image();
      previousImg.onload = () => {
        getCtx.clearRect(
          0,
          0,
          getCtx.canvas.clientWidth,
          getCtx.canvas.clientHeight
        );
        getCtx.drawImage(
          previousImg,
          0,
          0,
          getCtx.canvas.clientWidth,
          getCtx.canvas.clientHeight,
          0,
          0,
          getCtx.canvas.clientWidth,
          getCtx.canvas.clientHeight
        );
      };
      previousImg.src = undo[undo.length - 1];
    }

    if (e.target.id === 'clear') {
      getCtx.clearRect(
        0,
        0,
        getCtx.canvas.clientWidth,
        getCtx.canvas.clientHeight
      );
      initCanvasBackGround();
      setUndo([]);
      updateNavigator();
    }

    if (e.target.id === 'download') {
      e.target.children[0].href = canvasRef.current.toDataURL('image/jpeg', 1);
      e.target.children[0].download = 'example.jpeg';
      e.target.children[0].click();
    }
  };

  return (
    <div className='container'>
      <ul className='colors'>
        {colorPalette.map((el, idx) => (
          <li
            key={idx}
            className='color'
            id={el}
            style={{ backgroundColor: el }}
            onClick={handleColors}
          ></li>
        ))}
        <input
          type='color'
          className='colorPicker'
          value={pickedColor}
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
        onMouseOut={onMouseOut}
        width='800'
        height='800'
      ></canvas>
      <ul className='panels'>
        {showBrushPanel && (
          <div className='brushPanel'>
            <div className='brushSizeContainer'>
              <div
                className='brushSize'
                ref={brushSizeRef}
                style={{ backgroundColor: pickedColor }}
              ></div>
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
        {controlPanel.map((el, idx) => (
          <li key={idx} className='panel' onClick={handlePanel}>
            <button id={el} className='panelBtn'>
              {el}
              {el === 'download' && <a></a>}
            </button>
            {el === 'navigator' && showNaviPanel && (
              <div className='navigatorImg'>
                <img src={naviImg} alt='navigateImg' className='navImg' />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
