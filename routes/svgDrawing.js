var express = require('express');
var db = require('../connection/db');
const { ObjectId } = require('mongodb');




var router = express.Router();


router.post('/svg', async function(req, res){
   console.log(`this is the file path ${req.body.path}`)
   console.log(`this is the user id brother : ${req.body.id}`)
  path = req.body.path;
  width = req.body.width;
  height = req.body.height;
  var searchId = req.body.id

  try {
    var user = await db.getOneUser({_id:searchId})
    user.drawnSignature = {path, width, height}
    delete user._id
    var result = await db.updateUser({_id:searchId}, user)
    
    console.log(user)
   return res.send(user)
  } catch (error) {
    console.log(error);
    return res.send(error)
    
  }


})


router.post('/checksvg', async function (req, res){
    var id = req.body.id;
    var searchId = id;
  
    try {
      var user = await db.getOneUser({_id:searchId})

      if(user.drawnSignature){
        var data = {
          hasSignature: true,
          file:user.drawnSignature.path,
          width: user.drawnSignature.width,
          height:user.drawnSignature.height
        }
        console.log('data');
        return res.send(data)
      }
    } catch (error) {
      console.log(error);
      return res.send(error)
    }


 
})





module.exports = router