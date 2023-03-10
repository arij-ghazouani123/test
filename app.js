const dotenv = require('dotenv');
require("dotenv").config();
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
// assuming the getApkVersion function is defined in a separate file

const ApkParser = require('apk-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // directory where uploaded files will be stored


const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");

const app = express();


dotenv.config({path : './env'});
require('./db/conn');
const port = process.env.PORT;


const Users = require('./models/userSchema');
const contributor = require('./models/contributorSchema');
const File = require('./models/releaseSchema');
const authenticate = require('./middleware/authenticate')
//const getApkVersion = require('./getApkVersion'); 

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("Dashboard");
})


app.use(
	cookieSession({
		name: "session",
		keys: ["Build-Lab"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
	cors({
		origin: "http://localhost:9090",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use("/auth", authRoute);



// Registration
app.post('/register', async (req, res)=>{
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const createUser = new Users({
            username : username,
            email : email,
            password : password
        });

        const created = await createUser.save();
        console.log(created);
        res.status(200).send("Registered");

    } catch (error) {
        res.status(400).send(error)
    }
})

// Login User
app.post('/login', async (req, res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find User if Exist
        const user = await Users.findOne({email : email});
        if(user){
            // Verify Password
            const isMatch = await bcryptjs.compare(password, user.password);

            if(isMatch){
                // Generate Token Which is Define in User Schema
                const token = await user.generateToken();
                res.cookie("jwt", token, {
                    // Expires Token in 24 Hours
                    expires : new Date(Date.now() + 86400000),
                    httpOnly : true
                })
                res.status(200).send("LoggedIn")
            }else{
                res.status(400).send("Invalid Credentials");
            }
        }else{
            res.status(400).send("Invalid Credentials");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

// Logout Page
app.get('/logout', (req, res)=>{
    res.clearCookie("jwt", {path : '/'})
    res.status(200).send("User Logged Out")
})

// Authentication
app.get('/auth', authenticate, (req, res)=>{

})




app.post('/upload', upload.single('apk'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // Handle the uploaded file here
  console.log(req.file);

  res.send('File uploaded successfully!');
});

/*
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
  });*/

/*
  app.post('/upload', upload.single('apk'), (req, res) => {
   const apkParser = new ApkParser();
    const apkFilePath = req.file.path;
  
    apkParser.parse(apkFilePath, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error parsing APK file');
        return;
      }
  
      const versionName = data.manifest.versionName;
      const versionCode = data.manifest.versionCode;
      const minSdkVersion = data.manifest['uses-sdk'].minSdkVersion;
  
      res.status(200).json({
        versionName,
        versionCode,
        minSdkVersion
      });
    });
  });
  
*/


/*
app.post('/upload', upload.single('apk'), (req, res) => {
  const apkParser = new ApkParser({
    cb: (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error parsing APK file');
        return;
      }
      const versionName = data.manifest.versionName;
      const versionCode = data.manifest.versionCode;
      const minSdkVersion = data.manifest['uses-sdk'].minSdkVersion;

      res.status(200).json({
        versionName,
        versionCode,
        minSdkVersion
      });
    }
  });

  const apkFilePath = req.file.path;
  apkParser.parse(apkFilePath);
});
*/


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
