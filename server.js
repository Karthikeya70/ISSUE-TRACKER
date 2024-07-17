const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const sendMail = require('./nodemail')



require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;



app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/data-receiver');

const db = mongoose.connection;
db.once('open', () => {
    console.log("mongodb connected successfully");
});

const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Department: String,
    Sports: String,
    Description: String,
    SubmissionTime: { type: Date, default: Date.now },
    Status:{type:String,default:'Pending'}
});

const Users = mongoose.model("client-data", userSchema);


//serves index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

//serves user.html
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/user.html'));
});

//Accepts a form submission and saves a new user to the database and redirects back to the form.
app.post('/submit-query', async (req, res) => {
    const { Name, Email, Department, Sports, Description } = req.body;
    const user = new Users({
        Name,
        Email,
        Department,
        Sports,
        Description
    });
    await user.save();
    console.log(user);
    res.redirect('/submit-query');
});


//serves submit-query.html
app.get('/submit-query', (req, res) => {
    res.sendFile(path.join(__dirname, '/submit-query.html'));
});

//Authenticates the user and returns a Json web token if credentials are valid
app.post("/login", (req, res) => { 
    const { username, password } = req.body; 
    if (username === "admin" && password === "admin") { 
        const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' }); 
        return res.json({ username, token, msg: "Login Success" }); 

    } 
    return res.status(401).json({ msg: "Invalid Credentials" }); 
});


//Verifies the JWT in the request header
const verifyTokenMiddleware = (req, res, next) => { 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).json({ msg: "No token present" });
    
    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
        req.user = decoded; 
    } catch (err) { 
        return res.status(401).json({ msg: "Invalid Token" }); 
    } 
    next(); 
};


//Protected route that returns all the users from the server.
app.get("/action", verifyTokenMiddleware, async (req, res) => { 
   
    const users = await Users.find({});
    res.json(users);
 
});

//sends an email based on the id and type. it updates the users status in the database.
app.post('/send-mail', async (req, res) => {
    const { id, type } = req.body;
    try {
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        await sendMail(user.Email, user.Name, type);  //This sendmail is defined in nodemail.js. 
        user.Status = type === 'resolved' ? 'Resolved' : 'Under Process';
        await user.save();

        res.json({ msg: "Email sent and status updated successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to send email and update status" });
    }
});



app.listen(port, () => {
    console.log("server started on port", port);
});



