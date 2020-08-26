import React from 'react';

// <Header breadcrumbs={this.state.breadcrumbs} crumbClickHandler={this.crumbClickHandler} platform={currentPlatform} />

class Header extends React.Component <{breadcrumbs: string[], crumbClickHandler: (id: string) => void, platform: string}, {}> {

	render() {
		return (
			<div className="Header">
				<div className="Header-column">
					<div className="Header-column-title">
					Dependencies
					</div>
				</div>
				<div className="Header-column">
					<div className="Header-breadcrumbs-container"></div>
					<div className="Header-column-title">
					Current Package
					</div>
				</div>
				<div className="Header-column">
					<div className="Header-column-title">
					Reverse Dependencies
					</div>
				</div>
			</div>
		);
	}
}
export default Header;