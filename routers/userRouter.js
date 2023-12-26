const express = require('express');
const {signUp, logIn, getAll, getOne, updateScore, logOut} = require('../controller/controller2');
const {authenticate, admin} = require('../Middleware/authentication')

const router = express.Router();

router.post('/register', signUp),
router.post('/login', logIn),
router.get('/all', admin, getAll),
router.get('/oneUser/:userId', authenticate, admin, getOne),
router.put('/updateScore/:userId', admin, updateScore);
router.get('/logout/:userId', authenticate, logOut)


module.exports = router;