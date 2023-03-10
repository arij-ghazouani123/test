//import mongoose from "mongoose";
const mongoose = require('mongoose');

const {Schema , model} = mongoose;
const contributorSchema = new Schema(
    {
      user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user'
        },
        role: {
            type: String,
            required: false,
            enum: ['Developer', 'Tester', 'Maintainer'],
            default:'Maintainer'
    
        },

        projects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project'
          }],


});


const contributor = new mongoose.model('contributor', contributorSchema);

module.exports = contributor;
//export default model ("contributor",contributorSchema);