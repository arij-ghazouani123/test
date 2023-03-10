const mongoose = require('mongoose');

// Define a schema for the uploaded file
const fileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  mimetype: String,
  path: String,
});

// Create a Mongoose model for the file schema
const File = new mongoose.model('File', fileSchema);

module.exports = File;