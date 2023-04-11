const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const expError = require('./utilities/expError.js');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const localStrategy = require('passport-local');
const User = require('./models/user');
const passport = require('passport');



const userRoutes = require('./routes/users.js');
const destinationRoutes = require('./routes/destination.js');
const reviewRoutes = require('./routes/review.js');


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

app.use((passport.initialize()));
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    
    res.locals.signedUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  })

app.use('/', userRoutes)
app.use('/attraction', destinationRoutes);
app.use('/attraction/:id/reviews', reviewRoutes);

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