import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useRouteMatch, Redirect } from 'react-router-dom';
import './Session.css';
import Player from '../components/Player';
import ShareLinks from '../components/ShareLinks';
import BigButton from '../components/BigButton';
import exitIcon from '../images/exit.svg';
import { readFromStore } from '../controllers/storage';
import settingsIcon from '../images/settings.svg';
import Settings from '../components/Settings';

export default function Session({userData, updateUserData, addToSessions, sessions}) {
    const [token, setToken] = useState();
    const [title, setTitle] = useState('');
    const [redirect, setRedirect] = useState();
    const [nsp, setNsp] = useState();
    const [id, setId] = useState();
    const [players, setPlayers] = useState([]);
    const [buzzedIn, setBuzzedIn] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [lockout, setLockout] = useState(false);
    const lobbySocket = useRef();
    const sessionSocket = useRef();
    const match = useRouteMatch('/session/:id');
    
    useEffect(() => {
        const getStoredData = async () => {
            const storedUserData = await readFromStore("userData");
            if (storedUserData) {
                updateUserData(storedUserData);
            }
            else {
                setRedirect(<Redirect to='/' />);
            }
            return
        };
        !userData.name && getStoredData();
    }, [userData.name, updateUserData]);
    useEffect(() => {
        if (!token) {
            const matchToken = match.params.id.substr(0, 36);
            const matchTitle = match.params.id.substr(36);
            const isValidSessId = id => id.match(/^.{8}-.{4}-.{4}-.{4}-.{12}$/);
            if (isValidSessId(matchToken)) {
                !sessions.find(sess => sess.token === matchToken) && addToSessions([{title: matchTitle, token: matchToken}]);
                // wait for addToSessions so if later redirected to landing session will be there
                setTitle(matchTitle);
                setToken(matchToken);
            }
            else {
                setRedirect(<Redirect to='/' />);
            }
        }
    }, [addToSessions, match.params.id, sessions, token]);

    useEffect(() => {
        // get token to join session
        if (token && title) {
            lobbySocket.current && !lobbySocket.current.disconnected && lobbySocket.current.disconnect();
            lobbySocket.current = io();
            lobbySocket.current.on('connect', () => {
                lobbySocket.current.emit('nspreq', {sessionId: token, title});
                lobbySocket.current.on('nsp', nsp => {
                    setNsp(nsp.token);
                    setTitle(nsp.title);
                });
                lobbySocket.current.on('disconnect', () => {
                    setRedirect(<Redirect to='/' />);
                });
            });
            return () => {
                lobbySocket.current && lobbySocket.current.disconnect();
            }
        }
    }, [title, token]);

    useEffect(() => {
        if (!id && nsp && userData.name) {
            sessionSocket.current && !sessionSocket.current.disconnected && sessionSocket.current.disconnect();
            sessionSocket.current = io('/'+nsp);
            sessionSocket.current.on('connect', () => {
                sessionSocket.current.on('players', players => {
                    setPlayers(players);
                });
            });
            sessionSocket.current.emit('join', userData);
            sessionSocket.current.on('joined', id => {
                setId(id);
            });
            sessionSocket.current.on('sync', () => {
                if (!lockout) {
                    setLockout(true);
                    setBuzzedIn([]);
                    sessionSocket.current.emit('sync', Date.now());
                }
            });
            sessionSocket.current.on('nextRound', inMs => {
                setTimeout(() => setLockout(false), inMs);
            });
            sessionSocket.current.on('buzzedInList', list => {
                setBuzzedIn(list);
            });
        }
    }, [nsp, userData.name, id, addToSessions, userData]);

    useEffect(() => {
        if (!userData.colour && id && players.length > 0) {
            const user = players.find(p => p.id === id);
            user && updateUserData({colour: user.colour});
        }
    }, [id, players, userData.colour, updateUserData])

    useEffect(() => {
        return () => {
            sessionSocket.current && sessionSocket.current.disconnect();
        }
    }, []);
    const buzz = () => sessionSocket.current.emit('buzz', Date.now());
    return (
        <div className="session">
            {settingsOpen && <Settings {...{userData, updateUserData, sessionSocket, close: () => setSettingsOpen(false)}} />}
            {redirect && redirect}
            <header className="session__header">
                <button onClick={() => setRedirect(<Redirect to='/' />)}>
                    <img className="button-icon" src={exitIcon} title="Exit Saloon" alt="Exit" />
                </button>
                <h1 className="session__title" title={title}>{title}</h1>
                <ShareLinks {...{title, user: userData.name}} />
            </header>
            <main className="session__main">
                {lockout && <div className="session__lockout">
                    {players.filter(p => Number.isInteger(buzzedIn[p.id])).map(p => {
                        return <Player key={p.id+"lockout"} {...{...p, buzzedAt: buzzedIn[p.id]}} />
                    })}
                </div>}
                {id ? <>
                    <section className="session__players">
                        {players.map(p => {
                            return <Player key={p.id} {...{...p, buzzedAt: buzzedIn[p.id]}} />
                        }
                        )}
                    </section> 
                    <section className="session__control">
                        <BigButton {...{buzz, muted: userData.muted, lockout}} />
                    </section> 
                </>:
                <section className="session__joining">
                    <p>joining...</p>
                </section>
                }
            </main>
            <div className="session__settings">
                <button className="session__settings__button" onClick={() => setSettingsOpen(true)}>
                    <img className="settings__button__icon" src={settingsIcon} alt="Settings" />
                </button>
            </div>
        </div>
    );
}
