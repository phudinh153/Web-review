const mongoose = require('mongoose');

const touristAreaSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

module.exports = mongoose.model('Area', touristAreaSchema);

