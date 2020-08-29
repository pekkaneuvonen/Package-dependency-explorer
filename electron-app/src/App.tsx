import React, { useState, useEffect } from 'react';
import { packageRootFromFile } from './FileController';
import * as path from 'path';

import './App.scss';

import AppState from './AppState';
import Header from './components/Header';
import PackageView from './components/PackageView';
import { tempHCmock } from './assets/Sample';
import PackageTree, { Package } from './model/PackageTree';

// const remote = window.require('electron').remote;

// enum PlatformType {
//   win32 = 'WINDOWS',
//   darwin = 'MAC',
//   linux = 'LINUX',
//   sunos = 'SUN',
//   openbsd = 'OPENBSD',
//   android = 'ANDROID',
//   aix = 'AIX',
// }

// let currentPlatform: PlatformType = PlatformType.win32;
// switch (remote.process.platform) {
//   case 'win32':
//     currentPlatform = PlatformType.win32;
//     break;
//   case 'darwin':
//     currentPlatform = PlatformType.darwin;
//     break;
//   case 'linux':
//     currentPlatform = PlatformType.linux;
//     break;
//   case 'sunos':
//     currentPlatform = PlatformType.sunos;
//     break;
//   case 'openbsd':
//     currentPlatform = PlatformType.openbsd;
//     break;
//   case 'android':
//     currentPlatform = PlatformType.android;
//     break;
//   case 'aix':
//     currentPlatform = PlatformType.aix;
//     break;
// }

const appState = new AppState();

function App() {
  const [rootData, setRootData] = useState("");
  // const [packageTree, setPackageTree] = useState(new PackageTree("Package: root"));
  // const [currentPackage, setCurrentPackage] = useState<Package | undefined>(undefined);
  // const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  useEffect(() => {
    appState.setPackageTree(new PackageTree(rootData));
  }, [ rootData ]);

  if (!rootData) {
    packageRootFromFile(path.resolve("var/lib/dpkg"), "status")
    .then(result => {
      setRootData(result);
    }).catch(err => {
      console.log(err);
      setRootData(tempHCmock);
    })
  }

  const homeClickHandler = () => {
    console.log("homeClickHandler : ");
    appState.updateCurrentPackage(undefined);
  }
  const crumbClickHandler = (crumbIndx: number) => {
    console.log("crumbClicHandler : ", crumbIndx, " ( ", appState.breadcrumbs[crumbIndx], " ) ");
    appState.cutToBreadcrumb(crumbIndx);
  }
  const packageClickHandler = (packageId: string) => {
    console.log("packageClickHandler : ", packageId);
    appState.updateCurrentPackage(packageId);
  }

  
  return (
    <div className="App">
      <Header appState={appState} homeClickHandler={homeClickHandler} crumbClickHandler={crumbClickHandler} />
      <PackageView appState={appState} packageClickHandler={packageClickHandler} />
    </div>
  )
 
}
export default App;


// export default class App2 extends Component <{}, {packageTree: PackageTree, currentPackage?: Package, breadcrumbs: string[]}> {
//     constructor(props: any) {
//         super(props)
//           this.state = {
//             breadcrumbs: [],
//             packageTree: new PackageTree("Package: root"),
//           }
//     }

//     componentDidMount() {
//       packageRootFromFile(path.resolve("var/lib/dpkg"), "status")
//       .then(result => {
//         this.setState({packageTree: new PackageTree(result)})
//       }).catch(err => {
//         console.log(err);
//         this.setState({packageTree: new PackageTree(tempHCmock)})
//       })
//     }

//     getPackage = (id: string) => {
//       return this.state.packageTree.structure.find(pkg => pkg.id === id);
//     }
//     crumbClickHandler = (crumbId: string) => {
//       console.log("crumbClicHandler : ", crumbId)
//     }
//     packageClickHandler = (packageId: string) => {
//       console.log("packageClickHandler : ", packageId);
//       const pkg = this.getPackage(packageId);
//       this.setState({currentPackage: pkg})
//     }
//     render() {
//       return (
//         <div className="App">
//           <Header breadcrumbs={this.state.breadcrumbs} crumbClickHandler={this.crumbClickHandler} platform={currentPlatform} />
//           <PackageView pkgTree={this.state.packageTree} packageClickHandler={this.packageClickHandler} currentPackage={this.state.currentPackage}/>
//         </div>
//       )
//    }
// }