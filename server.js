const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const fileUpload = require('express-fileupload');
const Helper = require('./app/middleware/helper');
const Authorization = require('./app/middleware/authentication');
let file = require('file-system');
let fs = require('fs');

file.readFile === fs.readFile;
// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9000");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 12 * 1000000
    },
    abortOnLimit: true
}));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Global function
global.Helper = Helper;
global.Authorization = Authorization;

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

app.get('/uploads/:givenImageName', (req, res) => {
    fs.readFile('./uploads/' + req.params.givenImageName, function(err, data) {
        if (err){
            res.send({
                message: "Cannot find this photo"
            })
        }
        else {
          res.writeHead(200, {'Content-Type': 'image/jpeg'});
          res.end(data); // Send the file data to the browser.
        }
    });
})

require('./app/module/users/route/user.route.js')(app)
app.listen(3000, () => {
    console.log("App is running on port 3000");
});
