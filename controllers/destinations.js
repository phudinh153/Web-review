const Area = require('../models/attraction.js');
module.exports.index = async (req, res) => {
    const areas = await Area.find({});
    res.render('attraction/attractions-list.ejs', {areas});
};

module.exports.renderNewForm = (req, res) => {
    res.render('attraction/new.ejs');
};

module.exports.addDestination = async(req, res) => {
    const area = new Area(req.body.area);
    area.author = req.user._id;
    await area.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/attraction/${area._id}`);
    
};

module.exports.showDest = async (req, res) => {
    const area = await Area.findById(req.params.id).populate({path: 'reviews',
        populate: {
            path: 'author'
        }}).populate('author');
    if(!area){
        req.flash('error', 'Cannot find that destination!!!');
        return res.redirect('/attraction');
    }
    res.render('attraction/show.ejs', {area});
};

module.exports.renderEdit = async (req, res) => {
    const area = await Area.findById(req.params.id);
    if(!area){
        req.flash('error', 'Cannot find that destination!!!');
        return res.redirect('/attraction');
    }
    res.render('attraction/edit.ejs', {area});
};

module.exports.updateDest = async (req, res) => {
    const {id} = req.params;
    const area = Area.findById(id);
    const des = await Area.findByIdAndUpdate(id, {...req.body.area});
    req.flash('success', 'Successfully updated destination!');
    res.redirect(`/attraction/${area._id}`);
};

module.exports.deleteDest = async (req, res) => {
    const {id} = req.params;
    await Area.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted destination!');
    res.redirect('/attraction');
};