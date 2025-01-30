import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Patients from './components/Patients';
import Doctors from './components/Doctors';
import Appointments from './components/Appointments';
import NavBar from './components/NavBar';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/patients" component={Patients} />
          <Route path="/doctors" component={Doctors} />
          <Route path="/appointments" component={Appointments} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;