const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // directory where uploaded files will be stored

app.post('/upload', upload.single('apk'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // Create a new File object using the uploaded file details
  const file = new File({
    name: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: req.file.path,
  });

  // Save the file object to the database
  file.save((err) => {
    if (err) {
      return res.status(500).send('Error saving file to database.');
    }

    res.send('File uploaded and saved to database!');
  });
});