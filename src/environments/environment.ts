// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBi5pMpGAUHYafwFAwbCQtupko6u7v02oQ',
    authDomain: 'ng-fitness-tracker-ec675.firebaseapp.com',
    databaseURL: 'https://ng-fitness-tracker-ec675.firebaseio.com',
    projectId: 'ng-fitness-tracker-ec675',
    storageBucket: 'ng-fitness-tracker-ec675.appspot.com',
    messagingSenderId: '458391142147'
  }
};
