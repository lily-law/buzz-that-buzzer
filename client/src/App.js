import React, { useState } from 'react';
import Landing from './pages/Landing';
import Session from './pages/Session';
import './App.css';

function App() {
  const [user, setUser] = useState('');
  const [sessionId, setSessionId] = useState('');
  return (
    <div className="App">
      {sessionId === '' ? 
        <Landing {...{user, setUser, setSessionId}} /> :
        <Session {...{user, sessionId, setSessionId}} />
      }
    </div>
  );
}

export default App;
