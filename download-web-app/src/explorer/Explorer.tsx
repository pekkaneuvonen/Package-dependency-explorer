import React, { useState, useEffect, useContext } from 'react'
// import { observer } from 'mobx-react';

import './Explorer.scss';

import AppState from './AppState';
import Header from './components/Header';
import PackageView from './components/PackageView';
import { tempHCmock } from './assets/Sample';
import PackageTree, { Pointer } from './model/PackageTree';

function Explorer() {
  const appState = useContext(AppState);

  const [rootData, setRootData] = useState("");

  useEffect(() => {
    appState.setPackageTree(new PackageTree(rootData));
  }, [ rootData, appState ]);

  if (!rootData) {
    setRootData(tempHCmock);
  }

  const homeClickHandler = () => {
    // console.log("homeClickHandler : ");
    appState.updateCurrentPackage(undefined);
  }
  const crumbClickHandler = (crumbIndx: number) => {
    // console.log("crumbClicHandler : ", crumbIndx, " ( ", appState.breadcrumbs[crumbIndx], " ) ");
    appState.cutToBreadcrumb(crumbIndx);
  }
  const packageClickHandler = (packagePointer: Pointer) => {
    // console.log("packageClickHandler : ", packagePointer);
    appState.updateCurrentPackage(packagePointer);
  }

  
  return (
    <div className="Explorer">
      <Header homeClickHandler={homeClickHandler} crumbClickHandler={crumbClickHandler} />
      <PackageView packageClickHandler={packageClickHandler} />
    </div>
  )
 
}
export default Explorer;