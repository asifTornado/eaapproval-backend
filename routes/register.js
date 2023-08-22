var express = require("express");
var db = require("../connection/db");
var router = express.Router();
const {ObjectId} = require("mongodb");
var axios = require('axios')



router.get('/register', async function(req, res){
   res.render("register")
})



router.post('/register', async function(req, res){

  console.log("this is the user")

  console.log(req.body.user)
   try {
    var result = await db.getOneUser({mailAddress:req.body.mailAddress});
  
   } catch (error) {
    console.log(error);
   }   
      
      if(result){
        return res.send({registered:false, message:'This email is already registered'});
      }

      if(!result){
         try {
          
          const url = 'http://192.168.0.11:8420/api/Emloyees';
        const companyId = 1;
        const apiKey = '27d34740-c3d4-4938-9260-b5ba3a62922c';

		    var users = await axios.get(url, {params: {companyid: companyId}, headers: {'X-API-KEY': apiKey}})
        
    
          var result = users.data.filter((user)=>user.mailAddress == req.body.user.mailAddress && user.empCode == req.body.user.empCode)[0] 

          if(!result){
            return res.send({registered:false, message:"This user is not authorized"})
          }else{
            var user = req.body.user;
          user.userType = "Approver"
          user.password = req.body.password;
          user._id = user.empCode
           var result = db.insertOneUser(req.body.user)
           return res.send({message:'User Registered', userType:'Approver', registered:true})
          }


          
         } catch (error) {
          console.log(error)
            return res.send({registered:false, message:error.message})
         }
      }

      
// try{
//       if(result.userType == "Approver" || result.userType == "Watcher" || result.userType == "Requester"){
      
//         req.body.department = result.department;
//         req.body.userType = result.userType;
//         var searchId = result._id;
//         var registered_result = await db.updateUser({_id:searchId}, req.body);
//         req.session.user = req.body;
//         return res.send({message:'User Registered', userType:'normal', registered:true})
//       }

     

//       if(result.userType == "Admin"){
//         req.body.department = result.department;
//         req.body.userType = result.userType;
//         req.body.zone = result.zone;
//         var searchId = new ObjectId(result._id);
//         var registered_result = await db.updateUser({_id:searchId}, req.body);
//         req.session.user = req.body;
//         return res.send({message:'User Registered', userType:'admin', registered:true})
//        }

//       }catch(error){
//         console.log(error.message)
//         return res.send({registered:false, message:error.message})
//       }

//        return res.send({registered:false, message:'This user is not authorized'});

   }
 
)

module.exports = router;