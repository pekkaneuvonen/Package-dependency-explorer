import React, { Fragment, useContext, useState, useRef, useEffect } from 'react';
import { observer } from "mobx-react"
import { Tween } from 'react-gsap';

import AppState from '../AppState';
import { Package, Pointer } from '../model/PackageTree';


import box_closed from '../assets/box_closed.svg';
import box_opened from '../assets/box_opened.svg';
import arrow from '../assets/arrow-current.svg';

interface IPackageViewProps {
	packageClickHandler: (packagePointer: Pointer) => void,
}

const PackageView: React.FunctionComponent<IPackageViewProps> = observer((props: IPackageViewProps) => {

	const appState = useContext(AppState)
	const { breadcrumbs, currentPackage, prevPackage, packageInView, scrolling, dependeciesScrolling } = appState;

	const [ packageDrop, setPackageDrop ] = useState(false);

	const packageList = useRef<HTMLDivElement>(null);
	const currentPackageRef = useRef<HTMLDivElement>(null);
	const prevPackageRef = useRef<HTMLDivElement>(null);
	const upperDependencyContainer = useRef<HTMLDivElement>(null);
	const oneupDependency = useRef<HTMLDivElement>(null);
	const lowerDependencyContainer = useRef<HTMLDivElement>(null);
	const onedownDependency = useRef<HTMLDivElement>(null);

	const pkgButtonFactory = (pkgPointer: Pointer) => {
		return (event: any) => {
			return props.packageClickHandler(pkgPointer);
		}
	}
	
	const packageEntry = (pkgData: Package, index: number, transition?: string) => {
		const collapsed = transition === 'none';
		const collapsing = transition === 'out';
		const expanding = transition === 'in';

		return <div className="Package" key={index}>
			{collapsed ?
				<button className="Package-title-button element_button" onClick={pkgButtonFactory(pkgData.rootPointer)}>
					<img className="packageIcon" src={box_closed} alt="package icon closed"/>
					{pkgData.id}
				</button>
			:
			<div className={"Tree-package-column"} 
				ref={
					pkgData === currentPackage ? currentPackageRef 
				: 
					pkgData === prevPackage ? prevPackageRef 
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
					appState.prevPackage = undefined;
					setPackageDrop(false);
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
	const depsView = (pkgData: Package, latestCrumb: Pointer) => {
		const prevDep = breadcrumbs && breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].id : undefined;
		
		return <div className={packageInView ? "Dependency-content" : "Dependency-content element_hidden"} >
			{pkgData.depends ? 
			pkgData.depends.map((depsData: Pointer, depIndx: number) => {
				const opened = latestCrumb && latestCrumb.id === depsData.id;

				return <Tween key={depIndx} 
				duration={0.3} delay={0.5 + depIndx / 10}
				from={{css: {left: -32, opacity: '0'}}}>
					<div className="Pointer" ref={prevDep && prevDep === depsData.id ? oneupDependency : null} key={depIndx}>
						{depsData.enabled ? 
							<Fragment>
								<button className={opened ? "Pointer-title Pointer-title-button element_button Pointer-title-opened" : "Pointer-title Pointer-title-button element_button"} onClick={pkgButtonFactory(depsData)}>
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
	const RevDepsView = (pkgData: Package, latestCrumb: Pointer) => {
		const prevDep = breadcrumbs && breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2].id : undefined;

		return <div className={packageInView ? "Dependency-content" : "Dependency-content element_hidden"} >
			{pkgData.revDepends ? 
				pkgData.revDepends.map((revDepData: Pointer, revdepIndx: number) => {
					const opened = latestCrumb && latestCrumb.id === revDepData.id;

					return <Tween key={revdepIndx} 
					duration={0.3} delay={0.5 + revdepIndx / 10}
					from={{css: {left: -32, opacity: '0'}}}>
							<div className="Pointer Pointer-rev-dependency" ref={prevDep && prevDep === revDepData.id ? onedownDependency : null} key={revdepIndx}>
							<img className="pointerArrow rev-dependency-pointerArrow" src={arrow} alt="arrow" />
							<div className="dependency-connector rev-dependency-connector"/>
							<button className={opened ? "Pointer-title Pointer-title-button element_button Pointer-title-opened" : "Pointer-title Pointer-title-button element_button"} onClick={pkgButtonFactory(revDepData)}>
								<img className="pointerIcon" src={opened ? box_opened : box_closed} alt="package icon closed"/>
								{revDepData.id}
							</button>
						</div>
					</Tween>
				})
			: null}
    </div>;
	}

	const scrolledToTheEnd = (element: HTMLElement, diff: number | undefined) => {
		const scrollTreshold: number = 2;
		return element.scrollHeight - element.scrollTop === element.clientHeight || (diff && (Math.round(diff) < scrollTreshold && Math.round(diff) > -scrollTreshold));
	}
	const handlePackageListScroll = (event: any) => {
		let element: HTMLDivElement = event.target;
		let diff;
		// const { packageInView, scrolling } = this.props.appState;

		if (packageList.current && currentPackageRef.current) {
			diff = currentPackageRef.current.getBoundingClientRect().top - element.offsetTop - 16;
			if (currentPackageRef.current.clientHeight + diff < 0
				|| diff > packageList.current.clientHeight) {
				appState.packageInView = false;
			} else {
				appState.packageInView = true;
			}
		}
		// console.log("handlePackageListScroll diff : ", diff);
		if (scrolledToTheEnd(element, diff)) {
			console.log("PACKAGE LIST SCROLL END");
			appState.scrolling = false;
		}
	}
	const handleDependencyScroll = (event: any) => {
		let element: HTMLDivElement = event.target;
		let diff;
		// const { dependeciesScrolling } = this.props.appState;

		if (oneupDependency.current) {
			diff = oneupDependency.current.getBoundingClientRect().top - element.offsetTop - 16;
		} else if (onedownDependency.current) {
			diff = onedownDependency.current.getBoundingClientRect().top - element.offsetTop - 16;
		}
		// console.log("handleDependencyScroll diff : ", diff);
		if (scrolledToTheEnd(element, diff)) {
			console.log("DEP LIST SCROLL END");
			appState.dependeciesScrolling = false;

		}
	}
	useEffect(() => {
		const topMargin = 16;
		if (packageList.current && currentPackageRef.current) {
			console.log(" scrollToShowPackage packageList && currentPackageRef ");
			const listTop: number = packageList.current.getBoundingClientRect().top;
			const packageTop: number = currentPackageRef.current.getBoundingClientRect().top;
			const prevPackageCompensation = prevPackageRef.current && prevPackageRef.current.getBoundingClientRect().top < currentPackageRef.current.getBoundingClientRect().top ? prevPackageRef.current.clientHeight : 0;
			const diff = packageTop - listTop - topMargin - prevPackageCompensation;

			console.log("package diff : ", diff)
			if (!scrolledToTheEnd(packageList.current, diff)) {
				console.log("scroll !! : ");
				packageList.current.scrollBy(0, diff);
			} else {
				console.log("Scroll end?")
			}
		}

		if (upperDependencyContainer.current && oneupDependency.current) {
			const depTop: number = oneupDependency.current.getBoundingClientRect().top;
			const depContainerTop: number = upperDependencyContainer.current.getBoundingClientRect().top;
			const diff1 = depTop - depContainerTop - topMargin;

			if (!scrolledToTheEnd(upperDependencyContainer.current, diff1)) {
				upperDependencyContainer.current.scrollTo(0, diff1);
			}
		}

		if (lowerDependencyContainer.current && onedownDependency.current) {
			const revdepTop: number = onedownDependency.current.getBoundingClientRect().top;
			const revdepContainerTop: number = lowerDependencyContainer.current.getBoundingClientRect().top;
			const diff2 = revdepTop - revdepContainerTop - topMargin;

			if (!scrolledToTheEnd(lowerDependencyContainer.current, diff2)) {
				lowerDependencyContainer.current.scrollTo(0, diff2);
			}
		}

	}, [ packageDrop ]);

	useEffect(() => {
		// prevent launching scroll-to-view on user scroll
		if (currentPackage && currentPackage !== prevPackage && !packageDrop) {
			if (!scrolling) {
				setPackageDrop(true);
			}
			if (!dependeciesScrolling) {
				setPackageDrop(true);
			}
		}
	}, [ currentPackage, prevPackage, scrolling, dependeciesScrolling, packageDrop ]);

	return (
		<div className="Tree">
			<div className="Tree-column dependency-list-container" ref={upperDependencyContainer} onScroll={handleDependencyScroll}>
				{currentPackage ? 
					depsView(currentPackage, breadcrumbs[breadcrumbs.length - 2])
				:
					null
				}
			</div>
			<div className={"Tree-column"} ref={packageList} onScroll={handlePackageListScroll}>
				{appState.packageTree.structure.map((pkg: Package, index: number) => {
					if (pkg === currentPackage) {
						return packageEntry(pkg, index, 'in')
					} else if (pkg === prevPackage) {
						return packageEntry(pkg, index, 'out')
					} else {
						return packageEntry(pkg, index, 'none')
					}
				})}
			</div>
			<div className="Tree-column dependency-list-container" ref={lowerDependencyContainer} onScroll={handleDependencyScroll}>
				{currentPackage ? 
					RevDepsView(currentPackage, breadcrumbs[breadcrumbs.length - 2])
				:
					null
				}
			</div>
		</div>
	);
})
export default PackageView;