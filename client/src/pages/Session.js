import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useRouteMatch, Redirect } from 'react-router-dom';
import './Session.css';
import UserName from '../components/UserName';
import BigButton from '../components/BigButton';
import Player from '../components/Player';
import mute from '../images/mute.svg';
import unmute from '../images/unmute.svg';
import ShareLinks from '../components/ShareLinks';

export default function Session() {
    const [user, setUser] = useState('');
    const [redirect, setRedirect] = useState();
    const [nsp, setNsp] = useState();
    const [id, setId] = useState();
    const [players, setPlayers] = useState([]);
    const [title, setTitle] = useState('');
    const [winner, setWinner] = useState('');
    const [muted, setMuted] = useState(false);
    const lobbySocket = useRef();
    const sessionSocket = useRef();
    const isValidSessId = id => id.match(/^.{8}-.{4}-.{4}-.{4}-.{12}$/);
    const match = useRouteMatch('/session/:id');
    let playerColours = {
        inUse: {},
        avaible: ['tomato', 'aqua', 'aquamarine', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgreen']
    } 
    useEffect(() => {
        const knockKnock = () => {
            const matchToken = match.params.id.substr(0, 36);
            const matchTitle = match.params.id.substr(36);
            if (isValidSessId(matchToken)) {
                lobbySocket.current && !lobbySocket.current.disconnected && lobbySocket.current.disconnect();
                lobbySocket.current = io();
                lobbySocket.current.on('connect', () => {
                    lobbySocket.current.emit('nspreq', {sessionId: matchToken, title: matchTitle});
                    lobbySocket.current.on('nsp', nsp => {
                        setNsp(nsp.token);
                        setTitle(nsp.title);
                        join();
                    });
                    lobbySocket.current.on('disconnect', () => {
                        setRedirect(<Redirect to='/' />);
                    });
                });
            }
            else {
                setRedirect(<Redirect to='/' />);
            }
        }
        const join = () => {
            if (nsp && user) {
                sessionSocket.current && !sessionSocket.current.disconnected && sessionSocket.current.disconnect();
                sessionSocket.current = io('/'+nsp);
                sessionSocket.current.on('connect', () => {
                    sessionSocket.current.on('players', players => {
                        setPlayers(players);
                    });
                    
                });
                sessionSocket.current.emit('join', user);
                sessionSocket.current.on('joined', id => {
                    setId(id);
                });
                sessionSocket.current.on('sync', () => {
                    sessionSocket.current.emit('sync', Date.now());
                })
                sessionSocket.current.on('disconnect', function(){
                //  setRedirect(<Redirect to='/' />);
                });
                sessionSocket.current.on('winner', winner => {
                    setWinner(winner);
                });
            }
        };
        if (!nsp) {
            knockKnock();
        }
        else {
            !id && join();
        } 
    }, [nsp, user, id, match.params.id]);

    useEffect(() => {
        return () => {
            sessionSocket.current && sessionSocket.current.disconnect();
            lobbySocket.current && lobbySocket.current.disconnect();
        }
    }, []);
    const buzz = () => sessionSocket.current.emit('buzz', Date.now());
    return (<div className="session">
        {redirect && redirect}
        <header className="session__header">
            <div className="session__link">
                <ShareLinks {...{title}} />
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