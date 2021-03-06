import { observable } from "mobx";
import PackageTree, { Package, Pointer } from './model/PackageTree';


/**
 * Application state / root state manager.
 */
export default class AppState {

	@observable public currentPackage?: Package;
	@observable public nextPackage?: Package;
	@observable public prevPackage?: Package;
	@observable public scrolling: boolean;
	@observable public dependeciesScrolling: boolean;
	@observable public packageInView: boolean;
	public transition: boolean;
	
	@observable public breadcrumbs: Pointer[];
	@observable public packageTree: PackageTree;

	constructor() {
		this.packageTree = new PackageTree("Package: Loading root...");
		this.breadcrumbs = [];
		this.scrolling = false;
		this.dependeciesScrolling = false;
		this.packageInView = false;
		this.transition = false;
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
		this.scrolling = false;
		this.dependeciesScrolling = false;
		// check if chosen package was actually the previous in breadcrumbs-path
		if (pkgPointer && this.breadcrumbs.length > 1 && pkgPointer.id === this.breadcrumbs[this.breadcrumbs.length - 2].id) {
			this.cutToBreadcrumb(this.breadcrumbs.length - 2);
		} else {
			if (pkg && pkgPointer) {
				this.breadcrumbs.push(pkgPointer);
			} else {
				this.breadcrumbs = [];
			}
			this.prevPackage = this.currentPackage;
			this.currentPackage = pkg;
		}
	}

	public cutToBreadcrumb(crumbIndex: number) {
		const pkg: Package | undefined = this.getPackage(this.breadcrumbs[crumbIndex].id);
		if (pkg && crumbIndex < this.breadcrumbs.length - 1) {
			this.transition = true;
			this.breadcrumbs = this.breadcrumbs.slice(0, crumbIndex + 1);
			this.prevPackage = this.currentPackage;
			this.currentPackage = pkg;
		} else {
			this.updateCurrentPackage(undefined);
		}
	}
}