import React, { Fragment } from 'react';
import { observer } from "mobx-react"

import AppState from '../AppState';
import PackageTree, { Package, Pointer } from '../model/PackageTree';
// import { packageRootFromFile } from './FileController';
// import * as path from 'path';

import box_closed from '../assets/box_closed.svg';
import box_opened from '../assets/box_opened.svg';

@observer
class PackageView extends React.Component <{appState: AppState, packageClickHandler: (packagePointer: Pointer) => void}> {
	oneupDependency: React.RefObject<HTMLParagraphElement>;

	constructor(props: any) {
		super(props)
		this.oneupDependency = React.createRef();
	}

	pkgButtonFactory = (pkgPointer: Pointer) => {
		return (event: any) => {
			return this.props.packageClickHandler(pkgPointer);
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
					<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(pkgData.rootPointer)}>
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
	depsView = (pkgData: Package, latestCrumb: Pointer) => {
		const prevDep = this.props.appState.breadcrumbs && this.props.appState.breadcrumbs.length > 1 ? this.props.appState.breadcrumbs[this.props.appState.breadcrumbs.length - 2].id : undefined;
		
		return <Fragment>
			{pkgData.depends ? 
			pkgData.depends.map((depsData: Pointer, depIndx: number) => {
				return <div className="Pointer" ref={prevDep && prevDep === depsData.id ? this.oneupDependency : null} key={depIndx}>
					{depsData.enabled ? 
						<Fragment>
							<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(depsData)}>
								<img className="packageIcon" src={box_closed} alt="package icon closed"/>
								{depsData.id}
							</button>
							{ latestCrumb && latestCrumb.id === depsData.id ? 
								<div className="dependency-stripe" />
							: null }
						</Fragment>
					:
						<Fragment>
							<div className="Package-title Package-title-disabled">
								<img className="packageIcon element_disabled" src={box_closed} alt="package icon closed"/>
								{depsData.id}
							</div>
						</Fragment>
					}
				</div>
			})
			: null}
    </Fragment>;
	}
	RevDepsView = (pkgData: Package, latestCrumb: Pointer) => {
		const prevDep = this.props.appState.breadcrumbs && this.props.appState.breadcrumbs.length > 1 ? this.props.appState.breadcrumbs[this.props.appState.breadcrumbs.length - 2].id : undefined;

		return <div>
			{pkgData.revDepends ? 
				pkgData.revDepends.map((revDepData: Pointer, revdepIndx: number) => {
					return <div className="Pointer" ref={prevDep && prevDep === revDepData.id ? this.oneupDependency : null} key={revdepIndx}>
						{ latestCrumb && latestCrumb.id === revDepData.id ? 
							<div className="dependency-stripe rev-dependency-stripe" />
						: null }
						<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(revDepData)}>
							<img className="packageIcon" src={box_closed} alt="package icon closed"/>
							{revDepData.id}
						</button>
					</div>
				})
			: null}
    </div>;
	}


	scrollToPrevDependency = () => {
		if (this.oneupDependency.current) {
			this.oneupDependency.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});	
		}
	}
	componentDidUpdate(prevProps: any) {
		const { breadcrumbs } = this.props.appState;
		if (breadcrumbs && breadcrumbs.length > 1) {
			this.scrollToPrevDependency();
		}
	}


	render() {
		const { currentPackage, breadcrumbs } = this.props.appState;
		return (
			<div className="Tree">
				<div className="Tree-column">
					{currentPackage ? 
						this.depsView(currentPackage, breadcrumbs[breadcrumbs.length - 2])
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
						this.RevDepsView(currentPackage, breadcrumbs[breadcrumbs.length - 2])
					:
						null
					}
				</div>
			</div>
		);
	}
}
export default PackageView;