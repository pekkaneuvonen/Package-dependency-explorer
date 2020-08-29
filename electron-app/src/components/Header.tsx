import React from 'react';
import { observer } from "mobx-react"

import AppState from '../AppState';

// const Header2 = (props: any) => {
// 	const [breadcrumbs, setBreadcrumbs] = useState(props.breadcrumbs);
// 	const scrollToRef = (ref: React.MutableRefObject<any>) => window.scrollTo(0, ref.current.clientHeight);

// 	const myRef = useRef(null)
// 	useEffect(() => {
// 		console.log("scrollToRef")
// 		scrollToRef(myRef)
// 	}, [ breadcrumbs ])

// 	return (
// 		<div className="Header">
// 			<div className="Header-column">
// 				<div className="Header-column-title">
// 				Dependencies
// 				</div>
// 			</div>
// 			<div className="Header-column">
// 				<button onClick={props.homeClickHandler}>HOME</button>
// 				<div className="Header-breadcrumbs-container" ref={myRef}>
// 					{breadcrumbs.map((crumb: string, indx: number) => {
// 						return <div key={indx} className="breadCrumb"><p>{crumb}</p></div>
// 					})}
// 				</div>	
// 				<div className="Header-column-title">
// 					{breadcrumbs.length > 0 ?
// 						'Current Package'
// 					:
// 						'Home'
// 					}
// 				</div>
// 			</div>
// 			<div className="Header-column">
// 				<div className="Header-column-title">
// 				Reverse Dependencies
// 				</div>
// 			</div>
// 		</div>
// 	);
// } 
// export default Header2;

@observer
class Header extends React.Component <{appState: AppState, homeClickHandler: () => void, crumbClickHandler: (index: number) => void}, {}> {
	latestRef: React.RefObject<HTMLParagraphElement>;

	constructor(props: any) {
		super(props)
		this.latestRef = React.createRef();
	}
	crumbButtonFactory = (crumbIndex: number) => {
		return (event: any) => {
			return this.props.crumbClickHandler(crumbIndex);
		}
	}
	scrollToMyRef = () => {
		if (this.latestRef.current) {
			this.latestRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});	
		}
	}
	componentDidUpdate() {
		if (this.props.appState.breadcrumbs.length > 0) {
			this.scrollToMyRef();
		}
	}

	render() {
		const { breadcrumbs, currentPackage } = this.props.appState;

		return (
			<div className="Header">
				<div className="Header-column">
					<div className="Header-column-top"></div>
					<div className="Header-column-title">
						Dependencies
					</div>
				</div>
				<div className="Header-column">
						<div className={currentPackage && breadcrumbs.length > 0 ? "Header-column-top appear_up" : "Header-column-top hidden_down"}>
							<button className="Header-column-infoButton element_button" onClick={this.props.homeClickHandler}>Reset to root</button>
							<div className="Header-breadcrumbs-container" >
								<div className="breadcrumbs_content" >
									{breadcrumbs.map((crumb: string, indx: number) => {
										return <button key={indx} className="breadCrumb element_button" onClick={this.crumbButtonFactory(indx)}>
											<div className="breadcrumbDivCircle upper_div_circle"/>
											<p ref={indx === breadcrumbs.length-1 ? this.latestRef : null}>{crumb}</p>
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