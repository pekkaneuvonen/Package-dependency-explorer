import React from 'react';
import PackageTree, { Package, Pointer } from '../model/PackageTree';
// import { packageRootFromFile } from './FileController';
// import * as path from 'path';

class PackageView extends React.Component <{pkgTree: PackageTree}, {packages: string[]}> {
	constructor(props: any) {
		super(props);
		this.state = {
			packages: [],
		};
	}
	formatPackageData = (pkgIndx: number, pkgData: Package) => {

		return <div className="Package" key={pkgIndx}>
				<p className="Package-title" >{pkgData.id}</p>
				{pkgData.depends ? 
					pkgData.depends.map((dep: Pointer, depIndx: number) => {
						return <p key={depIndx}>{`*  ${dep.id}`}</p>
					})
				: null}
			</div>;
	}

	componentDidUpdate(prevProps: any) {
		// if (prevProps.pkgRoot.length !== this.props.pkgRoot.length) {
		// 	this.setState({packages: ...})
		// }
	}


	componentWillUnmount() {
	}

	render() {
		return (
			<div className="Tree">
				<div className="Tree-column"></div>
				<div className="Tree-column">
					{this.props.pkgTree.structure.map((pkg, index) => {
						return this.formatPackageData(index, pkg);
					})}
				</div>
				<div className="Tree-column"></div>
			</div>
		);
	}
}
export default PackageView;