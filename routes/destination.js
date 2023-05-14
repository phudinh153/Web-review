const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync.js');
const {isLoggedIn, checkAuthor, validateArea} = require('../middleware.js');
const destinations = require('../controllers/destinations.js');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const {storage} = require('..')

router.route('/')
    .get(catchAsync(destinations.index))
    // .post(isLoggedIn, validateArea, catchAsync(destinations.addDestination));
    .post(upload.single('area[image]'), (req, res) => {
        res.send(req.body, req.file)
    })

router.get('/new', isLoggedIn, destinations.renderNewForm);



router.route('/:id')
    .get(catchAsync(destinations.showDest))
    .put(isLoggedIn, checkAuthor, validateArea, catchAsync(destinations.updateDest))
    .delete(isLoggedIn, checkAuthor, catchAsync(destinations.deleteDest));

router.get('/:id/edit', isLoggedIn, checkAuthor, catchAsync(destinations.renderEdit));




module.exports = router;