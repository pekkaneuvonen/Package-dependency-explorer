import React from 'react';
import logo from './assets/icon.png';
// import axios from 'axios'

import mac_logo from './assets/mac_logo.svg';
import win_logo from './assets/win_logo.svg';
import linux_logo from './assets/linux_logo.svg';

import './App.css';

const baseUrl: string = 'https://package-explorer-download.herokuapp.com/';

function App() {

  // const downloadPlatform = (platform: string) => {
  //   window.open(`/download/${platform}`, "_self");
  // }
  // const platformClick = (platform: string) => {
  //   console.log("get platform button ", platform);
  //   return (event: any) => {
  //     downloadPlatform(platform);
  //   }
  // }
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
      </header>
    </div>
  );
}

export default App;
