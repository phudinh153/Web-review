const joi = require('joi');

module.exports.areaSchema = joi.object({
    area: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        // images: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required()
    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
});

