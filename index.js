const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const readline = require('readline');
const { google } = require('googleapis');
const app = express();
const fileUpload = require('express-fileupload');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(fileUpload());

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.

/**
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

/**
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
let getAccessToken = (oAuth2Client, callback) => {
   const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
   });
   console.log('Authorize this app by visiting this url:', authUrl);
   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
   });
   rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
         if (err) return console.error('Error retrieving access token', err);
         oAuth2Client.setCredentials(token);
         // Store the token to disk for later program executions
         fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
         });
         callback(oAuth2Client);
      });
   });
}


/**
    * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
    */

///////////////////////////////////Uploading Files/////////////////////////////////////////////

app.post("/upload", (req, res) => {

   let authorize = (credentials, callback) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
         client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
         if (err) return getAccessToken(oAuth2Client, callback);
         oAuth2Client.setCredentials(JSON.parse(token));
         callback(oAuth2Client);
      });
   }

   fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(content), getFolder);
   });

   let getFolder = (auth) => {
      const drive = google.drive({ version: 'v3', auth });
      drive.files.list({
         corpora: 'user',
         q: `name='${req.body.branch}'`,
         fields: 'files(*)',
      }, (err, res) => {
         if (err) return console.log('The API returned an error: ' + err);
         const files = res.data.files;
         let fileId = files.map(function (file) {
            return file.id;
         })
         async function copy_upload() {
            try {
               await req.files.file.mv(__dirname + "/images/" + req.files.file.name.toLowerCase());
               const compressedFiles = await imagemin(['images/*'], {
                  destination: "images/compressed",
                  plugins: [
                     imageminWebp({ quality: 15 })
                  ]
               });
               await uploadFile(auth, fileId, compressedFiles[0].destinationPath);
            } catch{
               console.log("error occured in async function.");
            }
         }
         copy_upload();
      });
   }

   let uploadFile = (auth, parent, filePath) => {
      const drive = google.drive({ version: 'v3', auth });
      var fileMetadata = {
         'name': req.files.file.name,
         'parents': parent,
      };
      var media = {
         mimeType: 'image/*',
         body: fs.createReadStream(__dirname + "/" + filePath)
      };
      drive.files.create({
         resource: fileMetadata,
         media: media,
         fields: 'id'
      }, function (err, res) {
         if (err) {
            // Handle error
            console.log(err);
         } else {
            fs.unlink(__dirname + "/images/" + req.files.file.name);
            fs.unlink(__dirname + "/" + filePath);
            console.log('File Id: ', res.data.id);
         }
      });
   }
   res.redirect("/");
});


//////////////////////////////////////Creating folders/////////////////////////////////////////
app.get("/create", (req, res) => {
   let authorize = (credentials, callback) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
         client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
         if (err) return getAccessToken(oAuth2Client, callback);
         oAuth2Client.setCredentials(JSON.parse(token));
         callback(oAuth2Client);//list files and upload file

      });
   }

   fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(content), getFolder);
   });


   let getFolder = (auth) => {
      const drive = google.drive({ version: 'v3', auth });
      drive.files.list({
         corpora: 'user',
         q: "name='NITP'",
         fields: 'files(*)',
      }, (err, res) => {
         if (err) return console.log('The API returned an error: ' + err);
         const files = res.data.files;
         if (files.length === 0) {
            const drive = google.drive({ version: 'v3', auth });
            let fileMetadata = {
               'name': 'NITP',
               'mimeType': 'application/vnd.google-apps.folder'
            };
            drive.files.create({
               resource: fileMetadata,
               fields: 'id'
            }, function (err, folder) {
               if (err) {
                  // Handle error
                  console.error(err);
               } else {
                  let fileMetadata = {
                     'name': 'Architecture',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Civil Engineering',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Computer Science & Engineering',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Electrical Engineering',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Electronics & Communication Engineering',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Mechanical Engineering',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Mathematics',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Chemistry',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Physics',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
                  fileMetadata = {
                     'name': 'Social Sciences & Humanities',
                     'mimeType': 'application/vnd.google-apps.folder',
                     'parents': [folder.data.id],
                  };
                  drive.files.create({
                     resource: fileMetadata,
                     fields: 'id'
                  });
               }
            });
         }
      });
   }
   res.redirect("/");
});

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/public/html/upload.html");
});

/////////////////////////////////Return JSON to branch.html////////////////////////////////////

app.post('/json', (req, response) => {
   var images = [];
   let authorize = (credentials, callback) => {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
         client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
         if (err) return getAccessToken(oAuth2Client, callback);
         oAuth2Client.setCredentials(JSON.parse(token));
         callback(oAuth2Client);
      });
   }

   fs.readFile('credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      authorize(JSON.parse(content), getFolder);
   });

   let getFolder = (auth) => {
      const drive = google.drive({ version: 'v3', auth });
      drive.files.list({
         corpora: 'user',
         q: `name='${req.body.branch}'`,
         fields: 'files(*)',
      }, (err, res) => {
         if (err) return console.log('The API returned an error: ' + err);
         const files = res.data.files;
         let fileId = files.map(function (file) {
            return file.id;
         })
         getList(drive, fileId, '');
      });
   }

   let getList = (drive, parent, pageToken) => {
      drive.files.list({
         corpora: 'user',
         q: `parents='${parent[0]}'`,
         pageToken: pageToken ? pageToken : '',
         fields: 'nextPageToken, files(*)',
      }, (err, res) => {
         if (err) return console.log('The API returned an error: ' + err);
         const files = res.data.files;
         if (files.length) {
            files.forEach(file => {
               images.push(file.webContentLink);
            });
            response.json(images);

         } else {
            console.log('No files found.');
         }
      });
   }
});

app.get('/:branch', (req, res) => {
   res.sendFile(__dirname + "/public/html/" + req.params.branch);
});

app.listen("3000", () => {
   console.log("app is running at port 3000");
})