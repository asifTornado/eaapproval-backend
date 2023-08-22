var express = require('express');
const {isLoggedIn, isAdmin, isMasterAdmin, isUser, isUserOrAdmin} = require('../middlewares/checker');
var router = express.Router();
var db = require("../connection/db")
const {ObjectId} = require("mongodb");
var getSerial = require('../tools/serialGetter');
var upload = require('../multer/multer');
var {event, sendMail,sendMailByGroup, sendMailByDepartment, sendMailByDepartmentOrGroup} = require('../tools/mailer');
var {notificationEvent, sendNotification, sendNotificationByGroup} = require('../tools/notifier')
/* GET users listing. */


// router.get('/normal', isUser, function(req, res){
//     var {name, email, designation, department, userType, signature} = res.locals.user;
//     console.log("from normal ")
//     console.log(signature);

//     res.render('normal', {name:name, email:email, designation:designation, department:department, userType:userType})
// })

router.get('/makeRequest', isUserOrAdmin,  function(req, res){
    
   

    res.render('makeRequest')
})

router.post('/makeRequest', isUserOrAdmin, async function(req, res){
    var user = JSON.parse(req.body.user)
    var {empName, mailAddress, designation, department} = user;
    var requestType = req.body.requestType;
    var fileNames = [];
       if(req.files){
        for(let x=0; x < req.files.length; x++){
             fileNames.push({fileName:req.files[x].filename, originalName:req.files[x].originalname})
        };
        }

    
    
    console.log(fileNames);
    var infos = JSON.parse(req.body.infos);
    var extraInfos = JSON.parse(req.body.extraInfos);




   if(infos) {
    var infosImageLoaded = infos.map(function(info){
        
     
       if(info.dataType == 'file'){    
         console.log("entered if file is dataType")
           
            if(info.input) {
                for(let x = 0; x < info.input.length; x++){
                 console.log(info.input.length)
                 console.log("entered first loop after finding file is dataType")
                 for(let y of fileNames){
                     console.log("entered second loop after fining file is dataType")
                     if(info.input[x] == y.originalName){
                          info.input[x] = {originalName:y.originalName, fileName:y.fileName} 
                          console.log("after splicing")
                          console.log(info.input[x]) 
                     }
                 }
                }
            }
 
            return info
         }else{
             return info
         }
     
     
 
    })
 
 
    
 
    console.log(infosImageLoaded)
 
 
 
     var dateObject = new Date();
     var time = dateObject.toDateString();
     console.log("time");
     console.log(time);
        
     console.log("data from form")
 
     console.log("data from form end")
    
 function findOwnDepartment(approver){
     return approver.name ==  "Requester's Own Department"
 }

 function findOwnDepartmentHead(approver){
    return approver.name == "Requester's Own Department's Head"
 }
 
 
 
     try{
         var workflow = await db.getOneWorkFlow({name:requestType});
        
         var number_of_approvers = workflow.number_of_approvers;

         var changedApprovers = workflow.approvers.map((approver)=>{
            for(var x of infos){
                if(x.name == approver.name){
                    if(x.optional && x.optional == true){
                        if(x.input == "Not Required"){
                            return
                        }else{
                            approver.name = x.input;
                            return approver
                        }
                    }else{
                        approver.name = x.input;
                        return approver
                    }
                 
             
                }


            }

            return approver
         }).filter((element)=> element != undefined)

         for(var x of changedApprovers){
            console.log(`this is the approver in changed approvers: ${x}`)
         }

         console.log(`this is the changed approver ${changedApprovers}`)


         workflow.approvers = changedApprovers
         
         console.log("workflows" + workflow.approvers[0].name);
         console.log("infos" + infos[0].dataType);
         var serial = getSerial(0, workflow.approvers, infos);
         // var serial = 0;
         if(serial === undefined){
             console.log("could not enter data")
 
             return res.status(200).json({status:"could not enter data"});
         }
     
         console.log("found serial" + serial);
         var approvers = workflow.approvers;
         console.log("after getting approvers")
         var ownApprover = approvers.findIndex(findOwnDepartment);
         console.log("after getting own approver")
         if(ownApprover != -1){
             approvers[ownApprover].name = department;
         }

         var ownDepartmentHead = approvers.findIndex(findOwnDepartmentHead);

         console.log(`Own Department`)

         if(ownDepartmentHead != -1){
            try {
                 var departmentHead = await db.getOneUser({
                    $and: [
                      { department: department },
                      { groups: { $elemMatch: { $in: ["Department Head"] } } }
                    ]
                  })

                  console.log("found own department Head" + " " + departmentHead)

                approvers[ownDepartmentHead].name = departmentHead.email
            } catch (error) {
                console.log(error)
            }
           


         }


        
         console.log("after setting approvers name")
         var current_approver = workflow.approvers[serial];
         console.log("after getting current_approver")
         
      
 
         var approvers_left = number_of_approvers - serial;
         console.log("after getting approvers_left")
         var newRequestItem = {time:time, name:empName, email:mailAddress, designation:designation, department:department, requestType:requestType, infos:infosImageLoaded, extraInfos:extraInfos, serial:serial, number_of_approvers:number_of_approvers, current_approver:current_approver, approval_status:"Pending", approvers:approvers, approvals:[], approvers_left:approvers_left, fileNames:fileNames};
         console.log("inserting request");
         var result = await db.insertRequest(newRequestItem);
         if(current_approver.name.slice(-3) == "com"){
             console.log("inside first if if the approver is email")
             sendMail(current_approver.name, event.Request, result.insertedId, user, requestType).catch((error)=>console.log(error))
         }else{
             console.log("inside send if if the approver is department")
             sendMailByDepartmentOrGroup(current_approver.name, event.Request, result.insertedId, user, requestType).catch((error)=>console.log(error))
         }
         sendNotification(current_approver.name, event.Request, result.insertedId, user, requestType)
         res.setHeader('Content-Type', 'application/json')
         return res.status(200).json(result);
     }catch(error){
         console.log("error found")
         res.send(error)
     }
   }

});





