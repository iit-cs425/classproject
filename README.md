# classproject
Class project for cs452

This README contains information about how to build and run this app.  If you come across anything tricky, or just good to know for four people who don't know Node.js, put it in here.

## How is the app organized?
The app is laid out like [this sample app](https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/appengine/hello-world).  It contains:
 - `app.js` - the main code
 - `test.js` - the tests
 - `package.json` - metadata like dependencies, and a `scripts` section that tells npm how to run and test the file.
 - `app.yaml` - contains App Engine-specific info.  Maybe this should be deleted.

## How do you install the app?

 1. Install required software (already done on the server):
    ```
    sudo apt-get install nodejs git gawk gcc-6 mysql-server mysql-client
    ```
    On your own computer, you'll need to install Git, MariaDB, and Node.js.  Node is very easy to install, but MariaDB will need some extra configuration.  I edited my `my.ini` configuration to remove the `skip-networking` line, added a `cs425` user, and ran ``GRANT ALL PRIVILEGES ON `cs425`.* TO 'cs425'@'localhost';``.

 2. Download the project from GitHub:
    ```
    git clone https://github.com/iit-cs425/classproject.git
    ```
 3. Install required Node packages:
	```
	cd classproject
	npm install
	```
To run the app, make sure you're in the `classproject` directory and run `sudo PORT=80 npm start`.

## Helpful resources
 - [What are callbacks? How do you write good callback code?](http://callbackhell.com/)

## What's Travis doing?

When you push a commit or make a PR, Travis CI will automatically run the tests in `test.js`.  `.travis.yml` contains the Travis settings; you can get to the Travis dashboard through GitHub by going to Settings > Integrations & Services > Travis CI.  (You may need to link Travis with your GitHub account first.)
