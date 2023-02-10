const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
const URI = process.env.DB_URI

const connect = ()=>{
    mongoose.connect(URI).then(()=>{
        console.log("Connection Succesful...")
    }).catch((error)=>{
        console.log(error)
    })
}

module.exports = connect