var router = require('express').Router();
var db = require('../connection/db');
const {ObjectId} = require('mongodb');
var er = require('../tools/error');
var {isLoggedIn} = require('../middlewares/checker')




router.post('/audit', isLoggedIn, async function(req, res){

var id = req.body.id;
er("the body", req.body)
er("the id \n", id);
var searchId = new ObjectId(id);
var email = "";
if(req.session.user){
    var email = req.session.user.email;
}

var date = new Date();
var dateString = date.toDateString();
var newTrail = {email:email, act:"viewed", date:dateString}
var newTrailList = [];
 

try {
   var getResult = await db.getOneRequest({_id:searchId});
   
    if(getResult){
        console.log(getResult)
    }


   if(getResult.trails){
    newTrailList = getResult.trails 
    newTrailList.push(newTrail);

   }else{
    newTrailList.push(newTrail)
   }

   delete getResult._id


    var updateResult = await db.updateRequest({_id:searchId}, {"trails":newTrailList});
    console.log(updateResult)
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({result:updateResult})
} catch (error) {
   console.log(error.message)
   res.setHeader
   res.setHeader('Content-Type', 'application/json')
   return res.status(200).json({error:error.message})    
}




})


module.exports = router;