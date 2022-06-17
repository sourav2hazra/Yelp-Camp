const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const randomPicker = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<200; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const c = new Campground({
            author: '619e98a733e57b46583ce1f4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${randomPicker(descriptors)} ${randomPicker(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae veniam tempore vel eveniet porro quas, dignissimos fugiat quia distinctio qui perspiciatis facere commodi, cupiditate maxime.',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/yelpcamp-media/image/upload/v1637923449/YelpCamp/adwhtj303674dtuzdt03.jpg',
                    filename: 'YelpCamp/adwhtj303674dtuzdt03'
                },
                {
                    url: 'https://res.cloudinary.com/yelpcamp-media/image/upload/v1637923448/YelpCamp/ju4prezorbinojnwihzi.jpg',
                    filename: 'YelpCamp/ju4prezorbinojnwihzi'
                },
                {
                    url: 'https://res.cloudinary.com/yelpcamp-media/image/upload/v1637923449/YelpCamp/p5plpgtric23ipq2uca7.jpg',
                    filename: 'YelpCamp/p5plpgtric23ipq2uca7'
                }
            ]
        })
        await c.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close()
        console.log("DATABASE POPULATED")
    })
    .catch(err => {
        console.log("UH OH ERROR!!")
        console.log(err)
    })