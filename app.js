const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const expError = require('./utilities/expError.js');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ObjectID = require('mongoose').Types.ObjectId;

const destination = require('./routes/destination.js');
const review = require('./routes/review.js');

mongoose.set('strictQuery', false);


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tourArea', () =>{
    console.log("MONGO CONNECTION OPEN!!");
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
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
  secret: 'thisisasecret!',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  })

app.use('/attraction', destination);
app.use('/attraction/:id/reviews', review);

//HOME
app.get('/', (req, res) => {
    res.render('home.ejs');
});


app.all('*', (req, res, next) => {
    next(new expError('Page not found', 404));
});

app.use((err, req, res, next)=>{
    const {statusC = 500} = err;
    if(!err.message) err.message = 'Something wrong!';
    res.status(statusC).render('error.ejs', {err});
});

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!!");
});