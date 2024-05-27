require('dotenv').config();

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectToMongo = () => {
    mongoose.connect(MONGODB_URI).then(()=>{
        console.info('Connection to MongoDB Successful');
    }, (err)=>{
        console.error('Error while connecting to MongoDB //' + err)
    })
}

module.exports = connectToMongo