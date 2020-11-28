// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userServiceBaseUrl: 'https://spring-course-c4e5a.uc.r.appspot.com',
  logedInServiceBaseUrl: 'https://spring-course-c4e5a.uc.r.appspot.com/play',
  firebaseConfig: {
    apiKey: 'AIzaSyANzM8X0iicUDfNLfnm_kedFoQBon8bEC8',
    authDomain: 'spring-course-c4e5a.firebaseapp.com',
    databaseURL: 'https://spring-course-c4e5a.firebaseio.com',
    projectId: 'spring-course-c4e5a',
    storageBucket: 'spring-course-c4e5a.appspot.com',
    messagingSenderId: '684118827128',
    appId: '1:684118827128:web:69671e429f7937f2814d8d',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
