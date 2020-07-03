import React, { useRef, useEffect } from 'react';
import './Player.css';

export default function Player({name, buzzedAt = false, colour}) {
    const colourAvarageValue = colour ? parseInt(colour.substr(1, 2), 16) + parseInt(colour.substr(3, 2), 16) + parseInt(colour.substr(5, 2), 16) : 0;
    const colourBias = colourAvarageValue > (parseInt('88', 16)*3) ? 'light' : 'dark';
    return (
        <div style={{background: colour}} className={`player ${colourBias} ${buzzedAt === 0 ? 'winner buzzed' : buzzedAt ? 'buzzed' : ''}`}>
            <p className="player__buzzed-time">{buzzedAt ? `+${buzzedAt}ms`: ''}</p>
            <p className="player__name">{name}</p>
        </div>
    );
}