router.post('/makeCustomRequest', isUserOrAdmin, async function(req, res){
    var user = JSON.parse(req.body.user);
    var {empName, mailAddress, designation, department, drawnSignature} = user;
    var item = JSON.parse(req.body.item);
    var requestType = item.requestType;
    var infos = item.extraInfos;
    var extraInfos = [];
    var approvers = item.approvers;
    var fileNames = [];

    for(var x of approvers){
        console.log(`Approver: ${x}`)
    }

console.log(`these are the approvers ${approvers.name} and ${approvers.email}`)

    if(req.files){
        for(let x=0; x < req.files.length; x++){
            fileNames.push({fileName:req.files[x].filename, originalName:req.files[x].originalname})
        }
        
    }
    
    var dateObject = new Date();
    var time = dateObject.toDateString();

   
function findOwnDepartment(approver){
    return approver.name ==  "Requester's Own Department"
}



    try{
        // var workflow = await db.getOneWorkFlow({name:requestType});
       
        var number_of_approvers = approvers.length
        console.log("approvers length")
        console.log(number_of_approvers);
   
        var serial = getSerial(0, approvers, infos);
        // var serial = 0;
        if(serial === undefined){
            console.log("could not enter data")
            return res.status(200).json({status:"could not enter data"});
        }
        console.log("found serial" + serial);
     
        var ownApprover = approvers.findIndex(findOwnDepartment);
        console.log("after getting ownApprover")
        if(ownApprover != -1){
            approvers[ownApprover].name = department;
        }
    
        console.log("after setting department")
        var current_approver = approvers[serial];
        console.log("after getting current_appprover")
        if(current_approver == null){
            return res.send("Does not have any approver")
        }
        var approvers_left = number_of_approvers - serial;
        console.log("approvers left");
        console.log(approvers_left)
        var newRequestItem = {time:time, name:empName, email:mailAddress, designation:designation, department:department, requestType:requestType, infos:infos, extraInfos:extraInfos, serial:serial, number_of_approvers:number_of_approvers, current_approver:current_approver, approval_status:"Pending", approvers:approvers, approvals:[], approvers_left:approvers_left, fileNames:fileNames, drawnSignature};
       
        var result = await db.insertRequest(newRequestItem);
        if(current_approver.name.slice(-3) == "com"){
            console.log("inside first if if the approver is email")
            sendMail(current_approver.name, event.Request, result.insertedId, user, requestType).catch((error)=>console.log(error))
        }else{
            console.log("inside send if if the approver is department")
            sendMailByDepartmentOrGroup(current_approver.name, event.Request, result.insertedId, user, requestType).catch((error)=>console.log(error))
        }
        sendNotification(current_approver.name, event.Request, result.insertedId. user, requestType)
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json(result);
    }catch(error){
        console.log(error)
        res.send(error)
    }

});


router.get('/currentRequests', isUserOrAdmin, function(req, res){
    res.render('currentRequests')
})



router.get('/myRequests', isUserOrAdmin, function(req, res){
    res.render('myRequests')
})



router.post('/getCurrentRequests', isUserOrAdmin, async function(req, res){
    var user = JSON.parse(req.body.user)
   var {department, userType, mailAddress, groups, drawnSignature} = user
   if(!groups){
    groups = []
   }
   try{
    var allGroups = await db.getGroups();
    console.log(groups)
    
    
    var requests = await db.getSomeRequests({$or:[{"current_approver.name":department},{"current_approver.name": mailAddress}, {"current_approver.name":{$in:groups}}]});
    
    console.log("from request" + requests)
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({requests:requests, userType:userType});
   }catch(error){
    console.log(error)
    res.send(error)
   }


})



