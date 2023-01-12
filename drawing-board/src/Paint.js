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
  'draw',
  'brush',
  'eraser',
  'undo',
  'clear',
  'download',
  'navigator',
  'file',
  'text',
];

export default function Paint() {
  const canvasRef = useRef(null);
  const brushSizeRef = useRef(null);
  const [naviImg, setNaviImg] = useState('');
  const [changeMode, setChangeMode] = useState(false);
  const [mode, setMode] = useState('NONE');
  const [getCtx, setGetCtx] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [showBrushPanel, setShowBrushPanel] = useState(false);
  const [showNaviPanel, setshowNaviPanel] = useState(false);
  const [undo, setUndo] = useState([]);
  const [pickedColor, setPickedColor] = useState('#000000');
  const [fileImg, setFileImg] = useState('');
  const [text, setText] = useState('');

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

  const onDoubleClick = (e) => {
    setMode('TEXT');
    if (text !== '') {
      getCtx.save();
      const currentPosition = getMousePosition(e);
      getCtx.lineWidth = 1;
      getCtx.font = '50px serif';
      getCtx.fillText(text, currentPosition.x, currentPosition.y);
      getCtx.restore();
    }
  };

  const onMouseDown = (e) => {
    if (mode === 'NONE') return;
    if (mode === 'FILL') return;
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
      setChangeMode(false);
      setMode('DRAW');
    } else if (mode === 'TEXT') {
      return;
    }

    getCtx.lineTo(currentPosition.x, currentPosition.y);
    getCtx.stroke();

    saveState();
  };

  const onMouseMove = (e) => {
    if (!isMouseDown) return;
    if (mode === 'TEXT') return;
    const currentPosition = getMousePosition(e);
    getCtx.lineTo(currentPosition.x, currentPosition.y);
    getCtx.stroke();
  };

  const isNotDrawingMode = () => {
    if (mode === 'NONE') return;
    setIsMouseDown(false);
    updateNavigator();
  };

  const onCanvasClick = () => {
    if (mode === 'FILL') {
      getCtx.fillStyle = pickedColor;
      getCtx.fillRect(
        0,
        0,
        getCtx.canvas.clientWidth,
        getCtx.canvas.clientHeight
      );
    }
  };

  const handleText = (e) => {
    setText(e.target.value);
    setMode('TEXT');
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
    getCtx.fillStyle = pickedColor;
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

  const onDrawMode = (e) => {
    setChangeMode((prev) => !prev);
    if (changeMode) {
      setMode('DRAW');
      e.target.innerText = 'draw';
    } else {
      setMode('FILL');
      e.target.innerText = 'fill';
    }
  };

  const onBrushMode = (e) => {
    const modeActive = e.target.classList.contains('brush');
    setMode(modeActive ? 'NONE' : 'BRUSH');
    getCtx.canvas.style.cursor = modeActive ? 'crosshair' : 'default';
    setShowBrushPanel((prev) => !prev);
    e.target.classList.remove('eraser');
  };

  const onEraserMode = (e) => {
    const modeActive = e.target.classList.contains('eraser');
    setMode(modeActive ? 'NONE' : 'ERASER');
    getCtx.canvas.style.cursor = modeActive ? 'crosshair' : 'default';
    e.target.classList.remove('brush');
  };

  const onNavigatorMode = (e) => {
    setMode('NAVIGATOR');
    setshowNaviPanel((prev) => !prev);
    updateNavigator();
  };

  const onUndoMode = (e) => {
    setMode('UNDO');
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
  };

  const onClearMode = (e) => {
    setMode('CLEAR');
    getCtx.clearRect(
      0,
      0,
      getCtx.canvas.clientWidth,
      getCtx.canvas.clientHeight
    );
    initCanvasBackGround();
    setUndo([]);
    updateNavigator();
  };

  const onDownloadMode = (e) => {
    setMode('DOWNLOAD');
    e.target.children[0].href = canvasRef.current.toDataURL('image/jpeg', 1);
    e.target.children[0].download = 'example.jpeg';
    e.target.children[0].click();
  };

  const handlePanel = (e) => {
    if (e.target.id === 'draw') {
      onDrawMode(e);
    }

    if (e.target.id === 'brush') {
      onBrushMode(e);
    }

    if (e.target.id === 'eraser') {
      onEraserMode(e);
    }

    if (e.target.id === 'navigator') {
      onNavigatorMode(e);
    }

    if (e.target.id === 'undo') {
      onUndoMode(e);
    }

    if (e.target.id === 'clear') {
      onClearMode(e);
    }

    if (e.target.id === 'download') {
      onDownloadMode(e);
    }

    if (e.target.id === 'file') {
      setMode('FILE');
    }

    if (e.target.id === 'test') {
      setMode('TEXT');
    }
  };

  const onFileChange = (e) => {
    console.log(e.target.value);
    setFileImg(e.target.value);
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      getCtx.drawImage(
        image,
        0,
        0,
        getCtx.canvas.clientWidth,
        getCtx.canvas.clientHeight
      );
      setFileImg('');
    };
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
        onDoubleClick={onDoubleClick}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={isNotDrawingMode}
        onMouseLeave={isNotDrawingMode}
        onMouseOut={isNotDrawingMode}
        onClick={onCanvasClick}
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
        <div className='panelBtn active'>{mode}</div>
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
            {el === 'file' && (
              <label htmlFor='file'>
                <input
                  type='file'
                  accept='image/*'
                  id='file'
                  value={fileImg}
                  onChange={onFileChange}
                  className='fileInput'
                />
              </label>
            )}
            {el === 'text' && (
              <input
                type='text'
                placeholder='텍스트 입력'
                value={text}
                onChange={handleText}
                className='textInput'
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
