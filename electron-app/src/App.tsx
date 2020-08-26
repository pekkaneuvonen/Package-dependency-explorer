import React, { Component } from 'react';
import { packageRootFromFile } from './FileController';
import * as path from 'path';

import './App.css';
import Header from './components/Header';
import PackageView from './components/PackageView';
import { tempHCmock } from './assets/Sample';
import PackageTree from './model/PackageTree';

const remote = window.require('electron').remote;

enum PlatformType {
  win32 = 'WINDOWS',
  darwin = 'MAC',
  linux = 'LINUX',
  sunos = 'SUN',
  openbsd = 'OPENBSD',
  android = 'ANDROID',
  aix = 'AIX',
}

let currentPlatform: PlatformType = PlatformType.win32;
switch (remote.process.platform) {
  case 'win32':
    currentPlatform = PlatformType.win32;
    break;
  case 'darwin':
    currentPlatform = PlatformType.darwin;
    break;
  case 'linux':
    currentPlatform = PlatformType.linux;
    break;
  case 'sunos':
    currentPlatform = PlatformType.sunos;
    break;
  case 'openbsd':
    currentPlatform = PlatformType.openbsd;
    break;
  case 'android':
    currentPlatform = PlatformType.android;
    break;
  case 'aix':
    currentPlatform = PlatformType.aix;
    break;
}

export default class App extends Component <{}, {packageTree: PackageTree, breadcrumbs: string[]}> {
    constructor(props: any) {
        super(props)
          this.state = {
            breadcrumbs: [],
            packageTree: new PackageTree("Package: root"),
          }
    }

    componentDidMount() {
      packageRootFromFile(path.resolve("/var/lib/dpkg/"), "status.real")
      .then(result => {
        this.setState({packageTree: new PackageTree(result)})
      }).catch(err => {
        console.log(err);
        this.setState({packageTree: new PackageTree(tempHCmock)})
      })
    }

    crumbClickHandler = (crumbId: string) => {
      console.log("crumbClicHandler : ", crumbId)
    }

    render() {
      return (
        <div className="App">
          <Header breadcrumbs={this.state.breadcrumbs} crumbClickHandler={this.crumbClickHandler} platform={currentPlatform} />
          <PackageView pkgTree={this.state.packageTree}/>
        </div>
      )
   }
}