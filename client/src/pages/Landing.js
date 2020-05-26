import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import './Landing.css';
import logo from '../images/logo.svg';

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
            <h1><img src={logo} alt="U Buzz Tap" /></h1>
            <section className="intro">
                <h2 className="intro__tagline">A supplement for quizes via remote communications</h2>
                <p className="intro__text">Start your Saloon. Share the link with buddies. Definitely see who's buzzing in first. Each players connection speeds are accounted! </p>
            </section>
            <section className="setup plate">
                <div className="setup__ribbon ribbon">
                    <input className="setup__input" type="text" onChange={e => setTitle(e.target.value)} value={title} placeholder="Title" />
                </div>
                <button className="setup__submit" onClick={createSession}>Start New Saloon</button>
            </section>
        </main>
    </>);
}