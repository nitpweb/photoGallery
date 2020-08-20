const express = require('express');
const homecontroller = require('../controller/homecontroller');
const router = express.Router();

router.get('/', homecontroller.upload);

router.get('/Architecture.html', homecontroller.Artitecture);
router.get('/civil.html', homecontroller.civil);
router.get('/cse.html', homecontroller.cse);
router.get('/electrical.html', homecontroller.electrical);
router.get('/ece.html', homecontroller.ece);
router.get('/mechanical.html', homecontroller.mechanical);
router.get('/mathematics.html', homecontroller.mathematics);
router.get('/chemistry.html', homecontroller.chemistry);
router.get('/physics.html', homecontroller.physics);
router.get('/create', homecontroller.create);
router.get(
  '/social_science_and_humanities.html',
  homecontroller.social_science_and_humanities
);

router.post('/upload', homecontroller.uploadImg);
router.post('/delete', homecontroller.delete);
router.post('/json', homecontroller.json);

module.exports = router;
