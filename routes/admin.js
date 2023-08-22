var express = require("express");
const {isLoggedIn, isAdmin, isMasterAdmin, isAdminOrMasterAdmin, isUserOrAdmin} = require('../middlewares/checker');
var router = express.Router();
var db = require('../connection/db');
const {ObjectId} = require("mongodb");

// mai

router.get('/users', isAdmin, async function(req, res, next){
    res.render('users', {template:"Asif"});
});


router.get('/workflows', isAdmin, async function(req, res, next){
    res.render('workflows');
});

router.get('/departments', isAdmin, async function(req, res, next){
    res.render('departments');
});


router.get('/groups', isAdmin, async function(req, res, next){
  res.render('groups');
});


router.get('/workflows', isAdmin, async function(req, res, next){
    res.render('requests');
});


// main end

//users

router.post('/getUsers', async function(req, res) {
    try {
      var users = await db.getAllUsers({"userType":{$nin:["Admin", "Master Admin"]}});
      res.setHeader('Content-Type', 'application/json');
      return res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  });

  router.post('/deleteUser', isAdminOrMasterAdmin, async function(req, res){
    console.log(req.body.user);
    var data = req.body.user._id;
    try{
      var deleteStatus = await db.deleteOneUser({_id:data});
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(deleteStatus);
    }catch(error){
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(error);
    }
  });


  router.post('/updateUser', isAdminOrMasterAdmin, async function(req, res){
    console.log(req.body);
    var data = req.body.user._id;
    delete req.body.user._id
    try{
      var result = await db.updateUser({_id:data}, req.body.user);
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json(result);
    }catch(error){
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json(error);
    }
  });


  router.post('/insertUser', isAdminOrMasterAdmin, async function(req, res){
    console.log(req.body.user);
    
    try{
      var userCheck = await db.getOneUser({mailAddress:req.body.user.mailAddress});

      if(userCheck){
        res.setHeader('Content-Type', 'application/json')
      return res.status(200).json({message:"This user already exists"});

      }
      
      var _id = req.body.user.empCode;
      
      req.body.user["_id"] = _id
      var result = await db.insertOneUser(req.body.user);
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json(result);
    }catch(error){
      res.setHeader('Content-Type', 'application/json')
      return res.status(200).json(error);
    }
  });

//User End


// departments

router.post('/getDepartmentsAndApprovers', isUserOrAdmin, async function(req, res) {
  try {
    var departments = await db.getAllDepartments();
    var groups = await db.getGroups();
    var users = await db.getAllUsers({"userType":{$ne:"Master Admin"}});
    var approvers = departments.concat(users, groups)
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(approvers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

router.post('/getDepartments', isUserOrAdmin, async function(req, res){

  try {
    var departments = await db.getAllDepartments();

  

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(departments);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }


})

router.post('/getDepartmentsAndApproversWithoutGroups', isUserOrAdmin, async function(req, res) {
  try {
    var departments = await db.getAllDepartments();

    var users = await db.getAllUsers({"userType":{$ne:"Master Admin"}});
    var approvers = departments.concat(users)
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(approvers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});



router.post('/deleteDepartment', isAdmin, async function(req, res){
  console.log("this is the delete department body")
  console.log(req.body.department);
  var data = new ObjectId(req.body.department._id);
  try{
    var deleteStatus = await db.deleteOneDepartment({_id:data});
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(deleteStatus);
  }catch(error){
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(error);
  }
});


router.post('/updateDepartment', isAdmin, async function(req, res){
  console.log(req.body.department);
  var data = new ObjectId(req.body.department._id);
  try{
    var result = await db.updateDepartment({_id:data}, {name:req.body.department.name});
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(result);
  }catch(error){
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(error);
  }
});


router.post('/insertDepartment', isAdmin, async function(req, res){
  console.log(`this is the new department ${req.body.department}`);
  
  try{
    var result = await db.insertOneDepartment({name:req.body.department});
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(result);
  }catch(error){
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(error);
  }
});


//Departments End

//Workflows
router.post('/getWorkFlows', isUserOrAdmin, async function(req, res) {
  try {
    var workflows = await db.getAllWorkFlows();
    res.setHeader('Content-Type', 'application/json');
    return res.send(workflows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

router.post('/updateWorkFlow', async function(req, res){
  console.log(req.body);
  var data = new ObjectId(req.body._id);
  try{
    var result = await db.updateWorkFlow({_id:data}, {name:req.body.name, approvers:req.body.approvers, number_of_approvers:req.body.approvers.length});
    
    return res.status(200).send(result);
  }catch(error){
  
    return res.status(200).send(error);
  }
});


router.post('/deleteWorkFlow', isAdmin, async function(req, res){
  console.log(req.body.workflow);
  var data = new ObjectId(req.body.workflow._id);
  try{
    var result = await db.deleteOneWorkFlow({_id:data});
    
    return res.status(200).send(result);
  }catch(error){
  
    return res.status(200).send(error);
  }
});


router.post('/insertWorkFlow', async function(req, res){
  console.log(req.body.workflow);
  req.body.workflow["number_of_approvers"] = req.body.workflow.approvers.length;
  
  try{
    var result = await db.insertWorkFlow(req.body.workflow);
    
    return res.status(200).send(result);
  }catch(error){
  
    return res.status(200).send(error);
  }
});


router.post('/getCurrentRequestsForAdmin', isAdmin, async function(req, res){
  try{
    var current_requests = await db.getAllRequests();
    var approved_requests = await db.getAllApprovedRequests();
    var rejected_requests = await db.getAllRejectedRequests();
    var all_requests = current_requests.concat(approved_requests, rejected_requests)
    
    console.log(all_requests);
    return res.status(200).send(all_requests)

  }catch(error){
    console.log(error);
    return res.status(200).send(error)
  }   

})

router.get('/adminRequests', isAdmin, async function(req, res){
  res.render("adminRequests")
})


router.get('/getAdmins', isMasterAdmin, async function(req, res){

     try{

      var result = await db.getAllUsers({userType:"Admin"});

      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(result);

     }catch(error){
      console.log(error.messsage)
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(error);
     }

})




router.post('/getGroups', isUserOrAdmin, async function(req, res) {
  try {
  
    var groups = await db.getGroups();
   
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

router.post('/deleteGroup', isAdmin, async function(req, res){
  console.log(req.body);
  var data = new ObjectId(req.body.group._id);
  try{
    var deleteStatus = await db.deleteGroup({_id:data});
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(deleteStatus);
  }catch(error){
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(error);
  }
});


router.post('/updateGroup', isAdmin, async function(req, res){
  console.log(req.body.group);
  var data = new ObjectId(req.body.group._id);
  try{
    var result = await db.updateGroup({_id:data}, {name:req.body.group.name});
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(result);
  }catch(error){
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(error);
  }
});


router.post('/insertGroup', isAdmin, async function(req, res){
  console.log(req.body.group);
  
  try{
    var result = await db.insertGroup(req.body.group);
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(result);
  }catch(error){
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json(error);
  }
});












module.exports = router;