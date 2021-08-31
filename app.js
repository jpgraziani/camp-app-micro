require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas');
const catchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const CatchAsync = require('./utils/CatchAsync');

const app = express();

app.engine('ejs', ejsMate);

mongoose.connect(process.env.CAMPGROUND_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((res) => console.log('connected to db'))
  .catch((err => console.log(err)))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//we need to parse the body when we want a return on http method Post
app.use(express.urlencoded({ extended: true}))
//override date from edit
app.use(methodOverride('_method'));

// ********** middleware
const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);

  if(error) {
    const msg = error.details.map(el => el.message).join('/')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}
// ********* end of middleware

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

//order matters here. new needs to be first
app.get('/campgrounds/addCampground', (req, res) => {
  res.render('campgrounds/addCampground')
})

app.get('/campgrounds/:id', CatchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/editCampground', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/editCampground', { campground })
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
  // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'oh No, Soemthing went wrong';
  res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})