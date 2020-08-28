import React from 'react';
import logo from './assets/icon.png';
// import axios from 'axios'

import mac_logo from './assets/mac_logo.svg';
import win_logo from './assets/win_logo.svg';
import linux_logo from './assets/linux_logo.svg';

import './App.css';

function App() {

  const downloadPlatform = (platform: string) => {
    window.open(`/download/${platform}`, "_self");
  }
  const platformClick = (platform: string) => {
    console.log("get platform button ", platform);
    return (event: any) => {
      downloadPlatform(platform);
    }
  }
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
          <img className="icon_button" src={mac_logo} alt={"mac os x icon"} onClick={platformClick('mac')} />
          <img className="icon_button" src={win_logo} alt={"windows icon"} onClick={platformClick('win')} />
          <img className="icon_button" src={linux_logo} alt={"linux icon"} onClick={platformClick('linux')} />
        </div>
      </header>
    </div>
  );
}

export default App;
