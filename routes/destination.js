const express = require('express');
const router = express.Router();
const Area = require('../models/attraction.js');
const catchAsync = require('../utilities/catchAsync.js');
const expError = require('../utilities/expError.js');
const {areaSchema} = require('../schemas.js');

const validateArea = (req, res, next) => {
    
    const {error}= areaSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expError(msg, 400);
    } else{
        next();
    }
    
}

router.get('/', catchAsync(async (req, res) => {
    const areas = await Area.find({});
    res.render('attraction/attractions-list.ejs', {areas});
}))


router.get('/new', (req, res) => {
    res.render('attraction/new.ejs');
})

router.post('/', validateArea, catchAsync(async(req, res) => {
    
    const area = new Area(req.body.area);
    await area.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/attraction/${area._id}`);
    
}))

router.get('/:id', catchAsync(async (req, res) => {
    const area = await Area.findById(req.params.id).populate('reviews');
    if(!area){
        req.flash('error', 'Cannot find that destination!!!');
        return res.redirect('/attraction');
    }
    res.render('attraction/show.ejs', {area});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const area = await Area.findById(req.params.id);
    res.render('attraction/edit.ejs', {area});
}))

router.put('/:id', validateArea, catchAsync(async (req, res) => {
    const {id} = req.params;
    const area = await Area.findByIdAndUpdate(id, {...req.body.area});
    res.redirect(`/attraction/${area._id}`);
}))

router.delete('/:id',catchAsync(async (req, res) => {
    const {id} = req.params;
    await Area.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted destination!');
    res.redirect('/attraction');
}))

module.exports = router;