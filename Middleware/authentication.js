const jwt = require('jsonwebtoken');
const participantModel = require('../models/studentsModel');

require('dotenv').config();

const authenticate = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers.authorization;
    if(!hasAuthorization) {
        res.status(401).json({
            message: 'User not Authorized'
        }); return
    }

const token = hasAuthorization.split(' ')[1];
if(!token){
    res.status(404).json({
        message: 'Token not found'
    }); return
}

const decodeToken = jwt.verify(token, process.env.secret)
const user = await participantModel.findById(decodeToken.userId);
if(!user){
    res.status(404).json({
        message: 'User not found'
    })
}

req.user = decodeToken

next();
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
    
}

const admin = (req, res, next) =>{
    authenticate(req, res, async() =>{
        if(req.user.isAdmin){
            next()
        } else {
            return res.status(401).json({
                message: 'Unauthorized access'
            })
        }
    })
}
module.exports = {authenticate, admin}
