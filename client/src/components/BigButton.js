import React from 'react';
import beep from '../components/sound';
import './BigButton.css';

export default function BigButton({buzz, muted = false}) {
    const handleButtonPress = e => {
        buzz();
        !muted && beep(500);
    }
    return <button className="big-button" onMouseDown={handleButtonPress} onTouchStart={handleButtonPress}></button>
}