const fs = require('fs-extra');
const { google } = require('googleapis');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const rootPath = `${__dirname}/../`;
const TOKEN_PATH = `${rootPath}token.json`;

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
};

exports.uploadImg = async (req, response) => {
  let authorize = (credentials, callback) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  };

  fs.readFile('credentials.json', (err, content) => {
    if (err)
      return response
        .status(500)
        .json('Error loading client secret file:', err);
    authorize(JSON.parse(content), getFolder);
  });

  let getFolder = (auth) => {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list(
      {
        corpora: 'user',
        q: `name='${req.body.branch}'`,
        fields: 'files(*)',
      },
      (err, res) => {
        if (err)
          return response.status(400).json('The API returned an error: ' + err);
        const files = res.data.files;
        let fileId = files.map(function (file) {
          return file.id;
        });
        async function compressFile() {
          try {
            await req.files.file.mv(
              `${rootPath}/images/` + req.files.file.name.toLowerCase()
            );
            const compressedFiles = await imagemin(['images/*'], {
              destination: `${rootPath}/images/compressed`,
              plugins: [imageminWebp({ quality: 15 })],
            });
            await uploadFile(auth, fileId, compressedFiles[0].destinationPath);
          } catch {
            console.log('error occured in compressing image.');
          }
        }
        compressFile();
      }
    );
  };

  let uploadFile = (auth, parent, filePath) => {
    const drive = google.drive({ version: 'v3', auth });
    var fileMetadata = {
      name: `${req.files.file.name}.webp`,
      parents: parent,
    };
    var media = {
      mimeType: 'image/*',
      body: fs.createReadStream(filePath),
    };
    drive.files.create(
      {
        resource: fileMetadata,
        media: media,
        fields: 'id',
      },
      function (err, res) {
        if (err) {
          // Handle error
          response.status(409).json('error occured in uploading image.');
        } else {
          fs.unlink(`${rootPath}/images/` + req.files.file.name);
          fs.unlink(filePath);
          console.log('File Id: ', res.data.id);
        }
      }
    );
  };
  response.status(200).json('uploaded successfully.');
};

exports.create = async (req, res) => {
  let authorize = (credentials, callback) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client); //list files and upload file
    });
  };

  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), getFolder);
  });

  let getFolder = (auth) => {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list(
      {
        corpora: 'user',
        q: "name='NITP'",
        fields: 'files(*)',
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length === 0) {
          const drive = google.drive({ version: 'v3', auth });
          let fileMetadata = {
            name: 'NITP',
            mimeType: 'application/vnd.google-apps.folder',
          };
          drive.files.create(
            {
              resource: fileMetadata,
              fields: 'id',
            },
            function (err, folder) {
              if (err) {
                // Handle error
                console.error(err);
              } else {
                let fileMetadata = {
                  name: 'Architecture',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Civil Engineering',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Computer Science & Engineering',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Electrical Engineering',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Electronics & Communication Engineering',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Mechanical Engineering',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Mathematics',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Chemistry',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Physics',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'Social Sciences & Humanities',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'homeHeader',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
                fileMetadata = {
                  name: 'homeGallery',
                  mimeType: 'application/vnd.google-apps.folder',
                  parents: [folder.data.id],
                };
                drive.files.create({
                  resource: fileMetadata,
                  fields: 'id',
                });
              }
            }
          );
        }
      }
    );
  };
  res.status(200).json('Folder Created');
};

exports.delete = async (req, response) => {
  let authorize = (credentials, callback) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  };

  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), getFile);
  });

  let getFile = (auth) => {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.delete(
      {
        corpora: 'user',
        fileId: `${req.body.fileId}`,
        fields: 'files(*)',
      },
      (err, res) => {
        if (err)
          return response.status(500).json('The API returned an error: ' + err);
        // const files = res.data.files;
        console.log('selected file is deleted');
      }
    );
  };
  response.status(200).json('image deleted');
};

exports.imgId = async (req, response) => {
  var images = [];
  let authorize = (credentials, callback) => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  };

  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), getFolder);
  });

  let getFolder = (auth) => {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.list(
      {
        corpora: 'user',
        q: `name='${req.body.branch}'`,
        fields: 'files(*)',
      },
      (err, res) => {
        if (err)
          return response.status(500).json('The API returned an error: ' + err);
        const files = res.data.files;
        let fileId = files.map(function (file) {
          return file.id;
        });
        getList(drive, fileId, '');
      }
    );
  };

  let getList = (drive, parent, pageToken) => {
    drive.files.list(
      {
        corpora: 'user',
        q: `parents='${parent[0]}'`,
        pageToken: pageToken ? pageToken : '',
        fields: 'nextPageToken, files(*)',
      },
      (err, res) => {
        if (err)
          return response.status(400).json('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          files.forEach((file) => {
            images.push(file.id);
          });
          response.status(200).json(images);
        } else {
          response.status(404).json('Image not found!');
        }
      }
    );
  };
};

exports.homeHeader = async (req, res) => {
  res.sendFile('homeheader.html', { root: `${rootPath}/public/html/` });
};

exports.homeGallery = async (req, res) => {
  res.sendFile('homeGallery.html', { root: `${rootPath}/public/html/` });
};

exports.Artitecture = async (req, res) => {
  res.sendFile('Architecture.html', { root: `${rootPath}/public/html/` });
};

exports.chemistry = async (req, res) => {
  res.sendFile('chemistry.html', { root: `${rootPath}/public/html/` });
};
exports.civil = async (req, res) => {
  res.sendFile('civil.html', { root: `${rootPath}/public/html/` });
};
exports.cse = async (req, res) => {
  res.sendFile('cse.html', { root: `${rootPath}/public/html/` });
};
exports.ece = async (req, res) => {
  res.sendFile('ece.html', { root: `${rootPath}/public/html/` });
};
exports.electrical = async (req, res) => {
  res.sendFile('electrical.html', { root: `${rootPath}/public/html/` });
};
exports.mathematics = async (req, res) => {
  res.sendFile('mathematics.html', { root: `${rootPath}/public/html/` });
};
exports.mechanical = async (req, res) => {
  res.sendFile('mechanical.html', { root: `${rootPath}/public/html/` });
};
exports.physics = async (req, res) => {
  res.sendFile('physics.html', { root: `${rootPath}/public/html/` });
};
exports.social_science_and_humanities = async (req, res) => {
  res.sendFile('social_science_and_humanities.html', {
    root: `${rootPath}/public/html/`,
  });
};
