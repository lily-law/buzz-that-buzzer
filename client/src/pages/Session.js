import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './Session.css';

export default function Session({user, sessionId, setSessionId}) {
    const [nsp, setNsp] = useState();
    const [players, setPlayers] = useState([]);
    const [title, setTitle] = useState('');
    const [winner, setWinner] = useState('');
    const socket = useRef();
    useEffect(() => {
        if (!nsp) {
            socket.current = io('192.168.1.12:5000/');
            socket.current.on('connect', () => {
                socket.current.emit('nspreq', sessionId);
                socket.current.on('nsp', nsp => {
                    console.log(nsp)
                    setNsp(nsp);
                    (() => {socket.current.disconnect();})();
                });
            });
            socket.current.on('event', function(data){});
            socket.current.on('disconnect', function(){});
            return () => {
                socket.current.disconnect();
            }
        }
    }, []);
    useEffect(() => {
        if (nsp) {  
            socket.current = io('192.168.1.12:5000/'+nsp);
            socket.current.on('connect', () => {
                socket.current.on('players', players => {
                    console.log(players)
                    setPlayers(players);
                });
                socket.current.emit('join', user);
                socket.current.on('joined', title => {
                    setTitle(title);
                });
            });
            socket.current.on('event', function(data){});
            socket.current.on('disconnect', function(){});
            socket.current.on('winner', winner => {
                setWinner(winner);
            })
            return () => {
                socket.current.disconnect();
            }
        }
    }, [nsp]); 
    const buzz = () => {
        console.log('buzz')
        socket.current.emit('buzz', Date.now().toString());
    };
    return (<>
        <main>
            <h1>{title}</h1>
            <section className="joined">
                {players.map(p => 
                    <div key={p.id} className={p.id === winner ? 'winner' : ''}>
                        {p.name} {p.buzzed && p.buzzed}
                    </div>
                )}
            </section>
            <button onMouseDown={buzz} disabled={title === ''}>Big Button</button>
            <button onClick={() => setSessionId('')}>Leave</button>
        </main>
    </>);
}