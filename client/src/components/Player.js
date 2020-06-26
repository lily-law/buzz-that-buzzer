import React, { useRef, useEffect } from 'react';
import './Player.css';

export default function Player({name, winner = false, colour}) {
    const ref = useRef();
    useEffect(() => {
        if (winner) {
            ref.current.scrollIntoView();
        }
    }, [winner])
    return (
        <div ref={ref} style={{background: colour}} className={'player '+(winner ? 'winner' : '')}>
            <p className="player__name">{name}</p>
        </div>
    );
}