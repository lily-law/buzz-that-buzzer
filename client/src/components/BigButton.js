import React, { useEffect, useRef, useState } from 'react';
import beep from '../components/sound';
import './BigButton.css';

export default function BigButton({buzz, muted, lockout}) {
    const active = useRef(false);
    const handleButtonPress = e => {
        if (!lockout && !active.current) {
            active.current = true;
            buzz();
            if (!muted) {
                beep(500);
            }
        }
    };
    const ref = useRef();
    const reset = () => {
        active.current = false;
        !lockout && window.addEventListener("keydown", handleSpaceBar, {once: true});
    }
    const handleSpaceBar = e => { 
        if (ref.current && e.key === " ") {
            ref.current.click();
            handleButtonPress();
        }
    };
    useEffect(() => {
        reset();
        return () => {
            window.removeEventListener("keydown", handleSpaceBar, {once: true});
        }
    });
    return (
        <button ref={ref} className={`big-button ${active ? "big-button--active" : ""}`} onMouseDown={handleButtonPress} onTouchStart={handleButtonPress}></button>
    ) 
}