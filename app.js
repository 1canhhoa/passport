var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session  = require('express-session');
var passport = require("passport")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mongodb = require('./configs/mongodb');

var app = express();mongodb();




// const redis = require("ioredis")
// const RedisStore = require("connect-redis").default;
// const client = redis.createClient({legacyMode: true})
// client.on('connected',()   =>   console.log('connected to redis successfully!'))
// client.on('error', (err) => console.log('Could not establish a connection with redis', err));




app.use(session({
  secret: 'keyboard cat', // giải mã session gửi về
  resave: false,
  saveUninitialized: true,// tạo ra connect.sid
  cookie: { 
    secure: true,        // cần https để đẩy cookie về server,
    maxAge: 5*60*1000          //5giay reset
  }
  // store:new RedisStore({client:client})
}))


app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(function(user, done) {//thêm user lấy từ profile vào session.passport
  console.log("profile user",user)
  console.log("4")
  done(null,user)
});

passport.deserializeUser(function(user, done) {//giải mã session gửi về từ client
  console.log("5",user)
  done(null,user)
  });

  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);



const allowCrossDomain = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
};
app.use(allowCrossDomain);








// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
