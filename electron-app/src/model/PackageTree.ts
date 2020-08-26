
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

    constructor (id: string, data: string, fields: Field[]) {
			this.id = id;
			this.data = data;
			this.fields = fields;
    }
}
export class Pointer {
	id: string;
	enabled: boolean;

	constructor (id: string, enabled: boolean) {
		this.id = id;
		this.enabled = enabled;
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


			// add depends and rev-depends
			for (const pkg of pkgList) {
				console.log("pkg ", pkg);

				let deps;
				// go through depends
				const foundDeps = pkg.fields.find(field => field.name === "Depends");
				if (foundDeps) {
					// separate packages and alternative packages
					const depsRaw = foundDeps.value.split(',').map((dep: string, index: number) => {
						return dep.split('|');
					});

					// trim whitespaces and versions and add to 'deps'
					deps = depsRaw.flat().map((dep: string, index: number) => {
						return dep.trim().split(/\s/)[0];
					});
				}

				// go through pre-depends
				const foundPreDeps = pkg.fields.find(field => field.name === "Pre-Depends");
				if (foundPreDeps) {
					// separate packages and alternative packages
					const predepsRaw = foundPreDeps.value.split(',').map((predep: string, index: number) => {
						return predep.split('|');
					});
					// trim whitespaces and versions and add to 'deps'
					deps = predepsRaw.flat().map((predep: string, index: number) => {
						return predep.trim().split(/\s/)[0];
					});
				}

				if (deps) {
					deps.forEach(dep => {
						if (!pkg.depends) {
							pkg.depends = [];
						}
						const depTarget = pkgList.find(depPkg => depPkg.id === dep);
						if (depTarget) {
							if (!depTarget.revDepends) {
								depTarget.revDepends = [];
							}
							const rev_depLink: Pointer = new Pointer(pkg.id, true);
							depTarget.revDepends.push(rev_depLink);
						}
						const depLink: Pointer = new Pointer(dep, depTarget !== undefined);
						pkg.depends.push(depLink)
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