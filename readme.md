# course on udemy


## default dirs and files of an electron app
```
|-imageShrink
|-+**app**
|--+css
|----style.css
|----materialize.min.css
|----all.min.css
|--+js
|----materialize.min.js
|--+webfonts
|----fa.brands
|---about.html
|---index.html
|-+**assets**
|--+icons
|----Icon_16x16.png
|----Icon_1024x1024.png
|---+linux
|-----icon.png
|---+mac
|-----icon.icns
|---+win
|-----icon.ico
|-+**node_modules**
|--+"whole-shit-of-node"
|-+**sources**
|--+icons
|----Icon_16x16.png
|----Icon_1024x1024.png
|---+linux
|-----icon.png
|---+mac
|-----icon.icns
|---+win
|-----icon.ico
|--debian.json
|--**main.js**
|--package.json
|--package-lock.json

|-+ = folder
|-- ? file
|-+**folder** = initial and manual created folder
|--**file**   = main (file)players
```

### explanation of dirs and relationships 

#### **app**
This directory contains all visible pages/views of the app:
* index.html --> it's the main surface of the app
* about.html --> it's a sub-surface which can be reached by the menu
- > In the sub-direcotries are parts of the styling and functionalities of the pages
      ipcRenderer.on('image:done', () => {
- > receives and sends data of the main by ipcRenderer (on/send)

#### **assets**
It's the location of your images and so on:
* icons --> this is the icon/symbol for your application used by main.js

#### **sources**
It's the location of your images and so on:
* icons --> this is the icon/symbol for your application used by the build-scripts in package.json

#### **main.js**
here is the heart of the app. 
- define the actions
- define the menu
- define the environment
- define the view (height/width)
- log the actions
- manage the communication between main and subpage by ipcMain





# electron from scratch by traversy
## ImageShrink

### Initial creation
```bash
npm init # set main.js as main and insert under scripts: "start": "electron ."
npm i -D electron #install save-dev of electron
touch main.js
```
in a html-file to prevent security risks, insert a meta-tag
```html
<meta
      http-equiv="Content-Security-Policy"
      content="script-src 'self' 'unsafe-inline'"
    />
```
### add a logger 
add log-files
```bash
npm i electron-log
```
### create an executable file for windows, macOs or liux
create an app which you can use in production
```bash
# for use in npm scripts
npm install electron-packager --save-dev
# for use from cli
npm install electron-packager -g
```
create scripts for creation-commands
  on debian: 
  ```bash
  npm install -g electron-installer-debian
  ```
  create **debian.json**:
  ```json
  {
    "dest": "release-builds/",
    "icon": "assets/icons/Icon_1024x1024.png",
    "categories": [
      "Utility"
    ],
    "lintianOverrides": [
      "changelog-file-missing-in-native-package"
    ]
  }
  ```
add scripts to package.json
```bash
"package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds",
"package-win": "electron-packager . image-shrink --overwrite --asar=true --platform=win32 --arch=ia32 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=\"Electron Tutorial App\"",
"package-linux": "electron-packager . image-shrink --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icons/Icon_1024x1024.png --prune=true --out=release-builds",
"create-installer-win": "node installers/windows/createinstaller.js",
"create-debian-installer": "electron-installer-debian --src release-builds/image-shrink-linux-x64/ --arch amd64 --config debian.json",
``` 

###### https://www.udemy.com/course/electron-from-scratch/learn/lecture/19823834

