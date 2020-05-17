import React, { useEffect } from 'react';
import './BigButton.css';
const sound = () => require('./sound');

export default function BigButton({buzz, muted}) {
    const {beep, stop} = sound();
    const handleButtonPress = e => {
        buzz();
        !muted && beep();
        window && window.navigator.vibrate(10000);
    }
    const handleButtonRelease = e => {
        !muted && stop();
        window && window.navigator.vibrate(0);
    }
    useEffect(() => {
        return () => {
            !muted && stop();
            window && window.navigator.vibrate(0);
        }
    }, [muted, stop]);
    return <button className="big-button" onMouseDown={handleButtonPress} onMouseUp={handleButtonRelease} onTouchStart={handleButtonPress} onTouchEnd={handleButtonRelease}></button>
}