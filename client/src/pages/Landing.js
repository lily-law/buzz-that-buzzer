import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import './Landing.css';
import addIcon from '../images/add.svg';
import deleteIcon from '../images/cancel.svg';
import enterIcon from '../images/enter.svg';

export default function Landing({userData, setUserData}) {
    const [redirect, setRedirect] = useState();
    const [title, setTitle] = useState('');
    const [sessions, setSessions] = useState([
        {title: "Test round one", link: ""}, 
        {title:"Test round two", link: ""}, 
        {title:"Another test round", link: ""}
    ]);
    const userNameRef = useRef();
    const sessionTitleRef = useRef();
    const createSession = () => {
        if (!userData.name) { 
            userNameRef.current.focus();
            userNameRef.current.style.border = "1px solid red";
        }
        else if (!title) {
            sessionTitleRef.current.focus();
            sessionTitleRef.current.style.border = "1px solid red";
        }
        else {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/session');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                setRedirect(<Redirect to={'/session/'+xhr.responseText} />);
            };
            xhr.send(JSON.stringify({data: title}));             
        }
    };
    const handleSetUserName = e => {
        userNameRef.current.style.border = "none";
        setUserData({...userData, name: e.target.value});
    };
    const handleSetTitle = e => {
        sessionTitleRef.current.style.border = "none";
        setTitle(e.target.value);
    }

    useEffect(() => {
        // TODO check url for session
        // check localstorage for previous sessions
    }, []);
    return (<>
        {redirect && redirect}
        <main className="landing">
            <section className="landing__info">
                <h1>U Buzz Tap</h1>
                <h2>A supplement for quizes via remote communications</h2>
                <p>Create a session. Share the link. Buzz in!</p>
            </section>
            <section className="landing__setup">
                <input ref={userNameRef} className="setup__user-name" type="text" placeholder="Name/Alias" onChange={handleSetUserName} value={userData.name} />
                <div className="setup__sessions">
                    {sessions.length > 0 && <>
                        <button className="sessions__delete">
                            <img src={deleteIcon} alt="x" />
                        </button>
                        <ul className="sessions__list">
                            {sessions.map(sess => <li key={sess.url}>{sess.title}</li>)}
                        </ul>
                        <button className="sessions__enter">
                            <img src={enterIcon} alt="Enter" />
                        </button>
                    </>}
                </div>
                <div className="setup__new-session">
                    <input ref={sessionTitleRef} className="new-session__input" type="text" onChange={handleSetTitle} value={title} placeholder="New Session" />
                    <button className="new-session__submit" onClick={createSession}>
                        <img src={addIcon} alt="+" />
                    </button>
                </div>
            </section>
        </main>
    </>);
}