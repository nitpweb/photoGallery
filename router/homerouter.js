const express = require('express');
const homecontroller = require('../controller/homecontroller');
const router = express.Router();

router.get('/homeHeader', homecontroller.homeHeader);
router.get('/homeGallery', homecontroller.homeGallery);
router.get('/Architecture', homecontroller.Artitecture);
router.get('/civil', homecontroller.civil);
router.get('/cse', homecontroller.cse);
router.get('/electrical', homecontroller.electrical);
router.get('/ece', homecontroller.ece);
router.get('/mechanical', homecontroller.mechanical);
router.get('/mathematics', homecontroller.mathematics);
router.get('/chemistry', homecontroller.chemistry);
router.get('/physics', homecontroller.physics);
router.get('/create', homecontroller.create);
router.get(
  '/social_science_and_humanities',
  homecontroller.social_science_and_humanities
);

router.post('/upload', homecontroller.uploadImg);
router.post('/delete', homecontroller.delete);
router.get('/imgId', homecontroller.imgId);

module.exports = router;
