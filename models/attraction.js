const mongoose = require('mongoose');

const touristAreaSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

module.exports = mongoose.model('Area', touristAreaSchema);

