import React, { useEffect, useRef, useState } from 'react';
import beep from '../components/sound';
import './BigButton.css';

export default function BigButton({buzz, muted}) {
    const [active, setActive] = useState(false);
    const handleButtonPress = e => {
        if (!active) {
            setActive(true);
            buzz();
            !muted && beep(500, reset);
        }
    };
    const ref = useRef();
    const reset = () => {
        setActive(false);
        window.addEventListener("keydown", handleSpaceBar, {once: true});
    }
    const handleSpaceBar = e => { 
        if (e.key === " ") {
            ref.current.click();
            handleButtonPress();
        }
    };
    useEffect(() => {
        window.addEventListener("keydown", handleSpaceBar, {once: true});
        return () => {
            window.removeEventListener("keydown", handleSpaceBar, {once: true});
        }
    });
    return (
        <button ref={ref} className={`big-button ${active ? "big-button--active" : ""}`} onMouseDown={handleButtonPress} onTouchStart={handleButtonPress}></button>
    ) 
}