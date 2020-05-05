const express = require('express');
const router = express.Router();
const USER = require('../controllers/user.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', jwtHelper.verifyJwtToken, USER.register);
router.post('/authenticate', USER.authenticate);
router.get('/fetchAllUserProfile', jwtHelper.verifyJwtToken, USER.fetchAllUserProfile);
router.post('/fetchUserProfile', jwtHelper.verifyJwtToken, USER.fetchUserProfile);
router.post('/updateUserDetails', jwtHelper.verifyJwtToken, USER.updateUserDetails);
router.post('/resetPassword', jwtHelper.verifyJwtToken, USER.resetPassword);
router.post('/deleteUser', jwtHelper.verifyJwtToken, USER.deleteUser)

module.exports = router;