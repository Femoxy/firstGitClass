const participantModel = require('../models/studentsModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signUp = async (req, res) => {
    try {
        // Get the required fields from the request object body
        const {fullName, email, password, stack, role} = req.body;
        if(!fullName || !email || !password || !stack || !role){
            return res.status(400).json({
                message: 'Please provide all necessary informations'
            })
        }

        //check if the user already exist in the database
        const checkUser = await participantModel.findOne({email: email.toLowerCase()})
        if(checkUser){
            return res.status(409).json({
                message: 'User already Registered'
            })
        }

        //Encrypt the Participant's password
        const salt = bcrypt.genSaltSync(12);
        const hashPassword = bcrypt.hashSync(password, salt);

        // Use the role to determine an Admin
        let admin;

        if(role === 'Teacher'){
            admin = true;
        } else {
            admin = false;
        }

        // Create a new user
        const user = new participantModel({
            fullName,
            email,
            stack,
            password: hashPassword,
            role,
            isAdmin: admin
        });
        await user.save();
        res.status(201).json({
            message: 'User created successfully',
            data: user
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
}

//User Login
const logIn = async (req, res) => {
    try {
        // Get the User's login details
        const {email, password} = req.body;

        //make sure both fileds are provided
        if(!email || !password){
           return res.status(400).json({
                message: 'Please provide your information'
            })
        }

        // Find the user in the database
        const user = await participantModel.findOne({email: email.toLowerCase()});

        //Check if user is not existing and return a response
        if(!user){
            return res.status(404).json({
                message: 'User not Found'
            })
        };

        //Verify the user's password
        const checkPassword = bcrypt.compareSync(password, user.password);
        if(!checkPassword){
            return res.status(400).json({
                message: 'Invalid password'
            })
        };

        // Generate a token for the User
        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }, process.env.secret, {expiresIn: '1d'});
        
           res.status(200).json({
             message: 'Login successful',
              token
            })
            
        // if (token){
        //     res.status(200).json({
        //         message: 'Login successful',
        //         token
        //     }); return
        // } else {
        //     res.status(400).json({
        //         message: "Token expired"
        //     })
        // }
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
}

const getAll = async(req, res) => {
    try {
        const user = await participantModel.find();
        if(user.length === 0){
            res.status(200).json({
                message: `There are no user in the database`
            })
        }
        res.status(200).json({
            message: `These are ${user.length} user in the database`,
            data: user
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message 
               })
        
    }
}

const getOne = async (req, res) => {
    try {
       const userId = req.user.userId
        const user =  await participantModel.findById(userId)
        if(!user) {
            return res.status(404).json({
                message: 'User not Found'
            });
        } else { 
            res.status(200).json({ 
                message: "User record found",
                user
            })
        }
        
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
        
    }
}


//Function to Add a student score 
const updateScore = async (req, res) => {
    try {
      // Get the student's ID to be update score
      const id = req.user.userId;
  
      //Get the score from the body
      const { html, node, javaScript, css } = req.body.score;
  
      // Find the student with the ID 
      const student = await participantModel.findById(id);
  
      // Check if the student is not found
      if (!student) {
        return res.status(404).json({
          message: `Student with ID ${id} not found`
        })
      }
  
      // Update the student's score sheet 
      const data = {
        score: {
          html,
          node,
          javaScript,
          css
        }
      }
  
      // To check if the user adding score is an admin and if the user been added score to is also an admin
      if (student.isAdmin === true) {
        return res.status(400).json({
          message: "A Teacher can't add score to another Teacher",
        })
      }
  
      //Update the database with the entered score
      const updatedStudent = await participantModel.findByIdAndUpdate(id, data, { new: true });
  
      // Return a response 
      return res.status(201).json({
        message: 'Score updated successfully',
        data: updatedStudent
      })
    } catch (err) {
      return res.status(500).json({
        Error: 'Internal Server Error: ' + err.message
      })
    }
  }

const logOut = async (req, res) => {
    try {
        // Get the user's ID from the request user payload
        const {userId} = req.user

        // get your token from the authorization
        const hasAuthorization = req.headers.authorization;
        //  check if it is empty
        if(!hasAuthorization){
            res.status(404).json({
                message: "Authorized token not found"
            }); return
        }
        //  split the token fron the bearer
        const token = hasAuthorization.split(' ')[1];
        const user = await participantModel.findById(userId);
        
    //  check if the user does not exist
        if (!user){
            return res.status(404).json({
                message: "user not found"
            })
        }
    // Blacklist the token
        user.blacklist.push(token);

        await user.save();
        // Return a response
        res.status(200).json({
            message: "User logged out successfully"
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
}

module.exports = {signUp, logIn, getAll, getOne, updateScore, logOut}