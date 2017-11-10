# Earn-A-Bike Shop Manager

![Logo](/src/assets/images/logo.png?raw=true)

The Earn-A-Bike Shop Manager is a desktop application built with Electron that tracks manager and volunteer hours for a bike shop. It was originally built for [Worcester Earn-A-Bike Shop](http://worcesterearnabike.org/).

### Features

*   Tracks manager and volunteer visit info (date, hours, time in, time out, notes)
*   Manage bikes earned by volunteers, including a safety checklist that must be completed before bike is signed off
*   Users and managers can update contact information
*   Can export data to CSV for easy analysis

## Development
This app is built with [React](https://reactjs.org/docs/hello-world.html), Redux and [Electron](https://electron.atom.io/docs/). Also uses [Stylus](http://stylus-lang.com/) for css and [electron-json-config](https://github.com/de-luca/electron-json-config) for data persistence.

Install dependencies:
```
yarn install
```
To start the webpack server, run:
```
yarn dev
```
In another console tab, run Electron simultaneously:
```
yarn testDev
```

Chrome dev tools are opened automatically in dev.

## Packaging and Deploying
Super easy with electron, just run the following commands.

Build app:
```
yarn build
```

Package to Mac app:
```
yarn package-mac
```
Package to Windows app:
```
yarn package-win
```

Output will be in `/builds`.

## Updating

Since this app is intended to run on a particular desktop computer, it can be updated by replacing the old version of the build with the new version on that machine.
User data is persisted in between instances by `electron-json-config` in `app.getPath('userData')/config.json`, which is loaded when the app starts, so there should be no need to re-import data.
However, if the data structure changed between versions, use `src/utils/updateData.js` to update the data accordingly on first run. At some point I'll figure out automatic updates...

## License

Licensed under the BSD 3-clause "New" or "Revised" License.
