require('dotenv').config()
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Campground = require('./models/campground');

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });

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

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

//order matters here. new needs to be first
app.get('/campgrounds/addCampground', (req, res) => {
  res.render('campgrounds/addCampground')
})

app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/editCampground', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/editCampground', { campground })
})

app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
})

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})