import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
    const [redirect, setRedirect] = useState();
    const [title, setTitle] = useState('');
    const createSession = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/session');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            setRedirect(<Redirect to={'/session/'+xhr.responseText} />);
        };
        xhr.send(JSON.stringify({data: title}));
    }
    return (<>
        {redirect && redirect}
        <main className="landing">
            <input className="landing__title" type="text" onChange={e => setTitle(e.target.value)} value={title} placeholder="Session Title" />
            <button className="landing__create" onClick={createSession}>Create Session</button>
        </main>
    </>);
}