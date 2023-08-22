const express = require('express');
const {ObjectId} = require("mongodb");
const db = require('../connection/db');
var {isUserOrAdmin, isAdmin} = require('../middlewares/checker');



var router = express.Router();




router.get('/signature', isUserOrAdmin, async function(req, res){
    res.render('signature');
})


router.post('/getSignature', isUserOrAdmin, async function(req, res){
    console.log("inside get signature")
    var user = JSON.parse(req.body.user);
    console.log("this is the user")
    console.log(user);
  
    var searchID = user._id;
    try {
        var result = await db.getOneUser({_id:searchID})
        console.log("result")
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(result)
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({message:"failed"})
    }



})








router.post('/uploadSignature', isUserOrAdmin, async function(req, res){

var user = JSON.parse(req.body.user);

if(!req.files){
    return res.send("please upload a file")
}


var fileName = req.files[0].filename;
user.signature = fileName;
var id = user._id;
var searchId = id
delete user._id;

try {
    var result = await db.updateUser({_id:searchId}, user)

   if(result){
    console.log("signature uploaded")
   }
   user._id = id;
   res.locals.user = user;


    return res.send(user)
} catch (error) {
    return res.send("failed")
}


})


module.exports = router;