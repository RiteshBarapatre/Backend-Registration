require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = process.env.PORT || 8000
const connect = require('./db/connect')
const hbs = require('hbs')
const bcrypt = require('bcryptjs')
const cookie_parser = require('cookie-parser')
const auth = require('./middleware/auth')

connect()

const data = require('./models/model')
const e = require('express')

const app = express()
app.set('view engine', 'hbs')
app.use(cookie_parser())
app.use(express.json())

//This below line helps to get the data of the form
app.use(express.urlencoded({extended : false}))

const partialPath = path.join(__dirname , "../partials")
hbs.registerPartials(partialPath)


// app.use(express.static(path.join(__dirname,"../public")))


const securePassword = async (password)=>{
    const pass = await bcrypt.hash(password,10)
    return pass
    
}

// const createToken = async ()=>{
//     const token = await jwt.sign({_id : 'nfviuanvpuh4341y27ghy82b276zr%$6r67'},"mynameisriteshbarapatreiamstudentofbca")
//     console.log(token)

//     const userver = await jwt.verify(token,'mynameisriteshbarapatreiamstudentofbca')
//     console.log(userver)
// }

// createToken()

app.get('/',(req,res)=>{ 
    res.render('index')  
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/logout', auth,async (req,res)=>{
    try {

        //Log out from single device
        // req.user.tokens = req.user.tokens.filter((elem)=>{
        //     return elem.token !== req.token
        // })

        //Log out from all device
        req.user.tokens = []
        res.clearCookie('jwt')
        await req.user.save()
        res.render('login')
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get('/secret',auth,(req,res)=>{
    console.log(req.cookies.jwt)
    res.render('secret')
})

//Create a new user 
app.post('/register',async (req,res)=>{
    try {

        if(req.body.password === req.body.cpassword){

            const secpass =await securePassword(req.body.password)

            const user = new data({
                name : req.body.name,
                email : req.body.email,
                password : secpass,
                gender : req.body.gender
            })

            const datasave =await user.save()
            const token = await user.generateAuthToken()
            res.cookie('jwt',token,{
                //This sets the expiry of a cookie
                expires : new Date(Date.now() + 300000),
                
                //This sets that the client side scripting language have no affect on it 
                httpOnly : true
             })
            res.status(200).render('index')
        }
        else{
            res.status(404).send("Password is not Matching")
        }

        // res.send(req.body.gender)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/login',async (req,res)=>{
    try {
         const email = req.body.email
         const password = req.body.password

         
         const validuser = await data.findOne({email : email})
         const decrypt = validuser.password

         const match = await bcrypt.compare(password, decrypt);
         const token = await validuser.generateAuthToken()

        //This is how we set cookie 
         res.cookie('jwt',token,{
            //This sets the expiry of a cookie
            expires : new Date(Date.now() + 300000),
            
            //This sets that the client side scripting language have no affect on it 
            httpOnly : true
         })
         if(match){
            res.status(200).render('index')
         }
         else{
            res.status(404).send("User Not Found...")
         }
        }
        catch (error) {
        res.status(400).send(error)
    }
})



app.listen(port,()=>{console.log(`Listening to port ${port}`)})