const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

main()
    .then(res => console.log('DATABASE CONNECTED!'))
    .catch(err => console.log(`Oh no mongo connection error :( ${err}`))
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp')
}

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i <= 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 30) + 10
        const c = new Campground({
            author: '62166c5314805f039041e83a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam doloremque provident placeat, delectus eius, reiciendis atque amet natus, vitae magni excepturi ratione dolorem aliquid consequatur! Maxime inventore facilis minima eligendi.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/doot5vaij/image/upload/v1646119517/YelpCamp/qcr1ap5bwca6l0pgiv4m.jpg',
                    filename: 'YelpCamp/qcr1ap5bwca6l0pgiv4m',
                },
                {
                    url: 'https://res.cloudinary.com/doot5vaij/image/upload/v1646119519/YelpCamp/ry0rmhagkphuxr39ndbr.jpg',
                    filename: 'YelpCamp/ry0rmhagkphuxr39ndbr',
                },
                {
                    url: 'https://res.cloudinary.com/doot5vaij/image/upload/v1646119519/YelpCamp/shytqvsitfajfpsip6ng.jpg',
                    filename: 'YelpCamp/shytqvsitfajfpsip6ng',
                },
                {
                    url: 'https://res.cloudinary.com/doot5vaij/image/upload/v1646119519/YelpCamp/isvicns7k7ohpoctzwgs.jpg',
                    filename: 'YelpCamp/isvicns7k7ohpoctzwgs',
                },
                {
                    url: 'https://res.cloudinary.com/doot5vaij/image/upload/v1646119519/YelpCamp/umhtdg3hihuagxal2ghe.jpg',
                    filename: 'YelpCamp/umhtdg3hihuagxal2ghe',
                }
            ]
        })
        await c.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
    console.log('Mongoose connection closed!')
})