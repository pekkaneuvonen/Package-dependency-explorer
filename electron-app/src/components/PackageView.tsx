import React, { Fragment } from 'react';
import { observer } from "mobx-react"
import { Tween } from 'react-gsap';

import AppState from '../AppState';
import { Package, Pointer } from '../model/PackageTree';


import box_closed from '../assets/box_closed.svg';
import box_opened from '../assets/box_opened.svg';
import arrow from '../assets/arrow-current.svg';

interface IPackageViewProps {
	appState: AppState, 
	packageClickHandler: (packagePointer: Pointer) => void
}
interface IPackageViewState {
	packageDrop: boolean,
	// dependeciesScrolling: boolean,
	// packageInView: boolean,
}

@observer
class PackageView extends React.Component <IPackageViewProps, IPackageViewState> {
	packageList: React.RefObject<HTMLDivElement>;
	currentPackageRef: React.RefObject<HTMLDivElement>;
	prevPackageRef: React.RefObject<HTMLDivElement>;

	upperDependencyContainer: React.RefObject<HTMLDivElement>;
	oneupDependency: React.RefObject<HTMLDivElement>;
	
	lowerDependencyContainer: React.RefObject<HTMLDivElement>;
	onedownDependency: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props)
		this.packageList = React.createRef();
		this.currentPackageRef = React.createRef();
		this.prevPackageRef = React.createRef();

		this.upperDependencyContainer = React.createRef();
		this.oneupDependency = React.createRef();
		
		this.lowerDependencyContainer = React.createRef();
		this.onedownDependency = React.createRef();

		this.state = {
			packageDrop: false,
			// dependeciesScrolling: false,
			// packageInView: false,
		}
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
				return <div className="RootPointer" key={pkgIndx}>
					<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(pkgData.rootPointer)}>
						<img className="packageIcon" src={box_closed} alt="package icon closed"/>
						{pkgData.id}
					</button>
				</div>
			})}
    </Fragment>;
	}

	packageview = (pkgData: Package, index: number, transition?: string) => {
		const collapsed = transition === 'none';
		const collapsing = transition === 'out';
		const expanding = transition === 'in';

		return <div className="Package" key={index}>
			{collapsed ?
				<button className="Package-title-button element_button" onClick={this.pkgButtonFactory(pkgData.rootPointer)}>
					<img className="packageIcon" src={box_closed} alt="package icon closed"/>
					{pkgData.id}
				</button>
			:
			<div className={"Tree-package-column"} 
				ref={
					pkgData === this.props.appState.currentPackage ? this.currentPackageRef 
				: 
					pkgData === this.props.appState.prevPackage ? this.prevPackageRef 
				: 
					null
				}>
				<div className="Package-header" >
					<div className="Package-title" >
						<img className="packageIcon" src={box_opened} alt="package icon opened"/>
						{pkgData.id}
					</div>
				</div>

				<Tween
				from={expanding ? {css: {height: 0}} : undefined}
				to={collapsing ? {css: {height: 0}} : undefined}
				ease="easeOutQuart"
				duration={expanding ? 0.35 : 0.1}
				onComplete={collapsing ? () => {
					this.props.appState.prevPackage = undefined;
					this.setState({packageDrop: false});
				} : undefined}
				>
					<div className="Package-description">
						<div className="Package-description-content">
							{pkgData.getDescription()?.value.split(/\r?\n/).map((paragraph: string, indx: number) => {
								return <p key={indx} style={{marginBottom: '0', marginTop: '0'}}>{paragraph}</p>
							})}
						</div>
					</div>
				</Tween>
			</div>
			}
		</div>;
	}
	depsView = (pkgData: Package, latestCrumb: Pointer) => {
		const prevDep = this.props.appState.breadcrumbs && this.props.appState.breadcrumbs.length > 1 ? this.props.appState.breadcrumbs[this.props.appState.breadcrumbs.length - 2].id : undefined;
		
		return <div className={this.props.appState.packageInView ? "Dependency-content" : "Dependency-content element_hidden"} >
			{pkgData.depends ? 
			pkgData.depends.map((depsData: Pointer, depIndx: number) => {
				const opened = latestCrumb && latestCrumb.id === depsData.id;

				return <Tween key={depIndx} 
				duration={0.3} delay={0.5 + depIndx / 10}
				from={{css: {left: -32, opacity: '0'}}}>
					<div className="Pointer" ref={prevDep && prevDep === depsData.id ? this.oneupDependency : null} key={depIndx}>
						{depsData.enabled ? 
							<Fragment>
								<button className={opened ? "Pointer-title Pointer-title-button element_button Pointer-title-opened" : "Pointer-title Pointer-title-button element_button"} onClick={this.pkgButtonFactory(depsData)}>
									<img className="pointerIcon" src={opened ? box_opened : box_closed} alt="package icon closed"/>
									{depsData.id}
								</button>
								<img className="pointerArrow" src={arrow} alt="arrow" />
								<div className="dependency-connector"/>
							</Fragment>
						:
							<Fragment>
								<div className="Pointer-title element_disabled">
									<img className="pointerIcon element_disabled" src={box_closed} alt="package icon closed"/>
									{depsData.id}
								</div>
								<img className="pointerArrow element_disabled" src={arrow} alt="arrow" />
								<div className="dependency-connector"/>
							</Fragment>
						}
					</div>
				</Tween>
			})
			: null}
    </div>;
	}
	RevDepsView = (pkgData: Package, latestCrumb: Pointer) => {
		const prevDep = this.props.appState.breadcrumbs && this.props.appState.breadcrumbs.length > 1 ? this.props.appState.breadcrumbs[this.props.appState.breadcrumbs.length - 2].id : undefined;

		return <div className={this.props.appState.packageInView ? "Dependency-content" : "Dependency-content element_hidden"} >
			{pkgData.revDepends ? 
				pkgData.revDepends.map((revDepData: Pointer, revdepIndx: number) => {
					const opened = latestCrumb && latestCrumb.id === revDepData.id;

					return <Tween key={revdepIndx} 
					duration={0.3} delay={0.5 + revdepIndx / 10}
					from={{css: {left: -32, opacity: '0'}}}>
							<div className="Pointer Pointer-rev-dependency" ref={prevDep && prevDep === revDepData.id ? this.onedownDependency : null} key={revdepIndx}>
							<img className="pointerArrow rev-dependency-pointerArrow" src={arrow} alt="arrow" />
							<div className="dependency-connector rev-dependency-connector"/>
							<button className={opened ? "Pointer-title Pointer-title-button element_button Pointer-title-opened" : "Pointer-title Pointer-title-button element_button"} onClick={this.pkgButtonFactory(revDepData)}>
								<img className="pointerIcon" src={opened ? box_opened : box_closed} alt="package icon closed"/>
								{revDepData.id}
							</button>
						</div>
					</Tween>
				})
			: null}
    </div>;
	}

	scrollToShowPackage = () => {
		const topMargin = 16;
		if (this.packageList.current && this.currentPackageRef.current) {
			console.log(" scrollToShowPackage packageList && currentPackageRef ");
			const listTop: number = this.packageList.current.getBoundingClientRect().top;
			const packageTop: number = this.currentPackageRef.current.getBoundingClientRect().top;
			const prevPackageCompensation = this.prevPackageRef.current && this.prevPackageRef.current.getBoundingClientRect().top < this.currentPackageRef.current.getBoundingClientRect().top ? this.prevPackageRef.current.clientHeight : 0;
			const diff = packageTop - listTop - topMargin - prevPackageCompensation;

			console.log("package diff : ", diff)
			if (!this.scrolledToTheEnd(this.packageList.current, diff)) {
				console.log("scroll !! : ");
				this.packageList.current.scrollBy(0, diff);
			} else {
				console.log("Scroll end?")
			}
		}
	}
	scrollToShowPrevDependency = () => {
		const topMargin = 16;

		if (this.upperDependencyContainer.current && this.oneupDependency.current) {
			const depTop: number = this.oneupDependency.current.getBoundingClientRect().top;
			const depContainerTop: number = this.upperDependencyContainer.current.getBoundingClientRect().top;
			const diff1 = depTop - depContainerTop - topMargin;

			if (!this.scrolledToTheEnd(this.upperDependencyContainer.current, diff1)) {
				this.upperDependencyContainer.current.scrollTo(0, diff1);
			}
		}

		if (this.lowerDependencyContainer.current && this.onedownDependency.current) {
			const revdepTop: number = this.onedownDependency.current.getBoundingClientRect().top;
			const revdepContainerTop: number = this.lowerDependencyContainer.current.getBoundingClientRect().top;
			const diff2 = revdepTop - revdepContainerTop - topMargin;

			if (!this.scrolledToTheEnd(this.lowerDependencyContainer.current, diff2)) {
				this.lowerDependencyContainer.current.scrollTo(0, diff2);
			}
		}
	}

	scrolledToTheEnd = (element: HTMLElement, diff: number | undefined) => {
		const scrollTreshold: number = 2;
		return element.scrollHeight - element.scrollTop === element.clientHeight || (diff && (Math.round(diff) < scrollTreshold && Math.round(diff) > -scrollTreshold));
	}
	handlePackageListScroll = (event: any) => {
		let element: HTMLDivElement = event.target;
		let diff;
		// const { packageInView, scrolling } = this.props.appState;

		if (this.packageList.current && this.currentPackageRef.current) {
			diff = this.currentPackageRef.current.getBoundingClientRect().top - element.offsetTop - 16;
			if (this.currentPackageRef.current.clientHeight + diff < 0
				|| diff > this.packageList.current.clientHeight) {
				this.props.appState.packageInView = false;
			} else {
				this.props.appState.packageInView = true;
			}
		}
		// console.log("handlePackageListScroll diff : ", diff);
		if (this.scrolledToTheEnd(element, diff)) {
			console.log("PACKAGE LIST SCROLL END");
			this.props.appState.scrolling = false;
		}
	}
	handleDependencyScroll = (event: any) => {
		let element: HTMLDivElement = event.target;
		let diff;
		// const { dependeciesScrolling } = this.props.appState;

		if (this.oneupDependency.current) {
			diff = this.oneupDependency.current.getBoundingClientRect().top - element.offsetTop - 16;
		} else if (this.onedownDependency.current) {
			diff = this.onedownDependency.current.getBoundingClientRect().top - element.offsetTop - 16;
		}
		// console.log("handleDependencyScroll diff : ", diff);
		if (this.scrolledToTheEnd(element, diff)) {
			console.log("DEP LIST SCROLL END");
			this.props.appState.dependeciesScrolling = false;
		// } else {
		// 	this.setState({connectorCurrentHeight: diff});
		}
	}

	componentDidUpdate(prevProps: IPackageViewProps, prevState: IPackageViewState) {
		const { currentPackage, prevPackage, scrolling, dependeciesScrolling } = this.props.appState;

		// lifecycles own prevProps properties unusable because prevProps.appState.currentPackage and this.props.appState.currentPackage is always the same and up-to-date on currentPackage
		// appState.prevPackage property stored separately after transition completed

		// prevent launching scroll-to-view on user scroll
		if (currentPackage && currentPackage !== prevPackage && !this.state.packageDrop) {
			let stateChange = {...this.state};
			if (!scrolling) {
				stateChange.packageDrop = true;
				this.scrollToShowPackage();
			}
			if (!dependeciesScrolling) {
				stateChange.packageDrop = true;
				this.scrollToShowPrevDependency();
			}
			this.setState(stateChange);
		}

	}
	render() {
		const { breadcrumbs, currentPackage, prevPackage } = this.props.appState;

		return (
			<div className="Tree">
				<div className="Tree-column dependency-list-container" ref={this.upperDependencyContainer} onScroll={this.handleDependencyScroll}>
					{currentPackage ? 
						this.depsView(currentPackage, breadcrumbs[breadcrumbs.length - 2])
					:
						null
					}
				</div>
				<div className={"Tree-column"} ref={this.packageList} onScroll={this.handlePackageListScroll}>
					{this.props.appState.packageTree.structure.map((pkg: Package, index: number) => {
						if (pkg === currentPackage) {
							return this.packageview(pkg, index, 'in')
						} else if (pkg === prevPackage) {
							return this.packageview(pkg, index, 'out')
						} else {
							return this.packageview(pkg, index, 'none')
						}
					})}
				</div>
				<div className="Tree-column dependency-list-container" ref={this.lowerDependencyContainer} onScroll={this.handleDependencyScroll}>
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