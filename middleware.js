const {areaSchema, reviewSchema} = require('./schemas.js');
const expError  = require('./utilities/expError.js');
const Area = require('./models/attraction.js');
const Review = require('./models/review.js');


module.exports.isLoggedIn = (req, res, next) => {
    const {id} = req.params;
    if(!req.isAuthenticated()){
        if (!['/login', '/register', '/'].includes(req.originalUrl) ) {
            req.session.returnTo = (req.query._method  === 'DELETE' ? `/campgrounds/${id}` : req.originalUrl);
            if(req.originalUrl.split('/').pop() === 'reviews'){
                contReviews = req.originalUrl.split('/');
                contReviews.splice(contReviews.indexOf('reviews'), 1);
                req.session.returnTo = contReviews.join('/');
            }
         
          }
        
        req.flash('error', 'You must login first');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateArea = (req, res, next) => {
    
    const {error}= areaSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expError(msg, 400);
    } else{
        next();
    }
    
}

module.exports.checkAuthor = async(req, res, next) => {
    const {id} = req.params;
    const area = await Area.findById(id);
    if(!area.author.equals(req.user._id)){
        req.flash('error', 'You are not the author');
        return res.redirect(`/attraction/${area._id}`);
    }
    next();
}

module.exports.checkReviewAuthor = async(req, res, next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission');
        return res.redirect(`/attraction/${area._id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expError(msg, 400);
    } else{
        next();
    }
    
}