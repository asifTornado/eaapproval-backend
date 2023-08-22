var express = require('express');
var router = express.Router();
var db = require('../connection/db');
var {isUserOrAdmin} = require('../middlewares/checker');
var {ObjectId} = require('mongodb')



var specialMiddleWare = (req, res, next) => {
 


    if(req.body.user && (req.body.user.userType == "admin" || req.body.user.userType == "support" || req.body.user.userType == "leader" || req.body.user.userType == "power" || req.body.user.userType == "departmentPower")) {
      res.locals.user = req.body.user;
      // res.locals.email = req.session.user.email;
      // res.locals.userType = req.session.user.userType;
  
      next()

}else{
  res.redirect('/login')
} 



}


router.post('/getNotifications', specialMiddleWare,  async function(req, res){
    
     
     var user = req.body.user
  
     var email = user.mailAddress;
     var department = user.department;
     var groups = user.groups || ["thisisnotagroupandwillneverbeone"]
     
     var results = await db.getSomeNotifications({$or:[{name:{$eq:email}}, {name:{$eq:department}}, {name:{$in:groups}}]})
   console.log(results)
    res.send(results)
})



router.post('/deleteNotification/', specialMiddleWare, async function(req, res){
  
  var searchId = new ObjectId(req.body.id)
 
  
  try {
    var result = await db.deleteNotification({_id:searchId})
    res.send(result)
  } catch (error) {
    res.send(error)   
  }

})




module.exports = router;