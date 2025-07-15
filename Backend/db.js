const mongoose = require('mongoose')

function connectToDatabase(url){
    mongoose.connect(url)
    .then(()=>{
        console.log('connected to mongodb');
        
    }).catch((err)=>{
        console.error('Databse connecting error',err);
        
    })
}

module.exports = connectToDatabase;