var express = require("express");
var fs = require('fs').promises;
var path = require("path");
const { isUserOrAdmin } = require("../middlewares/checker");
var secret = require('../config').tokenSecret;
var jwt = require('jsonwebtoken');

var router = express.Router();



var imageAuthenticator = function(req, res, next){

        
        var user = jwt.verify(req.params.token, secret, function(error, user){
            console.log(req.params.token)
            if(error){
                return res.send(error)
            }
            next()
        });

}



router.get("/image/:image/:token", imageAuthenticator,  async function(req, res){
    var image = req.params.image;
    var token = req.params.token;
    res.render("image", {image, token});
})


router.post("/image", isUserOrAdmin, async function (req, res){
    var image = null;
    var fileName = null;
    var imageBuffer = null;

    if(req.body.file){
      image = req.body.file
      imageBuffer = Buffer.from(image, 'base64');
      
    }

    if(req.body.fileName){
        console.log("from insied fileName")
        fileName = req.body.fileName;
    }

    var filepath = path.join('.', 'public', 'uploads', fileName);
    

    try{
   
    await fs.writeFile(filepath, imageBuffer);

    }catch(error){
        console.log(error)
        
    }

    res.setHeader('Content-Type', 'application/json');
return res.status(200).json({message:"updated"});

})


module.exports = router;