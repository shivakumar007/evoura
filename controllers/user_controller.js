const { model } = require("mongoose");
// rendering the user profile page
const User=require('../models/user');
const { use }=require("../routes");
const { localsName }=require("ejs");
const nodemailer=require('nodemailer')
// 
// rendering the sign in page
module.exports.SignIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in',{
        title:"Authenticator | Sign In"
    });
}
//rendering the sign up page 
module.exports.SignUp=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up',{
        title:"Authenticator | Sign Up"
    });
}
// get the sign up data
module.exports.create = function(req,res){
    // console.log(req.body);
if(req.body.password!=req.body.confirmPassword){
    return res.redirect('back');
}
User.findOne({email:req.body.email},function(err,user){
    if(err){
        console.log("Error in finding the user");
    }
    if(!user){
        User.create(req.body,function(err,user){
            if(err){
                console.log("error in creating the user");
                return;
            }
            return res.redirect('/users/sign-in');
        });
    }else{
        return res.redirect('back');
    }
});
}
// sign in and create a session for user
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');

    return res.redirect('/users/profile');
}
// show user profile
module.exports.profile = function(req,res){
    return res.render('profile',{
        title:'profile'
    });
}
// sign out
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You Have Logged out');
    return res.redirect('/');
}
// update password form

module.exports.updatePasswordForm = function(req,res){
    return res.render('update_password',{
        title:'Authenticator | update'
    })
}
// updating the password
module.exports.updatePassword = function(req,res){
    if(req.body.password!=req.body.confirmPassword){
        req.flash('error','Passwords don\'t  match');
        return res.redirect('back');
    }
    User.findById(req.params.id,function(err,user){
        if(err){
            console.log(`Error in finding user :${err}`);
            return;
        }
        if(user.password!=req.body.oldPassword){
            req.flash('error','Invalid Password');
            return res.redirect('back');
        }
        let newUser = user;
        newUser.password=req.body.password;
        User.findByIdAndUpdate(req.params.id,newUser,function(err,UpdatedUser){
            if(err){
                console.log(`Error in updating the user:${err}`);
                return;
            }
            req.flash('success','Password Updated');
            return res.redirect('back');
        })

    })
}
// forgot password form
module.exports.forgotPasswordForm = function(req,res){
    return res.render('forgot_password',{
        title:'Authenticator | forgot password'
    });
}
module.exports.sendPassword = function(req,res){
    // configuring node mailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'something',
        pass: 'something' // naturally, replace both with your real credentials or an application-specific password
        }
    });
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            req.flash('error','User with this mail does not exists!');
            return res.redirect('back');
        }
        const mailOptions = {
            from: 'vindication@enron.com',
            to: user.email,
            subject: 'Forgot Password O-Auth',
            text: 'Your Password is : '+user.password
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        req.flash('success','Your password have been sent to your mail!');
        return res.redirect('back');
    })
    
}