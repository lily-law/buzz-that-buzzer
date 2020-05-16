import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Landing from './pages/Landing';
import Session from './pages/Session';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/session/:id">
          <Session />
        </Route>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
