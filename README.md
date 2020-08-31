# Package-dependency-explorer
Small exercise app demonstrating one way of revealing information from a system file in Debian and Ubuntu systems. 

The app searches for the var/lib/dpkg/status file (found especially in Debian / Ubuntu systems) and maps it's contents for examination. The program displays the different packages, their descriptions, dependecies and reverse dependencies. Also a simple breadcrumb / path of the visited package views is displayed.


## The applications can be downloaded from heroku: https://package-explorer-download.herokuapp.com/
Windows and OSX application are also provided. A static mock data is used for simulating the actual status.real file when running on other platforms. The application was developed in MacOs environment and building the app to run on multiple different systems (Windows 10 and Linux) was the hardest part. At the moment there are .dmg package for MacOs, .AppImage for Linux and simply zipped application directory containing the .exe for Windows.

The application is not signed or certified in any official way, so running them will require the user to override the security alerts:
* _right-clicking and choosing open on Mac_
* _tapping the permission to run as a program checkbox on Linux_
* _choosing first more info and then clicking run anyway on Windows_

The application was created with Electron, React and Typescript, Electron-builder was used for build and packaging. Many thanks goes to Yhirose for the original template https://github.com/yhirose/react-typescript-electron-sample-with-create-react-app-and-electron-builder.
