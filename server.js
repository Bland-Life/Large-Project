require('dotenv').config();

//MONGOOSE IS USED HERE TO TROUBLESHOOT LOCAL CONNECTIONS TO MONGODB - John
const mongoose = require('mongoose');
console.log("🔄 Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
//MONGOOSE IS USED HERE TO TROUBLESHOOT LOCAL CONNECTIONS TO MONGODB - John.



const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();

const GITHUB_SECRET = process.env.GITHUB_SECRET;

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();

app.use(cors());
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    const { username, password } = req.body;
    const db = client.db();
    const results = await
        db.collection('Users').find({ Username: username, Password: password }).toArray();
    var fn = '';
    var em = '';
    var un = '';
    var status = 'Incorrect Username or Password'
    if (results.length > 0) {
        fn = results[0].FirstName;
        em = results[0].Email;
        un = results[0].Username;
        status = 'Successfully logged in';
    }
    
    var ret = { firstName: fn, username: un, email: em, status: status };
    res.status(200).json(ret);
});

app.post('/api/signup', async(req, res, next) => {
    // incoming: login,
    var status = 'Failed to sign up';
    const { username, password, firstName, email } = req.body;
    const newUser = {
        Username: username,
        Password: password,
        FirstName: firstName,
        Email: email
    }
    try {
        const db = client.db();
        const user = await db.collection('Users').find({$or: [{Username: username}, {Email: email}]}).toArray();
        if (user.length > 0) {
            status = "User already exists";
            var ret = {status: status};
            return res.status(409).json(ret);
        }
        const result = db.collection('Users').insertOne(newUser);
        if (result.acknowledged) {
            status = "Successfully signed up";
        }
    }
    catch (e) {
        error = e.toString();
    }
    var ret = { status: status };
    res.status(200).json(ret);

});

app.post('/api/getcountries', async (req, res, next) => {
    const { username } = req.body;
    const db = client.db();
    const results = await
    db.collection('Countries').find({ Username:username }).toArray();
    var countries = []
    var status = "Failed to get countries"
    if (results.length > 0) {
        countries = results[0].Countries;
        status = "Successfully got countries";
    }
    var ret = {countries: countries, status: status};
    res.status(200).json(ret);
});

app.post('/api/addcountry', async (req, res, next) => {
    const { username, country} = req.body;
    const db = client.db();
    const results = await
    db.collection('Countries').updateOne({ Username:username }, {$push: {Countries: country}});
    var countries = []
    var status = "Failed to add";
    if (results.acknowledged) {
        status = "Successfully added"
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.post('/api/deletecountry', async (req, res, next) => {
    const { username, country} = req.body;
    const db = client.db();
    const results = await
    db.collection('Countries').updateOne({ Username:username }, {$pull: {Countries: country}});
    var status = "Failed to felete";
    if (results.acknowledged) {
        status = "Successfully deleted";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.post('/api/addusertocountries', async (req, res, next) => {
    const { username } = req.body;
    const db = client.db();
    const newUser = {
        Username: username,
        Countries: []
    };
    const results = await
    db.collection('Countries').insertOne(newUser);
    var status = "Failed to add new user to Countries"
    if (results.acknowledged){
        status = "Successfully added";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.post('/api/gettravelstats', async (req, res, next) => {
    const { username } = req.body;
    const db = client.db();
    const results = await
    db.collection('TravelStats').find({ Username:username }).toArray();
    var status = "Failed to get travel stats"
    var continents = 0;
    var countries = 0;
    var states = 0;
    var megacities = 0;
    if (results.length > 0){
        continents = results[0].Continents;
        countries = results[0].Countries;
        states = results[0].States;
        megacities = results[0].Megacities;
        status = "Success";
    }
    var ret = {
        continents: continents, 
        countries: countries, 
        states: states, 
        megacities: megacities, 
        status: status
    };
    res.status(200).json(ret);
});

app.post('/api/addemptytravelstats', async (req, res, next) => {
    const { username } = req.body;
    var stats = {
        Username: username,
        Continents: 0,
        Countries: 0,
        States: 0,
        Megacities: 0
    };
    const db = client.db();
    const results = await
    db.collection('TravelStats').insertOne(stats);
    var status = "Failed to get travel stats";
    if (results.acknowledged) {
        status = "Success";
    }
    
    var ret = {status: status};
    res.status(200).json(ret);
});

app.post('/api/addtravelstat', async (req, res, next) => {
    const { username, statname, amount } = req.body;
    const db = client.db();
    const results = await db.collection('TravelStats').updateOne({Username:username}, {$inc: {[statname]: amount}});
    var status = "Failed to update travel stats";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});


app.post('/webhook', (req, res) => {
    console.log('🚨 Received webhook POST request!');
    const signature = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
    const digest = 'sha256=' + hmac.update(req.body).digest('hex');

    if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        console.warn('Invalid GitHub webhook signature.');
        return res.status(401).send('Invalid signature');
    }
    console.log('GitHub webhook verified.');
    exec('pm2 restart script', (err, stdout, stderr) => {
        if (err) {
            console.error(`Deployment error: ${err.message}`);
            return res.status(500).send('Deployment failed');
        }
        console.log(`Deployment triggered:\n${stdout}`);
        res.status(200).send('Deployment triggered');
    });
});

app.listen(5000); // start Node + Express server on port 3000
