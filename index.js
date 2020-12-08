const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
// used for sending mails
const nodemailer = require('nodemailer');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
// requiring passport and strategy
const passport = require('passport');
const passportLocal=require('./config/passport-local-strategy');
const googlePassport=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
const flash=require('connect-flash');
const customMware=require('./config/middleware');
app.use(express.urlencoded());
// used to make changes to cookies 
app.use(cookieParser());
//setting location for static files
app.use(express.static('./assets'));
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store session cookie in the dp
app.use(session({
    name: 'authenticate',
    // TODO change the secret before deployment in production mode
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    function (err) {
        console.log(err||'connect-mongo setup ok')
    })
}));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
// using flash messages
app.use(flash());
app.use(customMware.setFlash);
// use express router
app.use('/', require('./routes'));

// listening to ports
app.listen(port,function(err){
    if(err){
        console.log(`Error in starting the server : ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
})