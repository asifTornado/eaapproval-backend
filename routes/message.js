var express = require('express');
var {isUserOrAdmin} = require('../middlewares/checker')
var db = require('../connection/db');
const { ObjectId } = require('mongodb');
const { request } = require('../app');
var router = express.Router();



router.post("/submitMessage", isUserOrAdmin, async function(req, res){
  
console.log("from inside the server")

  var {message, requestId, approvalStatus} = req.body;
  var messengerEmail = req.body.user.mailAddress;
  var messengerName = req.body.user.empName;
  var messengerIdInit = req.body.user._id
  var messengerId = messengerIdInit.toString();
  
  console.log(messengerIdInit)
  console.log("evaluated messenger id")
  console.log(messengerId)
  console.log("the session user");
  console.log(req.body.user)
  var currentDate = new Date();
  const options = { timeZoneOffset: -360, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  var time = currentDate.toLocaleString('en-US', options);
  
  console.log('request Id')
  console.log(requestId);
  console.log("type of")
  console.log(typeof(requestId))


  var searchIdfirst = requestId;
  console.log("search Id First")
  console.log(searchIdfirst)
  var searchId = new ObjectId(searchIdfirst)
  if(!message){
    res.setHeader()
    return res.status(200).json({message:"there is no message"})
  }


  if(approvalStatus == "Pending"){
        try {
            var result = await db.getOneRequest({_id:searchId})

            if(result.messages){
                result.messages.push({message:message, messengerEmail:messengerEmail, messengerName:messengerName, time:time, id:messengerId})
                console.log("entered if block")
            }else{
                result.messages = [];
                result.messages.push({message:message, messengerEmail:messengerEmail, messengerName:messengerName, time:time, id:messengerId})
            }
            
            delete result._id;
            var updatedResult = await db.updateRequest({_id:searchId}, result)
            var updatedResultItem = await db.getOneRequest({_id:searchId});
            return res.status(200).json(updatedResultItem.messages)
            
        } catch (error) {
            console.log(error)
            return res.status(200).json({message:"error in updating"})
            
        }
  }else if(approvalStatus == "Approved"){
    try {
        console.log("entered approved message")
        var result = await db.getApprovedRequest({_id:searchId})
        console.log("got approved message data")
        console.log("result");
        console.log(result);
        if(result.messages != null){
            console.log("found result messages")
            result.messages.push({message:message, messengerEmail:messengerEmail, messengerName:messengerName, time:time, id:messengerId})
        }else{
            console.log("entered else of result messages")
            result.messages = [];
            result.messages.push({message:message, messengerEmail:messengerEmail, messengerName:messengerName, time:time, id:messengerId})
        }
        console.log("done finishing pushing message")
        
        delete result._id;
        var updatedResult = await db.updateApprovedRequest({_id:searchId}, result)
        var updatedResultItem = await db.getApprovedRequest({_id:searchId});
        console.log("done making update")
        return res.status(200).json(updatedResultItem.messages)
        
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:error.message})
    
        
    }
  }else if(approvalStatus == "Rejected"){
    try {
        var result = await db.getRejectedRequest({_id:searchId})
        if(result.messages){
            result.messages.push({message:message, messengerEmail:messengerEmail, messengerName:messengerName, time:time, id:messengerId})
        }else{
            result.messages = [];
            result.messages.push({message:message, messengerEmail:messengerEmail, messengerName:messengerName, time:time, id:messengerId})
        }
        
        delete result._id;
        console.log(searchId)
        var updatedResult = await db.updateRejectedRequest({_id:searchId}, result)
        var updatedResultItem = await db.getRejectedRequest({_id:searchId})
        return res.status(200).json(updatedResultItem.messages)
        
    } catch (error) {
        console.log(error)
        return res.status(200).json({message:"error in updating"})
        
    }
  }


})



router.post("/deleteMessage", async function(req, res){
    var messengerId = req.body.messengerId;
    var userId = req.body.user._id;
    var requestId = req.body.requestId;
    var searchId = new ObjectId(requestId);
    var approval_status = req.body.approval_status
    var counter = req.body.messageCounter
    console.log("entered delete Route")

    if(messengerId != userId){
        console.log("entered if block")
        return res.status(200).json({message:false})
    }else{
        console.log("entered else block")
        var requestCalls = {"Approved":"getApprovedRequest", "Rejected":"getRejectedRequest", "Pending":"getOneRequest"}
        console.log("after request calls")
        
        var updateCalls = {"Approved":"findOneAndUpdateApprovedRequest", "Rejected":"findOneAndUpdateRejectedRequest", "Pending":"findOneAndUpdateRequest"}
        try {
            
        
            var result =  await db[requestCalls[approval_status]]({_id:searchId})
            result.messages.splice(counter, 1)
            delete result._id;
            var updatedResult = await db[updateCalls[approval_status]]({_id:searchId}, result);
            return res.status(200).json(updatedResult)
        } catch (error) {
            return res.status(200).json({message:false})
        }
    }
})


router.post('/messageEdit', async function(req, res){
    var {id, message, counter, approval_status, messengerId, user} = req.body;
   
    console.log(`this is the messenger id: ${messengerId}`)
    console.log(`this is the user id: ${user._id}`)

    if(user._id == messengerId) {
        console.log("approval_status");
        console.log(approval_status)
        console.log("message");
        console.log(message)
        var searchId = new ObjectId(id);
        console.log(`this is the search id ${searchId}`)
        var currentDate = new Date();
        const options = { timeZoneOffset: -360, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        var time = currentDate.toLocaleString('en-US', options);
        var requestCalls = {"Approved":"getApprovedRequest", "Rejected":"getRejectedRequest", "Pending":"getOneRequest"}
        var updateCalls = {"Approved":"findOneAndUpdateApprovedRequest", "Rejected":"findOneAndUpdateRejectedRequest", "Pending":"findOneAndUpdateRequest"}
    
        try {
            console.log("entered try block")
            var result = await db[requestCalls[approval_status]]({_id:searchId})
            console.log("messages before changed")
            console.log(result.messages[counter].message)
            result.messages[counter].message = message;
            result.messages[counter].time = time;
            if(result.messages[counter].messengerName.split(" ")[1] != "(Edited)"){
                result.messages[counter].messengerName = result.messages[counter].messengerName +" " + "(Edited)"
            }
            
            console.log("counter");
            console.log(counter);
            console.log("result messages")
            console.log(result.messages[counter].message)
            delete result._id
            var updatedResult = await db[updateCalls[approval_status]]({_id:searchId}, result)
            console.log("updated Result");
            console.log(updatedResult.value.messages[counter])
             return res.send(updatedResult.value.messages[counter])
     
        } catch (error) {
            console.log("entered catch block")
            console.log(error)
                    return res.send(error)
        }
    } else {
        return res.send("you are not allowed to edit this message")
    }
    
})


router.post('/submitReview', async function(req, res){
    var userName = req.body.user.name;
    var feedback = req.body.text;
    var rating = req.body.rating;
    var id = req.body.user._id.toString();
    var searchId = new ObjectId(id);

    try {
        var result  = await db.insertFeedBack({name:userName, feedback:feedback, rating:rating})
        var user = await db.updateUser({_id:searchId}, {gotFeedback:"true"})
        return res.send(result)
    } catch (error) {
      console.log(error);
      return res.send(error)      
    }
})


module.exports = router;














