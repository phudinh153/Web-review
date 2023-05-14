const Area = require('../models/attraction.js');
const Review = require('../models/review.js');

module.exports.addReview = async (req, res) => {
    const area = await Area.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    area.reviews.push(review);
    await review.save();
    await area.save();
    req.flash('success', 'New review created!');
    res.redirect(`/attraction/${area._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Area.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/attraction/${id}`);
};