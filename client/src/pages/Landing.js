import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import './Landing.css';
import addIcon from '../images/add.svg';
import enterIcon from '../images/enter.svg';
import {writeToStore} from '../controllers/storage';

export default function Landing({userData, updateUserData, sessions, addToSessions, removeSession, test}) {
    const [redirect, setRedirect] = useState();
    const [title, setTitle] = useState('');
    const userNameRef = useRef();
    const sessionTitleRef = useRef();
    const joinSession = session => {
        if (!userData.name) { 
            userNameRef.current.focus();
            userNameRef.current.style.border = "1px solid red";
        }
        else {
            setRedirect(<Redirect to={'/session/'+session.token+session.title} />);
        }
    }
    const createSession = () => {
        if (!title) {
            sessionTitleRef.current.focus();
            sessionTitleRef.current.style.border = "1px solid red";
        }
        else {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/session');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                const token = xhr.responseText.substr(0, 36);
                addToSessions([{title, token}]);
                joinSession({title, token});
            };
            xhr.send(JSON.stringify({data: title}));             
        }
    };
    const handleSetUserName = e => {
        userNameRef.current.style.border = "none";
        updateUserData({...userData, name: e.target.value});
    };
    const handleSetTitle = e => {
        sessionTitleRef.current.style.border = "none";
        setTitle(e.target.value);
    }
    const storeUserData = () => {
        writeToStore("userData", userData);
    }
    return (<>
        {redirect && redirect}
        <main className="landing">
            <section className="landing__info">
                <h1>U Buzz Tap</h1>
                <h2>A supplement for quizes via remote communications</h2>
                <p>Create a session. Share the link. Buzz in!</p>
            </section>
            <section className="landing__setup">
                <input ref={userNameRef} className="setup__user-name" type="text" placeholder="Name/Alias" onChange={handleSetUserName} onKeyDown={e => e.key === "Enter" && e.target.blur()} value={userData.name} onBlur={storeUserData} />
                <div className="setup__sessions">
                    {sessions.length > 0 && <>
                        <div className="sessions__list">
                            {sessions.map(sess => <button key={sess.token} onClick={() => joinSession(sess)}>
                                {sess.title}
                                <img src={enterIcon} alt="" />
                            </button>)}
                        </div>
                    </>}
                </div>
                <div className="setup__new-session">
                    <input ref={sessionTitleRef} className="new-session__input" type="text" onChange={handleSetTitle} onKeyDown={e => e.key === "Enter" && createSession()}  value={title} placeholder="New Session" />
                    <button className="new-session__submit" onClick={createSession}>
                        <img src={addIcon} alt="+" />
                    </button>
                </div>
            </section>
        </main>
    </>);
}