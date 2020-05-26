import React from 'react';
import './Player.css';

export default function Player({name, winner = false, colour}) {
    return (
        <div style={{background: colour}} className={'player '+(winner ? 'winner' : '')}>
            {name}
        </div>
    );
}