router.post('/approve', isUserOrAdmin, async function(req, res){
var item = JSON.parse(req.body.item);
var requestType = item.requestType;
var fileNames = [];
if(req.files){
    for(let x = 0; x < req.files.length ; x++){
        fileNames.push({fileName:req.files[x].filename, originalName:req.files[x].originalname});
    }

}

var user = JSON.parse(req.body.user)
var {empName, mailAddress, designation, _id, signature, drawnSignature} = user;
item.approvals.push({name:empName, email:mailAddress, signature:signature, designation:designation, id:_id, approver:item.approvers[item.serial], comment:item.comment, fileNames:fileNames, status:"Approved", drawnSignature:drawnSignature});
item.approvers_left = item.approvers.length - (item.serial+1);
item.serial++;
console.log("item Serial");
console.log(item.serial);
var newSerial = getSerial(item.serial, item.approvers, item.infos);
console.log("new Serial");
console.log(newSerial)
if(newSerial){
    item.serial = newSerial;
}else{
    item.serial = item.approvers.length;
}

if(item.serial == item.approvers.length){
    console.log("request finally approved")
    item.approval_status = "Approved"
    var deletedRequestId = new ObjectId(item._id)
    
    try{
        var deletedRequest = await db.deleteRequest({_id:deletedRequestId})
        delete item._id;
        item._id = deletedRequestId
        var approvedRequest = await db.insertApprovedRequest(item)
        sendMail(item.email, event.Approved, item._id, user, requestType).catch((error)=>console.log(error))
        sendNotification(item.email, event.Approved, item._id, user, requestType)
        console.log(true);
        res.send(true)
    }catch(error){
       console.log(error);
       res.send(error);
    }
    return
}else{
item.current_approver = item.approvers[item.serial];
var searchId = new ObjectId(item._id)
delete item.comment;
var eventId = item._id;
delete item._id;

try{
var result = await db.updateRequest({_id:searchId}, item)

if(item.current_approver.name.slice(-3) == "com"){
    console.log("inside first if if the approver is email")
    sendMail(item.current_approver.name, event.Request, eventId, user, requestType).catch((error)=>console.log(error))
}else{
    console.log("inside send if if the approver is department")
    sendMailByDepartmentOrGroup(item.current_approver.name, event.Request, eventId, user, requestType).catch((error)=>console.log(error))
}


sendNotification(item.current_approver.name, event.Request, eventId, user, requestType)




console.log(result)
res.send(true)
}catch(error){
    console.log(error)
    res.send(error)
}
}
})



