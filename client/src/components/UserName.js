import React, { useState } from 'react';
import './UserName.css';

export default function Landing({user, setUser}) {
    const [userInput, setUserInput] = useState(user);
    const setName = () => setUser(userInput);
    return (
    <section className="user-name plate">
        <div className="user-name__ribbon ribbon">
            <input className="user-name__input" type="text" onChange={e => setUserInput(e.target.value)} value={userInput} placeholder="Name/Alias" />
        </div>
        <button className="user-name__submit"onClick={setName}>Enter Saloon</button>
    </section>
    )
}