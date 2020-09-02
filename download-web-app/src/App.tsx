import React from 'react';
import logo from './assets/icon.png';
// import axios from 'axios'
import { Router, Route, Switch, Link } from 'react-router-dom'
import history from "./history";

import Explorer from './explorer/Explorer';

import mac_logo from './assets/mac_logo.svg';
import win_logo from './assets/win_logo.svg';
import linux_logo from './assets/linux_logo.svg';

import './App.css';

const baseUrl: string = 'https://package-explorer-download.herokuapp.com/';

const HomeScreen = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>
          Download Package Dependency Explorer.
        </h2>
        <p>
          Select your platform.
        </p>
        <div className="linkContainer">
          <button className="icon_button"><a href={`${baseUrl}download/mac`} download="package-dependency-explorer.dmg"><img className="icon" src={mac_logo} alt={"mac os x icon"} /></a></button>
          <button className="icon_button"><a href={`${baseUrl}download/win`} download="package-dependency-explorer.zip"><img className="icon" src={win_logo} alt={"windows icon"} /></a></button>
          <button className="icon_button"><a href={`${baseUrl}download/linux`} download="package-dependency-explorer.AppImage"><img className="icon" src={linux_logo} alt={"linux icon"} /></a></button>
        </div>
        <p className="demo-message">You can also test it online with static mock data</p>
        {/* <button className="demo-button" onClick={}>Online demo</button> */}
        <Link to="/explorer" className="demo-button">Online demo</Link>
      </header>
    </div>
  );
}
const ExplorerOnline = () => {
  return (
    <Explorer />
  );
}

function App() {

  return (
    <Router history={history}>
      <Switch>
        <Route exact={true} path={'/'} component={HomeScreen} />
        <Route exact={true} path={'/explorer'} component={ExplorerOnline} />
      </Switch>
    </Router>
  );
}

export default App;