router.post('/reject', isUserOrAdmin, async function(req, res){
    var item = JSON.parse(req.body.item);
    var user = JSON.parse(req.body.user);
    var {empName, mailAddress, designation, _id} = user;
    
    var requestType = item.requestType
 
        item.approvals.push({name:empName, email:mailAddress, designation:designation, id:_id, approver:item.approvers[item.serial], comment:item.comment, status:"rejected"});
    
    item.approvers_left = item.approvers.length - item.serial;
    
    item.current_approver = item.approvers[item.serial];
    item.approval_status = "Rejected"
    delete item.comment;
    
    try{
        var deletedRequestId = new ObjectId(item._id);
        var deletedRequest = db.deleteRequest({_id:deletedRequestId});
        item._id = new ObjectId(item._id)
        var rejectedRequest = await db.insertRejectedRequest(item);

        console.log(`the reject request item is : ${rejectedRequest}`)
        
        sendMail(item.email, event.Rejected, rejectedRequest.insertedId, user, requestType)
        sendNotification(item.email, event.Rejected, rejectedRequest.insertedId, user, requestType)

     
        res.send(true);

    }catch(error){
        console.log(error);
        res.send(error)
    }
     
    })


    router.post("/getMyRequests", isUserOrAdmin, async function(req, res){
        var user = JSON.parse(req.body.user);
        var {empName, mailAddress, designation, department, userType} = user;
          
        try{
            var requests = await db.getSomeRequests({email:mailAddress});
            var approvedRequests = await db.getSomeApprovedRequests({email:mailAddress});
            var rejectedRequests = await db.getSomeRejectedRequests({email:mailAddress});
            var myRequests = requests.concat(approvedRequests, rejectedRequests);
            console.log(myRequests);
            res.setHeader('Content-Type', 'application/json')
           return res.status(200).json({myRequests: myRequests, userType:userType});


        }catch(error){
            console.log(error);
            res.send(error)
        }


    });


    router.post("/getDeferredToUsers", isUserOrAdmin, async function(req, res){
        var user = JSON.parse(req.body.user)
        var {department} = user;
        console.log(department);
        try{
            var users = await db.getSomeUsers({department:department})
            console.log(users);
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(users);
        }catch(error){
            console.log(error);
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(error);

        }

    })


    router.post("/defer", isUserOrAdmin, async function(req, res){
        var item = req.body.item.item;
        var requestType = item.requestType;
        var deferredEmail = req.body.item.deferredEmail;
        console.log("from post request" + deferredEmail);
        item.deferrals = [];
        var user = req.body.user;
        var {empName, mailAddress, designation, _id} = user;
        item.deferrals.push({deferredByName:empName, deferredByEmail:mailAddress, deferredByDesignation:designation, deferredById:_id, deferredTo:deferredEmail, deferrerComment:item.comment });
        var searchId = new ObjectId(item._id);
        delete item._id;
        delete item.comment;
        console.log(item);
        try{
            var result = await db.updateRequest({_id:searchId}, item);
            console.log(result);
            sendMail(deferredEmail, event.Defer, searchId, user, requestType);
            sendNotification(deferredEmail, event.Defer, searchId, user, requestType)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(result);

        }catch(error){
            console.log(error);
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(error);
        }



    })


    router.post('/makeRequestAgain', isUserOrAdmin, async function(req, res){

        console.log("entered infoImagesAgain")
        var item = JSON.parse(req.body.item);
        var user = JSON.parse(req.body.user);
        var requestType = item.requestType;
        var fileNames = []
        if(req.files){
        
          for(let x of req.files){
            fileNames.push({originalName:x.originalname, fileName:x.filename})
          }
     
    
        // item.fileName = file.filename;
        }
           var infos = item.infos;


           var infosImagesLoaded = infos.map(function(info){
        
     
            if(info.dataType == 'file'){    
              console.log("entered if file is dataType")
                
                 if(info.input) {
                     for(let x = 0; x < info.input.length; x++){
                      console.log(info.input.length)
                      console.log("entered first loop after finding file is dataType")
                      for(let y of fileNames){
                          console.log("entered second loop after fining file is dataType")
                          if(info.input[x] == y.originalName){
                               info.input[x] = {originalName:y.originalName, fileName:y.fileName} 
                               console.log("after splicing")
                               console.log(info.input[x]) 
                          }
                      }
                     }
                 }
      
                 return info
              }else{
                  return info
              }
          
          
      
         })
           

        console.log("infos Images loaded")
        console.log(infosImagesLoaded)

        item.infos = infosImagesLoaded

       
        
        item.approval_status = "Pending"
        var searchId = new ObjectId(item._id)
        console.log(searchId);
        delete item._id;
        try {
            var result = await db.insertRequest(item); 
            var result_again = await db.deleteRejectedRequest({_id:searchId});

            if(item.current_approver.name.slice(-3) == "com"){
                console.log("inside first if if the approver is email")
                sendMail(item.current_approver.name, event.Request, result.insertedId, user, requestType).catch((error)=>console.log(error))
            }else{
                console.log("inside send if if the approver is department")
                sendMailByDepartmentOrGroup(item.current_approver.name, event.Request, result.insertedId, user, requestType).catch((error)=>console.log(error))
            }
            
            sendNotification(item.current_approver.name, event.Request, result.insertedId, user, requestType)
            console.log("from result again")
            console.log(result_again)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(result_again);
        } catch (error) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(error);
        }



    })




    router.post('/hold', isUserOrAdmin, async function(req, res){
        console.log("this is the body")
        console.log(req.body)
        var user = JSON.parse(req.body.user);
        var item = JSON.parse(req.body.item);
        var reason = req.body.reason;
       
        var holdData = {
            reason:reason,
            name:user.empName,
            email:user.mailAddress,
            id:user._id,
        }

        item.holdData = holdData
        var searchId = new ObjectId(item._id)
        delete item._id
       
        try {
            var result = await  db.updateApprovedRequest({_id:searchId}, item)
            var updatedResult = await db.getApprovedRequest({_id:searchId})
            console.log('this is the result')
            console.log(result);
            res.send(updatedResult)
        } catch (error) {
            res.send(error)    
        }
    })




    router.post('/resume', isUserOrAdmin, async function(req, res){
        console.log("this is the body")
        console.log(req.body)
        
        var item = JSON.parse(req.body.item);
    


    
        var searchId = new ObjectId(item._id)
        delete item._id
       
        try {
            
            var updatedResult = await db.getApprovedRequest({_id:searchId})
            delete updatedResult.holdData;
            var result = await  db.updateApprovedRequest({_id:searchId}, updatedResult)
            console.log('this is the result')
            console.log(result);
            res.send(updatedResult)
        } catch (error) {
            res.send(error)    
        }
    })



module.exports = router;
