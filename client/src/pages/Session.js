import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useRouteMatch, Redirect } from 'react-router-dom';
import './Session.css';
import Player from '../components/Player';
import ShareLinks from '../components/ShareLinks';
import BigButton from '../components/BigButton';
import exitIcon from '../images/exit.svg';

export default function Session({userData, setUserData, addToSessions, sessions}) {
    const user = userData.name;
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
    useEffect(() => {
        const playerColours = {
            inUse: {},
            avaible: ['tomato', 'aqua', 'aquamarine', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgreen']
        } 
        const knockKnock = async () => {
            const matchToken = match.params.id.substr(0, 36);
            const matchTitle = match.params.id.substr(36);
            if (isValidSessId(matchToken)) {
                await !sessions.find(sess => sess.token === matchToken) && await addToSessions([{title: matchTitle, token: matchToken}]);
                if (user) {
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
                    return
                }
            }
            setRedirect(<Redirect to='/' />);
        };
        const join = () => {
            if (nsp && user) {
                sessionSocket.current && !sessionSocket.current.disconnected && sessionSocket.current.disconnect();
                sessionSocket.current = io('/'+nsp);
                sessionSocket.current.on('connect', () => {
                    sessionSocket.current.on('players', players => {
                        setPlayers(players.map(p => {
                            let colour;
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
            }
        };
        if (!nsp) {
            knockKnock();
        }
        else {
            !id && join();
        } 
    }, [nsp, user, id, match.params.id, addToSessions, sessions]);
    useEffect(() => {
        return () => {
            sessionSocket.current && sessionSocket.current.disconnect();
            lobbySocket.current && lobbySocket.current.disconnect();
        }
    }, []);
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