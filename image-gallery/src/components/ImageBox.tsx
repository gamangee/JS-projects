import React from 'react';
import '../App.css';

export default function ImageBox(props: { src: string }) {
  return (
    <div className='image-box'>
      <img className='image' src={props.src} alt='img' />
    </div>
  );
}
