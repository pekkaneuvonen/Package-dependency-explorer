import * as path from 'path';

const remote = window.require('electron').remote;
const rendererFs = remote.require('fs');
const rendererFsPromises = remote.require('fs').promises;

// static paths
// static mock data asset
const appPath: string = remote.app.getAppPath();
const pathToStaticSource = path.resolve(appPath, './src/assets/sample_status.real');

// local dir for copied mock data
const userDataPath: string = remote.app.getPath('userData');
const mockDataDir = path.resolve(userDataPath, "mockdata");


const listDir = (dirPath: string) => {
	console.log(" dir list in ", dirPath);
	( async () => {
		try {
			const files = await rendererFsPromises.readdir( dirPath );
			for ( const file of files ) {
				console.log( "file: ", dirPath, " -- ", file );
			}
		}
		catch ( e ) {
			console.error( "We've thrown! Whoops!", e );
		}

	})();

}

const getPackageRoot = (statusFilePath: string, statusFileName: string): Promise<string> => {
	const pathToLocalAsset = path.resolve(statusFilePath, statusFileName);
	const mockAsset = path.resolve(mockDataDir, statusFileName);
	
	// const homeDir1 = path.resolve('home');
	// console.log(" user home dir 1: ", homeDir1);
	// listDir(homeDir1);

	const homedir = require('os').homedir();
	console.log(" user home dir: ", homedir);
	listDir(homedir);

	// const homePath: string = remote.app.getPath('home');
	// console.log(" user home path: ", homePath);
	// listDir(homePath);

	if (rendererFs.existsSync(pathToLocalAsset)) {
		console.log("local statusFile exists");
		return Promise.resolve(pathToLocalAsset);
	} else if (rendererFs.existsSync(mockAsset)) {
		console.log("mockAsset exists!");
		return Promise.resolve(mockAsset);
	} else {
		console.log("local statusFile or mockData doesn't exist");
		return rendererFsPromises.mkdir(mockDataDir)
		.then(() => {
			return new Promise((resolve,reject) => {
				rendererFsPromises.copyFile(pathToStaticSource, mockAsset)
				.then(() => {
					console.log('Static source was copied to mockdata.');
					resolve(mockAsset);
				}).catch(() => {
					console.log('The file could not be copied');
					reject(new Error("Unable to copy package status file."));
				})
			});
		}).catch(() => {
			console.log('The mockdata dir could not be created?');
			console.log('Can mockdata dir exist without mockAsset in it?');
			if (rendererFs.existsSync(mockDataDir)) {
				return new Promise((resolve,reject) => {
					rendererFsPromises.copyFile(pathToStaticSource, mockAsset)
					.then(() => {
						console.log('Static source was copied to mockdata.');
						resolve(mockAsset);
					}).catch(() => {
						console.log('The file could not be copied');
						reject(new Error("Unable to copy package status file."));
					})
				});
			}
		})
	}
}

export function packageRootFromFile(statusFilePath: string, statusFileName: string): Promise<string> {

	return getPackageRoot(statusFilePath, statusFileName)
	.then((resultFile: string) => {
		return new Promise((resolve,reject) => {
			console.log("statusFileToUse ", resultFile);
			rendererFs.readFile(resultFile, 'utf8', (err: any, data: any) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	});
}
