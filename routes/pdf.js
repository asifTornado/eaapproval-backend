var express = require('express');
var fs = require('fs').promises;
var path = require('path')
var router = express.Router();
var {isUserOrAdmin} = require('../middlewares/checker')
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
var jwt = require('jsonwebtoken');
var secret= require('../config').tokenSecret;

var pdfAuthenticator = function(req, res, next){

        
  var user = jwt.verify(req.params.token, secret, function(error, user){
      console.log(req.params.token)
      if(error){
          return res.send(error)
      }
      next()
  });

}



router.get("/pdf/:name/:token/:id", pdfAuthenticator, async function(req, res){


    
  var fileName = req.params.name;
  var token = req.params.token;
  var id = req.params.id;

  console.log("fileName");
  console.log(fileName)
  res.locals.filename = fileName;
  res.render("newPDF", {name:fileName, token, id})

})


// router.post("/pdf", isUserOrAdmin, async function(req, res){

//     if(req.body.file){
//         console.log("image uploaded")
//     }
// var filename = req.body.filename;
// console.log("filename from post route")
// console.log(filename)
// console.log("page Number");
// console.log(req.body.number)
// var filepath = path.join('.', 'public', 'uploads', filename)

// const existingPdfBytes =  await fs.readFile(filepath);
// const blobData = req.body.file;


// try{const pdfDoc = await PDFDocument.load(existingPdfBytes);
// const pageIndex =  parseInt(req.body.number) - 1; // Zero-based index of the page to replace (page 3 in this case)
// const page = pdfDoc.getPages()[pageIndex];
// const pngImage = await pdfDoc.embedJpg(blobData);

// var width = page.getWidth();
// var height = page.getHeight();
// page.drawImage(pngImage, {
//   x: 0,
//   y: 0,
//   width: width,
//   height: height
// });

// const pdfBytes = await pdfDoc.save();
// // Save the modified PDF document to a new file
//  await fs.writeFile(filepath, pdfBytes);
//  console.log("image saved")
// // OR send the modified PDF document as a response to the client

// }catch(error){
//   console.log(error)
// }
// res.setHeader('Content-Type', 'application/json');
// return res.status(200).json({pageNumber:req.body.number});




// })

router.post("/pdf", isUserOrAdmin, async function(req, res){

  const base64String = req.body.file;
  var newpath = path.join(__dirname, '../', 'public/uploads', req.body.path)
  console.log(path)

  // Convert the Base64-encoded string to a Buffer
  const buffer = Buffer.from(base64String, 'base64');

  // Write the buffer data to a file
  fs.writeFile(newpath, buffer, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('File upload failed');
    } else {
      res.send('File uploaded successfully!');
    }
  });
  
  return res.status(200).json({message:"file changed"});
  
  
  
  
  })
    
    


module.exports = router;