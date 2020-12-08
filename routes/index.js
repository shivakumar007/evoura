// Require express
const express = require('express');
const router=express.Router();
// get controller
const homeController = require('../controllers/home_controller');
router.get('/',homeController.home);
// for route /users and following route
router.use('/users',require('./users'));
// sign out user
module.exports=router;