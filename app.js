
var express = require('express');
var sessions = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bodyParser = require('body-parser');
var multer = require('multer');
var {engine} = require('express-handlebars');
var handlebarHelpers = require('./handlebarHelpers');
const compression = require('compression')
var history = require('connect-history-api-fallback');


// var path = __dirname + '/vue/'

// const redis = require('redis')
const MongoDBStore = require('connect-mongodb-session')(sessions)
// const MongoDBStore = require('connect-mongo');
// const { BSON } = require('bson');
// var RedisStore = require('connect-redis')(sessions);



// var client = redis.createClient ({
//   host: 'localhost',
//   port: '6379'
// });

var urlencodedParser = bodyParser.urlencoded({ extended: false })


const MONGODB_URI = "mongodb://127.0.0.1:27017/";


const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
  databaseName: 'eapproval'
});








// Serialize the session data before storing it in MongoDB


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where files should be stored
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: function (req, file, cb) {
    // Specify how the files should be named
 
    if(req.body.source && req.body.source == 'pdfEdit' ){
     console.log('entered multer if')
     
      console.log(`this is the original name ${file.originalname}`)

      cb(null, file.originalname);
    }else{
      console.log('entered multer else')
      console.log(req.body)    
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }

}
}
);


const upload = multer({ storage: storage,   limits:{fileSize: 50 * 1000 * 1000, fieldSize: 50 * 1000 * 1000} });



var usersRouter = require('./routes/normal_users');
var authenticationRouter = require('./routes/authentication');
var adminRouter = require('./routes/admin');
var registerRouter = require('./routes/register');
var signatureRouter = require('./routes/signature');
var fileRouter = require('./routes/file');
var auditRouter = require('./routes/audit');
var pdfRouter = require('./routes/pdf');
var imageEditorRouter = require('./routes/image_editor');
var messageRouter = require('./routes/message');
var emailRouter = require('./routes/emailRoutes');
var notificationRouter = require('./routes/notifications');
var svgRouter = require('./routes/svgDrawing');
var apiRouter = require('./routes/api')


var app = express();
const oneDay = 1000 * 60 * 60 * 24;
// view engine setup
app.set('views', path.join(__dirname, 'views'));



app.engine( 'hbs', engine( { 
  extname: 'hbs', 
  defaultLayout: 'main', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers:handlebarHelpers
} ) );
app.set('view engine', 'hbs');

app.use(compression())

app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:false,
  cookie: { maxAge: oneDay },
  resave: false,
  store: store
}));

app.use(cors());




app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(upload.array('file'));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

app.use(cookieParser());






app.use(express.static(path.join(__dirname, 'public')));

app.use(history({
  index: '/index'
}));




app.get('/index', function (req,res) {
  res.sendFile(path + "index.html");
  });
  
app.use('/', usersRouter);
app.use('/', authenticationRouter);
app.use('/', adminRouter);
app.use('/', registerRouter);
app.use('/', signatureRouter);
app.use('/', fileRouter);
app.use('/', auditRouter);
app.use('/', pdfRouter);
app.use('/', imageEditorRouter);
app.use('/', messageRouter);
app.use('/', emailRouter);
app.use('/', notificationRouter);
app.use('/', svgRouter);
app.use('/', apiRouter)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
