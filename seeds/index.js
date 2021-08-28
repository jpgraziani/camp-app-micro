require('dotenv').config()
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect(process.env.CAMPGROUND_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then((res) => console.log('connected to db'))
  .catch((err => console.log(err)))

  // easy way to pick a random element from an array
  // array[Math.floor(Math.random() * array.length)]

// const sample = array => {
//   array[Math.floor(Math.random() * array.length)]
// }; when you do it this way it will give you undefined add to error log

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Campground.deleteMany({});
  // const c = new Campground({title: 'purple field'})
  // await c.save();
  for (let i = 0; i < 15; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`
    })
    await camp.save()
  }
}

// need to exicute seedDB
seedDB().then(() => {
  mongoose.connection.close()
});