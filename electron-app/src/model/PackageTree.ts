class Field { 
	name: string;
	value: string;
	constructor (n: string, v: string) {
		this.name = n;
		this.value = v;
	}
}

export class Package {
	id: string;
	data: string;
	fields: Field[];
	depends?: Pointer[];
	revDepends?: Pointer[];
	rootPointer: Pointer;

  constructor (id: string, data: string, fields: Field[]) {
		this.id = id;
		this.data = data;
		this.fields = fields;
		this.rootPointer = new Pointer(this.id, true, false, false);
	}
	
	getDescription = () => {
		return this.fields.find(field => field.name === "Description");
	}
}
export class Pointer {
	id: string;
	enabled: boolean;
	alternative: boolean;
	reverse: boolean;

	constructor (id: string, enabled: boolean, alternative: boolean, reverse: boolean) {
		this.id = id;
		this.enabled = enabled;
		this.alternative = alternative;
		this.reverse = reverse;
	}
}

export default class PackageTree {
    structure: Package[];

    getPackage = (pkgData: string): Package => {
			// split to lines
			const pkgLines: string[] = pkgData.split(/\r?\n/);

			// init fields array
			let pkgFields: Field[] = [];
			for (const line of pkgLines) {
				if (line === "") {
					// line is empty
					continue;
				}
				// check for folded fields
				if (/^\s/.test(line)) {
					// concat to latest fields value
					pkgFields[pkgFields.length-1].value = pkgFields[pkgFields.length-1].value.concat('\n' + line);
					// should the folded lines be restructured somehow for nicer wrapping?
				} else {
					// add new field to array
					const keyValuePair = line.split(':');
					if (keyValuePair.length > 0 ) {
						pkgFields.push(new Field(keyValuePair[0].trim(), keyValuePair[1].trim()))
					} else {
						// no colon found: either folded check leaks or empty line in data
					}
				}
			}
			const foundName = pkgFields.find(field => field.name === "Package");

			let newPackage: Package = new Package(
				foundName ? foundName.value : 'unknown', 
				pkgData,
				pkgFields
			)
			return newPackage;
    }

    public getStructure = (rootData: string): Package[] => {
			// split string to paragraphs
			let paragraphList = rootData.split(/\n\s*\n/);
			// get rid of empties
			paragraphList = paragraphList.filter(paragraph => paragraph.length !== 0);

			// construct the list of packages
			const pkgList: Package[] = paragraphList.map((paragraph: string, index: number) => {
				return this.getPackage(paragraph);
			})

			// sort alphabetically
			pkgList.sort((pkg1, pkg2) => {
				if (pkg1.id < pkg2.id) {
					return -1;
				}
				if (pkg1.id > pkg2.id) {
					return 1;
				}
				return 0;
			});


			// add depends and rev-depends for every package
			for (const pkg of pkgList) {
				// console.log("pkg ", pkg);

				let deps;
				// go through depends
				const foundDeps = pkg.fields.find(field => field.name === "Depends");
				if (foundDeps) {
					// separate packages and alternative packages
					deps = foundDeps.value.split(',').map((dep: string, index: number) => {
						return dep.split('|').map((alternative: string, altIndx: number) => {
							// trim whitespaces and skip versions
							return new Pointer(alternative.trim().split(/\s/)[0], true, dep.indexOf('|') > -1, false);
						});
					});

					// flat all to one level
					deps = deps.flat();
				}

				// go through pre-depends
				const foundPreDeps = pkg.fields.find(field => field.name === "Pre-Depends");
				if (foundPreDeps) {
					// separate packages and alternative packages
					const predeps = foundPreDeps.value.split(',').map((predep: string, index: number) => {
						return predep.split('|').map((alternative: string, altIndx: number) => {
							// trim whitespaces and skip versions
							return new Pointer(alternative.trim().split(/\s/)[0], true, predep.indexOf('|') > -1, false);
						});
					});

					// flat and combine to normal deps
					deps ? deps.concat(predeps.flat()) : predeps.flat();
				}

				// go through dependencies
				if (deps) {
					deps.forEach(dep => {
						if (!pkg.depends) {
							pkg.depends = [];
						}

						// check for duplicates, some dependencies are mentioned several times for different version numbers
						if (pkg.depends.find(pointer => pointer.id === dep.id)) {
							// already on deps list
						} else {
							// list self as a rev-dep on all dep-packages found on root pkgList  
							const depTarget = pkgList.find(depPkg => depPkg.id === dep.id);
							if (depTarget) {
								if (!depTarget.revDepends) {
									depTarget.revDepends = [];
								}
								// check for duplicates, just in case
								if (depTarget.revDepends.find(revDepPointer => revDepPointer.id === pkg.id)) {
									// already on targets rev-dep list?
								} else {
									const rev_depLink: Pointer = new Pointer(pkg.id, true, false, true);
									depTarget.revDepends.push(rev_depLink);
								}
							} else {
								// mark dependency as disabled if link target not found  
								dep.enabled = false;
							}
							pkg.depends.push(dep)
						}
					})
				}
			}
			
			if (pkgList.length > 1) {
				console.log("pkgList : \n", pkgList);
			}

			return pkgList;
    }
    constructor(rootData: string) {
			this.structure = this.getStructure(rootData);
    }

}