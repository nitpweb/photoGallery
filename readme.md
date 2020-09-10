## GET request for receiving image ID

GET request to any page which is available for receiving image ID through our API doesn't require any authentication. You may get the id of images which is available in the specified folder by sending a GET request to `https://phogallery.herokuapp.com/imgId` URL and setting the branch key value to the folder name (i.e:- branch: 'Computer Science & Engineering').
For dressing the image URL, you have to inclose the image id received from API by `https://drive.google.com/uc?id=......&export=download`.
Branch values which our API currently providing are:

- Architecture
- Chemistry
- Civil Engineering
- Computer Science & Engineering
- Electronics & Communication Engineering
- Electrical Engineering
- Mathematics
- Mechanical Engineering
- Physics
- Social Sciences & Humanities
- homeGallery
- homeHeader

#### You may see the requests in postman for better understanding of the given routes

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/3877c1c42f6024250c56)

---

## for setup:-

step 1: clone repository in local storage. (insure that there is 'compressed'
folder inside 'images' folder)

step 2: since code is written in node js. So please download and install stable
version of node javascript engine from 'https://nodejs.org/en/'.

step 3: open cmd and copy the full path of folder.

step 4: Download credentials.json by clicking button 'Enable the Drive Api'
(Desktop App) in 'https://developers.google.com/drive/api/v3/quickstart/nodejs'
and copy it in working repository.

step 5: run 'npm i' & then 'node server.js' in any command line interface.

step 6: For creating folder in google drive, run 'localhost:3000/create' in browser
and then make the folder accessible to all with the link in google drive.

step 7: Copy the link appeared in the cmd and run it in browser and give the permission.

step 8: Enter the code appeared in webpage in the cmd
(Token generated and folder is created in google drive).

Gotcha, setup completed.

> caution:
> If you want to delete photo or folder related to this project, then remove it from trash also. because it carries it's parent id and may show itself in results.
