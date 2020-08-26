import React from 'react';
import PackageTree, { Package, Pointer } from '../model/PackageTree';
// import { packageRootFromFile } from './FileController';
// import * as path from 'path';

import box_closed from '../assets/box_closed.svg';
import box_opened from '../assets/box_opened.svg';

class PackageView extends React.Component <{pkgTree: PackageTree, currentPackage?: Package, packageClickHandler: (packageId: string) => void}, {packages: string[]}> {
	constructor(props: any) {
		super(props);
		this.state = {
			packages: [],
		};
	}

	pkgButtonFactory = (pkgId: string) => {
		return (event: any) => {
			return this.props.packageClickHandler(pkgId);
		}
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
	homeview = (pkgIndx: number, pkgData: Package) => {

		return <div className="Package" key={pkgIndx}>
			<button className="Package-title-button" onClick={this.pkgButtonFactory(pkgData.id)}>
				<img className="packageIcon" src={box_closed} alt="package icon closed"/>
				{pkgData.id}
			</button>
			</div>;
	}
	packageview = (pkgData: Package) => {

		return <div className="Package">
			<div className="Package-title" onClick={this.pkgButtonFactory(pkgData.id)}>
				<img className="packageIcon" src={box_opened} alt="package icon closed"/>
				{pkgData.id}
			</div>
			<div className="Package-description">
				{pkgData.getDescription()?.value}
			</div>
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
					{this.props.currentPackage ? 
					this.packageview(this.props.currentPackage)
					:
					this.props.pkgTree.structure.map((pkg, index) => {
						return this.homeview(index, pkg);
					})}
				</div>
				<div className="Tree-column"></div>
			</div>
		);
	}
}
export default PackageView;