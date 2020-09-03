import React from 'react';
import { observer } from "mobx-react"

import AppState from '../AppState';
import { Pointer } from '../model/PackageTree';

@observer
class Header extends React.Component <{appState: AppState, homeClickHandler: () => void, crumbClickHandler: (index: number) => void}, {}> {
	latestRef: React.RefObject<HTMLParagraphElement>;
	crumbContent: React.RefObject<HTMLDivElement>;
	crumbContainer: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props)
		this.latestRef = React.createRef();
		this.crumbContent = React.createRef();
		this.crumbContainer = React.createRef();
	}
	crumbButtonFactory = (crumbIndex: number) => {
		const { breadcrumbs } = this.props.appState;
		if (crumbIndex !== breadcrumbs.length-1) {
			return (event: any) => {
				return this.props.crumbClickHandler(crumbIndex);
			}
		} else {
			return (event: any) => null;
		}
	}
	scrollToLatestCrumb = () => {
		if (this.crumbContent.current && this.crumbContainer.current) {
			this.crumbContainer.current.scrollTo(0, this.crumbContent.current.clientHeight - this.crumbContainer.current.clientHeight); 
		}
	}
	componentDidUpdate() {
		if (this.props.appState.breadcrumbs.length > 0) {
			this.scrollToLatestCrumb();
		}
	}

	render() {
		const { breadcrumbs, currentPackage } = this.props.appState;

		return (
			<div className="Header">
				<div className="Header-column">
					<div className="appId">
						<p className="appId-title">Package Dependency Explorer</p>
						<p className="appId-description">for Debian and Ubuntu systems</p>
						<div className="appId-description appId-description-divider"/>
						<p className="appId-description">Sample project for exercising desktop app development and production.</p>
					</div>


					<div className="Header-column-top">
					</div>
					<div className="Header-column-title">
						Dependencies
					</div>
				</div>
				<div className="Header-column">
						<div className={currentPackage && breadcrumbs.length > 0 ? "Header-column-top Header-column-top-middle appear_up" : "Header-column-top Header-column-top-middle hidden_down"}>
							<button className="Header-column-infoButton element_button" onClick={this.props.homeClickHandler}>Reset to root</button>
							<div className="Header-breadcrumbs-container customized-scrollbar" ref={this.crumbContainer}>
								<div className="breadcrumbs_content customized-scrollbar" ref={this.crumbContent}>
									{breadcrumbs.map((crumb: Pointer, indx: number) => {
										return <button key={indx} className={ indx === breadcrumbs.length-1 ? "breadCrumb element_button current-crumb" : "breadCrumb element_button"} onClick={this.crumbButtonFactory(indx)}>
											<div className="breadcrumbDivCircle upper_div_circle"/>
											<p ref={indx === breadcrumbs.length-1 ? this.latestRef : null} >{crumb.id}</p>
										</button>
									})}
								</div>
							</div>
							<div className="Header-column-info">
								Path to current
							</div>
						</div>
					<div className="Header-column-title">
					<div className={currentPackage && breadcrumbs.length > 0 ? "middle_column_triangle" : "middle_column_triangle hidden_up"}></div>
						{currentPackage ?
							'Current Package'
						:
							'Home'
						}
					</div>
				</div>
				<div className="Header-column">
					<div className="Header-column-top"></div>
					<div className="Header-column-title">
					Reverse Dependencies
					</div>
				</div>
			</div>
		);
	}
}
export default Header;