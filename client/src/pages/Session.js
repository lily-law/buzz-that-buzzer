import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useRouteMatch, Redirect } from 'react-router-dom';
import './Session.css';
import Player from '../components/Player';
import ShareLinks from '../components/ShareLinks';
import BigButton from '../components/BigButton';
import exitIcon from '../images/exit.svg';
import { readFromStore } from '../controllers/storage';

export default function Session({userData, updateUserData, addToSessions, sessions}) {
    const [user, setUser] = useState(userData.name);
    const [token, setToken] = useState();
    const [title, setTitle] = useState('');
    const [redirect, setRedirect] = useState();
    const [nsp, setNsp] = useState();
    const [id, setId] = useState();
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState('');
    const [muted, setMuted] = useState(false);
    const lobbySocket = useRef();
    const sessionSocket = useRef();
    const match = useRouteMatch('/session/:id');
    useEffect(() => {
        const getStoredUserName = async () => {
            if (!user) {
                const storedUserData = await readFromStore("userData");
                if (storedUserData) {
                    setUser(storedUserData.name);
                }
                else {
                    setRedirect(<Redirect to='/' />);
                }
            }
            return
        };
        getStoredUserName();
    }, [user]);
    useEffect(() => {
        if (!token) {
            console.count('getting url data')
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
            console.count('lobby')
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
        const playerColours = {
            inUse: {},
            avaible: ['tomato', 'aqua', 'aquamarine', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgreen']
        } 
        if (!id && nsp && user) {
            console.count('joining')
            sessionSocket.current && !sessionSocket.current.disconnected && sessionSocket.current.disconnect();
            sessionSocket.current = io('/'+nsp);
            sessionSocket.current.on('connect', () => {
                sessionSocket.current.on('players', players => {
                    setPlayers(players.map(p => {
                        let colour = 'white';
                        if (!playerColours.inUse.hasOwnProperty(p.id)) {
                            colour = playerColours.avaible.pop();
                            playerColours.inUse[p.id] = colour;
                        }
                        else {
                            colour = playerColours.inUse[p.id];
                        }
                        return {...p, colour }
                    }));
                });
            });
            sessionSocket.current.emit('join', user);
            sessionSocket.current.on('joined', id => {
                setId(id);
            });
            sessionSocket.current.on('sync', () => {
                sessionSocket.current.emit('sync', Date.now());
            });
            sessionSocket.current.on('winner', winner => {
                setWinner(winner);
            });
            return () => {
                sessionSocket.current && sessionSocket.current.disconnect();
            }
        }
    }, [nsp, user, id, addToSessions]);

    const buzz = () => sessionSocket.current.emit('buzz', Date.now());
    return (
        <div className="session">
            {redirect && redirect}
            <header className="session__header">
                <button onClick={() => setRedirect(<Redirect to='/' />)}><img className="button-icon" src={exitIcon} title="Exit Saloon" alt="Exit" /></button>
                <h1 className="session__title" title={title}>{title}</h1>
                <ShareLinks {...{title, user}} />
            </header>
            <main className="session__main">
                {id ? <>
                    <section className="session__players">
                        {players.map(p => 
                            <Player key={p.id} {...{...p, winner: p.id === winner}} />
                        )}
                    </section> 
                    <section className="session__control">
                        <BigButton {...{buzz, muted}} />
                    </section> 
                </>:
                <section className="session__joining">
                    <p>joining...</p>
                </section>
                }
            </main>
            <footer className="session__footer">
    
            </footer>
        </div>
    );
}
