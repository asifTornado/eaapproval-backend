var router = require('express').Router();
const { ObjectId } = require('mongodb');
var path = require('path');
var db = require('../connection/db')
var {isAdmin} = require('../middlewares/checker')


router.get('/showFile/:filename', async function(req, res){

    var filename = req.params.filename;
    var pathname = path.join('public', 'uploads');
    res.set({
        "Content-Type": "application/pdf", //here you set the content type to pdf
        "Content-Disposition": "inline; filename=" + filename, //if you change from inline to attachment if forces the file to download but inline displays the file on the browser
      });
    res.sendFile(filename, {root:pathname})

})

router.post('/getAllFiles', isAdmin, async function(req, res){
  
  try {

    var approvedRequests = await db.getAllApprovedRequests();
    var rejectedRequests = await db.getAllRejectedRequests();
    var pendingRequests = await db.getAllRequests();
    var allRequests = pendingRequests.concat(approvedRequests, rejectedRequests);

    var mainFiles = allRequests.map(function(request){
            return request.fileNames
      
    })

    var finalFiles = [];
     
  

    for(let x=0; x < mainFiles.length; x++){
      for(let y=0; y < mainFiles[x].length; y++){
        
        finalFiles.push(mainFiles[x][y])
      }
    }

   var approvalFiles = allRequests.map(function(request){
         var innerFiles = request.approvals.map(function(approval){
          return approval.fileNames
         })
         return innerFiles
   })
  

   var mainApprovalFiles = [];

     for(x in approvalFiles){
        for(y in approvalFiles[x]){
          for(z in approvalFiles[x][y]){
            mainApprovalFiles.push(approvalFiles[x][y][z])
          }
        }
       }

       var combinedFiles = finalFiles.concat(mainApprovalFiles)
     
  

   return res.status(200).json(combinedFiles)

    
  } catch (error) {
     console.log(error.message)
  }




})



router.get('/showAllFiles', isAdmin, async function(req, res){
  res.render('showAllFiles')
})












module.exports = router;