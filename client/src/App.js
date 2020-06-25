import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Landing from './pages/Landing';
import Session from './pages/Session';
import {writeToStore, readFromStore} from './controllers/storage';
import './App.css';

function App() {

  const [userData, setUserData] = useState({
    name: ""
  });
  const [sessions, setSessions] = useState([]);
  const addToSessions = (arr, stored) => {
    const usedTokens = [];
    const isUniqueToken = (a, c) => {
      if (usedTokens.includes(c.token)) {
        return a
      }
      else {
        usedTokens.push(c.token);
        return [...a, c]
      }
    }
    let newSessions = [...arr, ...sessions].reduce(isUniqueToken, []);
    !stored && writeToStore("sessions", newSessions);
    setSessions(newSessions);
  };
  const removeSession = session => {
    const newSessions = sessions.filter(sess => sess.url === session.url);
    writeToStore("sessions", newSessions);
    setSessions(newSessions);
  }
  const updateUserData = (data, stored) => {
    const newData = {...userData, ...data};
    !stored && writeToStore("userData", newData);
    setUserData(newData);
  };
  useState(() => {
    const addStoredUserData = async () => {
      if (typeof(Storage) !== "undefined") {
          // TODO status('checking for stored user data')
          const userData = await readFromStore("userData");
          // TODO clearStatus('checking for stored user data')
          if (userData) {
              updateUserData(userData);
          }
      }
    };
    addStoredUserData();
    const addStoredSessions = async () => {
      if (typeof(Storage) !== "undefined") {
          // TODO status('checking for stored sessions')
          const sessions = await readFromStore("sessions");
          // TODO clearStatus('checking for stored sessions')
          if (sessions) {
            addToSessions(sessions, true);
          }
      }
    };
    addStoredSessions();
  }, []);
  
  return (
    <Router>
      <Switch>
        <Route path="/session/:id">
          <Session {...{userData, updateUserData, addToSessions, sessions}} />
        </Route>
        <Route path="/">
          <Landing {...{userData, updateUserData, sessions, addToSessions, removeSession}} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;