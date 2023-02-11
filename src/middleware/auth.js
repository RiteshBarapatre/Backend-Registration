const jwt = require('jsonwebtoken')
const data = require('../models/model')

const auth = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt
        const verify = jwt.verify(token,process.env.SECRET_KEY)
        console.log('verify: ', verify);
        const user =await data.findOne({_id : verify._id})
        console.log(user)

        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = auth