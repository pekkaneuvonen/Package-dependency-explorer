import { observable } from "mobx";
import PackageTree, { Package, Pointer } from './model/PackageTree';


/**
 * Application state / root state manager.
 */
export default class AppState {

	@observable public currentPackage?: Package;
	@observable public currentPointer?: Pointer;
	@observable public breadcrumbs: Pointer[];
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
	public updateCurrentPackage(pkgPointer: Pointer | undefined) {
		let pkg: Package | undefined;
		if (pkgPointer) {
			pkg = this.getPackage(pkgPointer.id);
		}
		if (pkgPointer && this.breadcrumbs.length > 1 && pkgPointer.id === this.breadcrumbs[this.breadcrumbs.length - 2].id) {
				this.cutToBreadcrumb(this.breadcrumbs.length - 2);
		} else {
			if (pkg && pkgPointer) {
				// this.breadcrumbs.push(this.currentPointer);
				this.breadcrumbs.push(pkgPointer);
			// if (pkg) {
			// 	this.breadcrumbs.push(String(pkg.id));
			} else {
				this.breadcrumbs = [];
			}
			this.currentPackage = pkg;
			this.currentPointer = pkgPointer;
		}
	}

	public cutToBreadcrumb(crumbIndex: number) {
		const pkg: Package | undefined = this.getPackage(this.breadcrumbs[crumbIndex].id);
		if (pkg) {
			this.currentPointer = this.breadcrumbs[crumbIndex];
			this.breadcrumbs = this.breadcrumbs.slice(0, crumbIndex);
			this.breadcrumbs.push(this.currentPointer);
			this.currentPackage = pkg;
		} else {
			this.updateCurrentPackage(undefined);
		}
	}
}