const mongoose = require('mongoose');

const mongourl = "mongodb://localhost:27017/ynotebook"

const connecttomongo = ()=>
{
    mongoose.connect(mongourl, ()=>
    {
        console.log("connected successfully");
    })
}

module.exports = connecttomongo;