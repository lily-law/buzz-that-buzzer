import React, { Fragment } from 'react';
import beep from '../components/sound';
import './BigButton.css';

export default function BigButton({buzz, muted}) {
    const handleButtonPress = e => {
        buzz();
        !muted && beep(500);
    }
    return (
        <Fragment>
            <button className="big-button" onMouseDown={handleButtonPress} onTouchStart={handleButtonPress}>
                <svg xmlns="http://www.w3.org/2000/svg" width="212" height="212" viewBox="0 0 212 212">
                    <circle cx="106" cy="106" r="106" fill="#a54835"/>
                </svg>
            </button>
        </Fragment>
    ) 
}