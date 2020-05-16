import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useRouteMatch, Redirect } from "react-router-dom";
import './Session.css';
import UserName from '../components/UserName';
import BigButton from '../components/BigButton';
import Player from '../components/Player';
import mute from '../images/mute.svg';
import unmute from '../images/unmute.svg';

export default function Session() {
    const [user, setUser] = useState('');
    const [redirect, setRedirect] = useState();
    const [nsp, setNsp] = useState();
    const [id, setId] = useState();
    const [players, setPlayers] = useState([]);
    const [title, setTitle] = useState('');
    const [winner, setWinner] = useState('');
    const [muted, setMuted] = useState(false);
    const socket = useRef();
    const isValidSessId = id => id.match(/^.{8}-.{4}-.{4}-.{4}-.{12}$/);
    const match = useRouteMatch('/session/:id');
    let playerColours = {
        inUse: {},
        avaible: ['tomato', 'aqua', 'aquamarine', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgreen']
    } 
    useEffect(() => {
        if (!nsp) {
            if (isValidSessId(match.params.id)) {
                socket.current = io();
                socket.current.on('connect', () => {
                    socket.current.emit('nspreq', match.params.id);
                    socket.current.on('nsp', nsp => {
                        if (nsp) {
                            setNsp(nsp.token);
                            setTitle(nsp.title);
                        }
                        else {
                            socket.current.disconnect();
                            setRedirect(<Redirect to='/' />);
                        }
                        
                    });
                });
            }
            else {
                setRedirect(<Redirect to='/' />);
            }
        }
    }, [match, nsp]);
    useEffect(() => {
        if (nsp && user) {  
            socket.current.disconnect();
            socket.current = io('/'+nsp);
            setTimeout(() => {
                if (!socket.current.connected) {
                    setRedirect(<Redirect to='/' />);
                } 
            }, 5000);
            socket.current.on('connect', () => {
                socket.current.on('players', players => {
                    setPlayers(players);
                });
                socket.current.emit('join', user);
                socket.current.on('joined', id => {
                    setId(id);
                });
                socket.current.on('sync', () => {
                    socket.current.emit('sync', Date.now());
                })
                socket.current.on('disconnect', function(){
                    setRedirect(<Redirect to='/' />);
                });
            });
            socket.current.on('winner', winner => {
                setWinner(winner);
            })
        }
    }, [nsp, user]); 
    useEffect(() => {
        return () => {
            socket.current && socket.current.disconnect();
        }
    }, []);
    const buzz = () => socket.current.emit('buzz', Date.now());
    return (<div className="session">
        {redirect && redirect}
        <header className="session__header">
            <div className="session__link">
                <div>JoinLink: {window.location.href}</div>
                <button onClick={() => setRedirect(<Redirect to='/' />)}>Leave</button>
            </div>
            <h1 className="session__title">{title}</h1>
        </header>
        <main className="session__main">
            <section className="session__players">
                {players.map(p => {
                    if (!playerColours.inUse.hasOwnProperty(p.id)) {
                        playerColours.inUse[p.id] = playerColours.avaible.pop();
                    }
                    return <Player key={p.id+winner} {...{...p, colour: playerColours.inUse[p.id], winner: p.id === winner}} />
                })}
            </section>
            <section className="session__control">
                {winner ? <h2>{players.find(p => p.id === winner).name}</h2> : !user ? <UserName {...{user, setUser}} /> : !id ? <p>joining...</p> : <BigButton {...{buzz, muted}} />}
            </section>
        </main>
        <footer className="session__footer">
            {muted ? <img src={mute} onClick={() => setMuted(false)} alt="muted" /> : <img src={unmute} onClick={() => setMuted(true)} alt="unmuted" />}
        </footer>
    </div>);
}