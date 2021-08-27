require('dotenv').config()
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');


// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log("Database connected");
// });


const app = express();

// monogo db
const dbUri = '';

mongoose.connect(process.env.CAMPGROUND_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((res) => console.log('connected to db'))
  .catch((err => console.log(err)))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/makecampground', async (req, res) => {
  const camp = new Campground({title: 'My Backyard', description: 'cheap spot'})
  await camp.save();
  res.send(camp)
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})