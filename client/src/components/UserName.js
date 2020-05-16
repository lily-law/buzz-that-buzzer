import React, { useState } from 'react';
import './UserName.css';

export default function Landing({user, setUser}) {
    const [userInput, setUserInput] = useState(user);
    const setName = () => setUser(userInput);
    return (<section className="user-name">
        <input type="text" onChange={e => setUserInput(e.target.value)} value={userInput} placeholder="Name/Alias" />
        <button onClick={setName}>Done</button>
    </section>);
}