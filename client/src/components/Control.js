import React, { useState, useEffect, useRef, Fragment } from 'react';
import BigButton from '../components/BigButton';
import Player from '../components/Player';
import mute from '../images/mute.svg';
import unmute from '../images/unmute.svg';

export default function Control({winner, players, buzz, setMuted, muted}) {
    return (<Fragment> 
        {winner ? <Player key={winner} {...{...players.find(p => p.id === winner)}} /> : <BigButton {...{buzz, muted}} />}
        {muted ? <img className="button-icon mute-control" src={mute} onClick={() => setMuted(false)} alt="muted" /> : <img className="button-icon mute-control" src={unmute} onClick={() => setMuted(true)} alt="unmuted" />}
    </Fragment>);
}