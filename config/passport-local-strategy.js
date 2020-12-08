const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback:true
    },
    function(req,email, password, done){
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user)  {
            if (err){
                // console.log('Error in finding user --> Passport');
                req.flash('error',err);
                return done(err);
            }

            if (!user || user.password != password){
                req.flash('error','Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }


));



// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});
// check if user is authenticated
passport.checkAuthentication = function(req,res,next){
    // if user is signed in then pass on the request to next function(controllers action)
    if(req.isAuthenticated()){
        return next();
    }
    // if user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // request.user contain curretnt signed in user from he session cookie
        res.locals.user = req.user;
    }
    return next();
}



module.exports = passport;