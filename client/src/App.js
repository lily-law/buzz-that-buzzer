import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Landing from './pages/Landing';
import Session from './pages/Session';
import './App.css';

function App() {
  const [userData, setUserData] = useState({
    name: ''
  });
  useEffect(() => {
    // TODO check localstorage for userData
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/session/:id">
          <Session {...{userData, setUserData}} />
        </Route>
        <Route path="/">
          <Landing {...{userData, setUserData}} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
