import React, { Fragment } from 'react';
import { observer } from "mobx-react"

import AppState from '../AppState';
import PackageTree, { Package, Pointer } from '../model/PackageTree';
// import { packageRootFromFile } from './FileController';
// import * as path from 'path';

import box_closed from '../assets/box_closed.svg';
import box_opened from '../assets/box_opened.svg';

@observer
class PackageView extends React.Component <{appState: AppState, packageClickHandler: (packageId: string) => void}> {

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
	homeview = () => {
		const { structure } = this.props.appState.packageTree;
		return <Fragment>
			{structure.map((pkgData: Package, pkgIndx: number) => {
				return <div className="Package" key={pkgIndx}>
					<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(pkgData.id)}>
						<img className="packageIcon" src={box_closed} alt="package icon closed"/>
						{pkgData.id}
					</button>
				</div>
			})}
    </Fragment>;
	}
	
	packageview = (pkgData: Package) => {

		return <div className="Package">
			<div className="Package-title" >
				<img className="packageIcon" src={box_opened} alt="package icon opened"/>
				{pkgData.id}
			</div>
			<div className="Package-description">
				{pkgData.getDescription()?.value}
			</div>
		</div>;
	}
	depsView = (pkgData: Package) => {
		return <Fragment>
			{pkgData.depends ? 
			pkgData.depends.map((depsData: Pointer, depIndx: number) => {
				return <div className="Package" key={depIndx}>
					{depsData.enabled ? 
						<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(depsData.id)}>
							<img className="packageIcon" src={box_closed} alt="package icon closed"/>
							{depsData.id}
						</button>
					:
						<div className="Package-title Package-title-disabled">
							<img className="packageIcon element_disabled" src={box_closed} alt="package icon closed"/>
							{depsData.id}
						</div>
					}
				</div>
			})
			: null}
    </Fragment>;
	}
	RevDepsView = (pkgData: Package) => {
		return <div>
			{pkgData.revDepends ? 
			pkgData.revDepends.map((revDepData: Pointer, revdepIndx: number) => {
				return <div className="Package" key={revdepIndx}>
					<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(revDepData.id)}>
						<img className="packageIcon" src={box_closed} alt="package icon closed"/>
						{revDepData.id}
					</button>
				</div>
			})
		: null}
    </div>;
	}

	render() {
		const { currentPackage } = this.props.appState;
		return (
			<div className="Tree">
				<div className="Tree-column">
					{currentPackage ? 
						this.depsView(currentPackage)
					:
						null
					}
				</div>
				<div className="Tree-column">
					{currentPackage ? 
					this.packageview(currentPackage)
					:
					this.homeview()

					// this.props.pkgTree.structure.map((pkg, index) => {
					// 	return this.homeview(index, pkg);
					// })
					}
				</div>
				<div className="Tree-column">
					{currentPackage ? 
						this.RevDepsView(currentPackage)
					:
						null
					}
				</div>
			</div>
		);
	}
}
export default PackageView;