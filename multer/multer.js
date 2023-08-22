var multer = require('multer');
var path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the destination folder where files should be stored
      cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: function (req, file, cb) {
      // Specify how the files should be named
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });


  const upload = multer({ storage: storage });


  module.exports = upload;



