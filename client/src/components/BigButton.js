import React, { useEffect } from 'react';
import './BigButton.css';

export default function BigButton({buzz, muted, beep, stop}) {
    const handleButtonPress = e => {
        buzz();
        !muted && beep();
    }
    const handleButtonRelease = e => {
        stop();
    }
    useEffect(() => {
        return () => {
            stop();
        }
    }, [muted, stop]);
    return <button className="big-button" onMouseDown={handleButtonPress} onMouseUp={handleButtonRelease} onTouchStart={handleButtonPress} onTouchEnd={handleButtonRelease}></button>
}