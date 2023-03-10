const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Area = require('./models/attraction.js');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const {areaSchema} = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync.js');
const expError = require('./utilities/expError.js');
const methodOverride = require('method-override');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/tourArea', () =>{
  console.log("MONGO CONNECTION OPEN!!")
});

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tourArea');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateArea = (req, res, next) => {
    
    const {error}= areaSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expError(msg, 400);
    } else{
        next();
    }
    
}

//HOME
app.get('/', (req, res) => {
    res.render('home.ejs');
})

//CRUD
app.get('/attraction', async (req, res) => {
    const areas = await Area.find({});
    res.render('attraction/attractions-list.ejs', {areas});
})


app.get('/attraction/new', (req, res) => {
    res.render('attraction/new.ejs');
})

app.post('/attraction', validateArea, catchAsync(async(req, res) => {
    
    const area = new Area(req.body.area);
    await area.save();
    res.redirect(`/attraction/${area._id}`);
    
}))

app.get('/attraction/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const area = await Area.findById(id);

    res.render('attraction/show.ejs', {area});
}))

app.get('/attraction/:id/edit', catchAsync(async (req, res) => {
    const area = await Area.findById(req.params.id);
    res.render('attraction/edit.ejs', {area});
}))

app.put('/attraction/:id', validateArea, catchAsync(async (req, res) => {
    const {id} = req.params;
    const area = await Area.findByIdAndUpdate(id, {...req.body.area});
    res.redirect(`/attraction/${area._id}`);
}))

app.delete('/attraction/:id',catchAsync(async (req, res) => {
    const {id} = req.params;
    await Area.findByIdAndDelete(id);
    res.redirect('/attraction');
}))

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