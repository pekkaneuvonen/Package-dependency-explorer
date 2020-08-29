import { observable } from "mobx";
import PackageTree, { Package, Pointer } from './model/PackageTree';


/**
 * Application state / root state manager.
 */
export default class AppState {

	@observable public currentPackage?: Package;
	@observable public breadcrumbs: string[];
	@observable public packageTree: PackageTree;

	constructor() {
		this.packageTree = new PackageTree("Package: root");
		this.breadcrumbs = [];
	}

	public setPackageTree(newTree: PackageTree) {
		this.packageTree = newTree;
	}
	public getPackage = (id: string) => {
		if (this.packageTree.structure) {
			return this.packageTree.structure.find(pkg => pkg.id === id);
		}
	}
	public updateCurrentPackage(pkgId: string | undefined) {
		let pkg: Package | undefined;
		if (pkgId) {
			pkg = this.getPackage(pkgId);
		}
		if (pkg && this.currentPackage) {
			this.breadcrumbs.push(String(this.currentPackage.id));
		// if (pkg) {
		// 	this.breadcrumbs.push(String(pkg.id));
		} else {
			this.breadcrumbs = [];
		}
		this.currentPackage = pkg;
	}

	public cutToBreadcrumb(crumbIndex: number) {
		const pkg: Package | undefined = this.getPackage(this.breadcrumbs[crumbIndex]);
		this.breadcrumbs = this.breadcrumbs.slice(0, crumbIndex);
		if (pkg) {
			this.currentPackage = pkg;
		}
	}
}