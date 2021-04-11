// Feature-Flag base version

## Initial setup

If you have not `.env` file in root folder create it and fill it. This file set
environment (global) variables for current application.

We must use STAGE env for develop and testing.

#### Create`.env` file in the root

```$xslt
MONGO_CONNECTION_STRING=mongodb://localhost:27017/feature-Flag

JWT_KEY=jwtSecretKey
JWT_EXPIRES_IN=10d

CLIENT_HOST=http://localhost:8000

MAIL_SILENT=false
AWS_SES_ACCESS_KEY_ID=AKI...
AWS_SES_SECRET_ACCESS_KEY=bTz/c...
AWS_SES_FROM=i@...
AWS_SES_REGION=us-west-2

SENTRY=
```

#### Local Install

Run `npm install`.

Check if you have locally installed `nodemon` and `mongodb`.

`npm run local` start the server locally with connection to local MongoDB.

#### Postman

### Something to Try

Try to send request from Postman "GET localhost:5000/info", If you happen to
have Postman already installed if not read Step 3 (yes you can skip steps). If
you get response 'Status 200' your server is active and working fine.

### API tests

### Database

### Getting started for new contributors

#### Step 1 - clone the project

1. Follow https://github.com/bogutski/...
2. Click on `Clone or download` button and copy **the path**.
3. Open your WebStorm and close current project.
4. Click on `Check out from Version Control`.
5. Paste **the path** into `URL` field.
6. Chose directory for your project. Create a pasv-server folder in the list of
   your WebStorm projects, if needed. **ALERT!** Make sure you remember that
   directory, we will have to find it later.
7. Click `Clone` button.

#### Step 2 - Install and run local MongoDB

##### Windows OS

Windows 7

Please use version 4.29 or older!!!
There is dropdown menu on the right-hand side when you will be choosing which
version to download!

Windows 10 and higher

please follow this tutorial.

1. Follow https://www.mongodb.com/download-center/community?jmp=docs and
   download MongoDB Community Edition.
2. Use [this](https://docs.mongodb.com/manual/installation/) tutorial to install
   your MongoDB.

Specialties

For Windows 7

During the installation you need to make sure all the rest of the applications
are closed such as:
1.Browsers (Chrome,FireFox,Opera, EI etc.)
2.All Webstorm projects etc.

3. Any other active application When Installation bar/process will hang up for
   few min (2-3min), at around 85%, please open your System Monitor
   (shortcut - Ctrl+Shift+Esc) and close process powershell.exe - it is
   unintended behavior, but it will finish installation process and everything
   should run fine after REBOOT!
   DO NOT FORGET TO REBOOT!!!

3. Run MongoDB-Compass - of course you should install MongoDB-Compass first. To
   install it use this link
   https://www.mongodb.com/try/download/compass and get the latest version.

4. Make New Connection. For that, find the `MONGO_CONNECTION_STRING` path
   in `.env` file located in the pasv-server project.
   Copy `mongodb://localhost:27017/codewars` and paste it in the text area (
   Paste your connection string (SRV or Standard )).

5. Press `connect`. If it connects you should see collection access page on the
   left side and be able to play with DB.

6. To properly run your environment you will need to add information to Path
Environment Variable As example, usually it is following path to the MongoDB
server ( "C:\Program Files\MongoDB\Server\4.2\bin" )
This is how to do so.

System Properties -> Environment Variables -> Path -> Edit -> New -> paste your
path Add it to both System and User Environments, you can call it "MongoDB"

##### mac OS

1. Go to the official Mongo DB page make sure all commands below haven't
   changed:
   https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
2. Check if all additional command-line tools are installed before (according to
   the article)
3. Go to the Mac terminal, run commands down below (run all commands according
   to latest MongoDB version):
    * Brew tap mongodb/brew
    * Brew install mongodb-community@4.2
    * Brew services start mongodb-community@4.2
4. Download MongoDB Compass, (Connect on localhost:27017)

#### Step 3 - Install and run Postman

1. Follow https://www.getpostman.com/downloads/.
2. Choose your OS and press `Download`.
3. Create a new workspace.
4. Click on `Import` button. Then click on `Choose files`.
5. Now you need find a directory with your project. Then select `docs` folder
   and then `postman` folder.
6. Choose `Feature-Flag.postman_collection.json`
   and `Feature-Flag-LOCAL.postman_environment.json` files in
   /yourProjectDirectory/docs/postman and open them both
7. In the upper right corner of the Postman interface, find a drop-down
   with `No Environment` field. Change it to `Feature-Flag-LOCAL`.

#### Step 4 - Running local server and sending first request

1. Open WebStorm and pasv-server project.
2. Use `npm install` command to download all modules.
3. Install nodemon. To install nodemon, type `npm install nodemon`. Then close
   and reopen WebStorm.
4. Use `npm run local` command to start server.
    * If you have Windows OS - it is not so bad, but add to fun of setting up
      the environment. Open `File` -> `Settings` -> `Tools ` -> `Terminal` and
      make sure that in the `Shell path` you
      have `C:\Program Files\Git\bin\sh.exe`.
    * Then use `npm config set script-shell "C:\Program Files\git\bin\bash.exe"`
      command and try to use `npm run local` command once again. If it is still
      not working, use your head and hands, possibly Google, even if that did
      not help - go https://www.apple
      .com/shop/ and get a new Apple MacPC or Laptop, any will do.
5. After all, open Postman and open `Feature-Flag Collection`. Click on it, then
   find `INFO` folder and send `GET localhost:5000/info` request.
6. If you get a status 200 response - my warmest congratulations all is set and
   working fine, hug yourself!

May the FORCE BE WITH YOU!
