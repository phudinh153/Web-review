const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync.js');
const {isLoggedIn, checkAuthor, validateArea} = require('../middleware.js');
const destinations = require('../controllers/destinations.js');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(destinations.index))
    .post(isLoggedIn, upload.array('area[images]'), validateArea, catchAsync(destinations.addDestination));
   

router.get('/new', isLoggedIn, destinations.renderNewForm);



router.route('/:id')
    .get(catchAsync(destinations.showDest))
    .put(isLoggedIn, checkAuthor, upload.array('area[images]'), validateArea, catchAsync(destinations.updateDest))
    .delete(isLoggedIn, checkAuthor, catchAsync(destinations.deleteDest));

router.get('/:id/edit', isLoggedIn, checkAuthor, catchAsync(destinations.renderEdit));




module.exports = router;