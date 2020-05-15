import React, { useState } from 'react';

export default function Landing({user, setUser, setSessionId}) {
    const [title, setTitle] = useState('');
    const [session, setSession] = useState('join');
    const [link, setLink] = useState('');
    const handleLinkInput = e => {
        const input = e.target.value;
        setLink(input);
        if (input.length > 5) { 
            // if valid
                // check server for session
                setSessionId(input);
                // else no session
            // else invalid
        }
    }
    const createSession = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/session');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            console.log('SessionId: ' + xhr.responseText);
            setSessionId(xhr.responseText);
        };
        xhr.send(JSON.stringify({data: title}));
    }
    return (<>
        <main>
            <section>
                <input type="text" onChange={e => setUser(e.target.value)} value={user} placeholder="Name/Alias" />
            </section>
            <nav>
                <button onClick={() => setSession('join')}>Join Session</button>
                <button onClick={() => setSession('create')}>Create Session</button>
            </nav>
            <section>
                { session === 'create' ? <>
                    <input type="text" onChange={e => setTitle(e.target.value)} value={title} placeholder="Session Title" disabled={user === ''} />
                    <button onClick={createSession}>Create</button>
                </> : <>
                    <input type="text" onChange={handleLinkInput} value={link} placeholder="Session ID/URL" disabled={user === ''} />
                </>
                } 
            </section>
        </main>
    </>);
}