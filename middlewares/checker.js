const { ObjectId } = require('mongodb');
var db  = require('../connection/db');
var jwt = require('jsonwebtoken');
var secret = require('../config').tokenSecret;



var isLoggedIn = (req, res, next)=>{

  next()

}


var isAdmin = (req, res, next) => {
try{
  
  var user = jwt.verify(req.body.token, secret)
}catch(error){
  return res.send(error)
}

   if(user.userType == "admin"){
    res.locals.user = user;
      next();
   }else{
    return res.send("you are not authorized, please leave")
   }
   
}


var isMasterAdmin = (req, res, next) => {
   next()
}

var isAdminOrMasterAdmin = (req, res, next) => {
 
  try{
  
    var user = jwt.verify(req.body.token, secret)
  }catch(error){
    return res.send(error)
  }
  
     if(user.userType == "admin" || user.userType == "Master admin"){
      res.locals.user = user;
        next();
     }else{
      return res.send("you are not authorized, please leave")
     }

}


var isUser = async (req, res, next) => {
  next()
  }



var isUserOrAdmin = (req, res, next) => {
  try{
  
    var user = jwt.verify(req.body.token, secret)
    console.log(`this is the result from the token ${user.userType}`)
  }catch(error){
    return res.send(error)
  }
  
     if(user.userType == "admin" || user.userType == "leader" || user.userType =="support" || user.userType == "power"){
      res.locals.user = user;
        next();
     }else{
      return res.send("you are not authorized, please leave")
     }
}



var isUserOrMasterAdmin = (req, res, next) => {
  next()

}





module.exports = {isLoggedIn:isLoggedIn, isAdmin:isAdmin, isMasterAdmin:isMasterAdmin, isAdminOrMasterAdmin:isAdminOrMasterAdmin, isUser:isUser, isUserOrAdmin:isUserOrAdmin, isUserOrMasterAdmin:isUserOrMasterAdmin };


