var MongoClient = require('mongodb').MongoClient;
var jwt = require('jsonwebtoken')
var url = "mongodb://127.0.0.1:27017/";
var express = require('express');
const {isLoggedIn, isAdmin, isMasterAdmin, isUserOrAdmin, isUser} = require('../middlewares/checker')
var db = require('../connection/db');
var router = express.Router();

var secret = require('../config').tokenSecret;

router.get('/login', async function(req, res){

    res.render("login")

})





router.post('/login',  async function(req, res){
    var email = req.body.email;
    var password = req.body.password;

   try {
    var result = await db.getOneUser({mailAddress:email, password})
    if(result){
        
        console.log("Result");
       console.log(result);

       var token = jwt.sign(result, secret)
       delete result.password;
       res.send({result, token, success:true})
    }else{
        res.send({success:false, message:"This user is not authorized"})
    }

   } catch (error) {
    console.log(error);
    res.send({message:error, success:false})
   }
   
   
    
    }
        

)

router.get('/logout', async function(req, res){
    req.session.destroy();
    res.redirect('/login')
})




router.get('/normal', isUser, async function(req, res){
    res.render('normal');
})

router.get('/masterAdmin', isMasterAdmin, async function(req, res){
    res.render('masterAdmin');
})


module.exports = router