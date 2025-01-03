const mongoose = require('mongoose')
require('dotenv').config()

const mongoUrl = process.env.MONGODB

const initialDatabase = async () =>{
    await mongoose.connect(mongoUrl).then(() =>{
        console.log("DB Connection SUccess")
    }).catch((error) => console.log(error))
}

module.exports  = {initialDatabase}