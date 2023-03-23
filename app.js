const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Area = require('./models/attraction.js');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const {areaSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync.js');
const expError = require('./utilities/expError.js');
const methodOverride = require('method-override');


const destination = require('./routes/destination.js');
const review = require('./routes/review.js');

mongoose.set('strictQuery', false);


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tourArea', () =>{
    console.log("MONGO CONNECTION OPEN!!")
  });
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))




app.use('/attraction', destination)
app.use('/attraction/:id/reviews', review)

//HOME
app.get('/', (req, res) => {
    res.render('home.ejs');
})


app.all('*', (req, res, next) => {
    next(new expError('Page not found', 404));
})

app.use((err, req, res, next)=>{
    const {statusC = 500} = err;
    if(!err.message) err.message = 'Something wrong!';
    res.status(statusC).render('error.ejs', {err})
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!!");
})