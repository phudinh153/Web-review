const express = require('express');
const router = express.Router();
const Area = require('../models/attraction.js');
const catchAsync = require('../utilities/catchAsync.js');
const expError = require('../utilities/expError.js');
const {areaSchema} = require('../schemas.js');
const {isLoggedIn, checkAuthor, validateArea} = require('../middleware.js');
const destinations = require('../controllers/destinations.js');

router.get('/', catchAsync(destinations.index));


router.get('/new', isLoggedIn, destinations.renderNewForm);

router.post('/', isLoggedIn, validateArea, catchAsync(destinations.addDestination));

router.get('/:id', catchAsync(destinations.showDest));

router.get('/:id/edit', isLoggedIn, checkAuthor, catchAsync(destinations.renderEdit));

router.put('/:id', isLoggedIn, checkAuthor, validateArea, catchAsync(destinations.updateDest));

router.delete('/:id', isLoggedIn, checkAuthor, catchAsync(destinations.deleteDest));

module.exports = router;