const mongoose = require('mongoose');
// create a schema object from mongoose object
const participantSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      stack: {
        type: String,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
    },
      score:{
        html:{
            type: Number,
            required: true,
        },
        css:{
            type: Number,
            required: true,
        },
        javaScript:{
            type: Number,
            required: true,
        },
        node:{
          type: Number,
          required: true,
        }
        
      }
    },
    { timestamps: true }
  );
  
  // create a model object from our schema
  const participantModel = mongoose.model("particpants", participantSchema);
  
  // export the model
  module.exports = participantModel;