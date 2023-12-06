const express = require('express');
const {createParticipant, getAll, getOne, updateParticipant, deleteParticipant, makeAdmin}= require('../controller/studentController');
const requestInfo = require('../Middleware/requestInfo');

const router = express.Router();
router.post('/create', requestInfo, createParticipant);
router.get('/getall', requestInfo, getAll);
router.get('/getone/:participantId', requestInfo, getOne);
router.put('/update/:participantId', requestInfo, updateParticipant);
router.delete('/delete/:participantId', requestInfo, deleteParticipant);
router.put('/admin/:adminId', requestInfo, makeAdmin);

module.exports = router;