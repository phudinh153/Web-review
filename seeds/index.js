const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Area = require('../models/attraction');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/tourArea', () =>{
  console.log("MONGO CONNECTION OPEN!!")
});

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/tourArea');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Area.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const area = new Area({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/484351',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quia ipsam nulla culpa repellat tempore nam dolor ad, nihil, voluptatibus illo necessitatibus fuga quisquam consequatur perspiciatis assumenda saepe inventore nesciunt impedit.',
            price
            
        })
        await area.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})