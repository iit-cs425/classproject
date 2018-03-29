# classproject
Class project for cs452

This README contains information about how to build and run this app.  If you come across anything tricky, or just good to know for four people who don't know NodeJS, put it in here.

## How do you run the app?
The app (will be) laid out like [this sample app](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/hello-world).  It contains:
 - `app.js` - the actual code
 - `package.json` - metadata about the app like dependencies, and a `scripts` section that defines things like `"start": "node app.js"`.
 - `app.yaml` - contains App Engine-specific info.

 To actually run the app, head over to its folder and run `sudo PORT=80 npm start`.  This sets the PORT variable to 80 for later access by `app.js`, and runs the `start` script specified by `package.json` (in this case, `node app.js`).
