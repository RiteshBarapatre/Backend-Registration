const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const registration = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : false
    },
    email : {
        type : String,
        unique: [true, "Email id already present"],
        required : true,
        validate(v) {
          if (!validator.isEmail(v)) {
            throw new Error("Please enter valid Email...");
          }
        },
    },
    password : {
        type : String,
        required : true,
        min : [4,"Password is too short"]
    },
    gender : {
        type : String,
        required : true
    },
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
    
    
})


//Generating Token...
registration.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id : this._id}, process.env.SECRET_KEY)
        console.log('token: ', token);
        this.tokens = this.tokens.concat({token : token})
        await this.save()
        return token
    } catch (error) {
        console.log('error: ', error); 
    }
}

const data = new mongoose.model('Registration',registration)

module.exports = data