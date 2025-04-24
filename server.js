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
const fs = require('fs');
const app = express();

const GITHUB_SECRET = process.env.GITHUB_SECRET;

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
client.connect();
 
app.use(express.json({ limit: '10mb' }));
app.use('/images', express.static(path.join(__dirname, 'frontend', 'public', 'images'))); 

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
    var pi = '';
    var status = 'Incorrect Username or Password'
    if (results.length > 0) {
        fn = results[0].FirstName;
        em = results[0].Email;
        un = results[0].Username;
        pi = results[0].ProfileImage;
        status = 'Success';
    }
    
    var ret = { firstName: fn, username: un, email: em, profileimage: pi, status: status };
    res.status(200).json(ret);
});

app.post('/api/signup', async(req, res, next) => {
    // incoming: login,
    var status = 'Failed to sign up';
    const { username, password, firstName, email, profileimage} = req.body;
    const newUser = {
        Username: username,
        Password: password,
        FirstName: firstName,
        Email: email,
        ProfileImage: profileimage
    }
    try {
        const db = client.db();
        const user = await db.collection('Users').find({$or: [{Username: username}, {Email: email}]}).toArray();
        if (user.length > 0) {
            status = "User already exists";
            var ret = {status: status};
            return res.status(409).json(ret);
        }
        const result = await db.collection('Users').insertOne(newUser);
        if (result.acknowledged) {
            status = "Success";
        }
    }
    catch (e) {
        error = e.toString();
    }
    var ret = { status: status };
    res.status(200).json(ret);

});

app.delete('/api/deleteuser/:username', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    const username = req.params.username;
    const db = client.db();
    const results = await
        db.collection('Users').deleteOne({ Username: username })
    
    var status = 'Failed to delete'
    if (results.acknowledged) {
        status = 'Success';
    }
    
    var ret = { status: status };
    res.status(200).json(ret);
});

app.get('/api/getcountries/:username', async (req, res, next) => {
    const username = req.params.username;
    const db = client.db();
    const results = await
    db.collection('Countries').find({ Username:username }).toArray();
    var countries = []
    var status = "Failed to get countries"
    if (results.length > 0) {
        countries = results[0].Countries;
        status = "Success";
    }
    var ret = {countries: countries, status: status};
    res.status(200).json(ret);
});

app.put('/api/addcountry/:username', async (req, res, next) => {
    const username = req.params.username;
    const country = req.body;
    const db = client.db();
    const results = await
    db.collection('Countries').updateOne({ Username:username }, {$push: {Countries: country}});
    var countries = []
    var status = "Failed to add";
    if (results.acknowledged) {
        status = "Success"
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.put('/api/deletecountry/:username', async (req, res, next) => {
    const username = req.params.username;
    const country = req.body;
    const db = client.db();
    const results = await
    db.collection('Countries').updateOne({ Username:username }, {$pull: {Countries: country}});
    var status = "Failed to felete";
    if (results.acknowledged) {
        status = "Success";
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
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.get('/api/gettravelstats/:username', async (req, res, next) => {
    const username = req.params.username;
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

app.put('/api/addtravelstat/:username', async (req, res, next) => {
    const username = req.params.username;
    const { statname, amount } = req.body;
    const db = client.db();
    const results = await db.collection('TravelStats').updateOne({Username:username}, {$inc: {[statname]: amount}});
    var status = "Failed to update travel stats";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.put('/api/updateprofileimage/:username', async (req, res, next) => {
    const username = req.params.username;
    const { profileimage } = req.body;
    const db = client.db();
    const results = await db.collection('Users').updateOne({Username:username}, {$set: {ProfileImage:profileimage}});
    var status = "Failed to update profile image";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.post('/api/upload', (req, res) => {
    const {image} = req.body;
    var ret;

    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
        ret = {filename: "", status:"Invalid image format"}
        return res.status(400).json(ret);
    }

    const ext = matches[1].split('/')[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');

    const fileName = `image_${Date.now()}.${ext}`;

    const filePath = path.join(__dirname, 'frontend', 'public', 'images', fileName);
    const dir = path.join(__dirname, 'frontend', 'public', 'images');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    console.log(filePath);

    fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            console.log(err);
            ret = {filepath: filePath, filename: fileName, directory: dir, error: err, status:"AHHHH"};
            return res.status(400).json(ret);
        }
        ret = {filename: fileName, status: "Success"};
        return res.status(200).json(ret);
    });

});

app.post('/api/createemptygoing', async (req, res, next) => {
    const { username } = req.body;
    const userDocument = {
        Username: username,
        Trips: []
    };
    const db = client.db();
    const results = await db.collection('WhereImGoing').insertOne(userDocument);
    var status = "Failed to add user";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.put('/api/addtrip/:username', async (req, res, next) => {
    const username = req.params.username;
    const { destination, date, plans, image } = req.body;
    const tripData = {
        Destination: destination,
        Date: date,
        Plans: plans,
        Image: image
    };
    const db = client.db();
    const results = await db.collection('WhereImGoing').updateOne({Username: username}, {$push: {Trips: tripData}});
    var status = "Failed to add trip";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.put('/api/edittrip/:username', async (req, res, next) => {
    const username = req.params.username;
    const { destination, date, newdate, newplans, newimage } = req.body;
    const newTripData = {
        Destination: destination,
        Date: newdate,
        Plans: newplans,
        Image: newimage
    };
    const db = client.db();
    const results1 = await db.collection('WhereImGoing').updateOne({Username: username}, {$pull: {Trips: {Destination: destination, Date: date}}});
    const results2 = await db.collection('WhereImGoing').updateOne({Username:username}, {$push: {Trips: newTripData}});
    var status = "Failed to edit trip";
    if (results2.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.get('/api/gettrips/:username', async (req, res, next) => {
    const username = req.params.username;
    const db = client.db();

    const user = await db.collection('WhereImGoing').find({Username: username}).toArray();
    if (user.length == 0) {
        status = "Incorrect Username";
        var ret = {status: status};
        return res.status(409).json(ret);
    }

    const results = await
    db.collection('WhereImGoing').find({ Username:username }).toArray();
    var trips = []
    var status = "Failed to get trips"
    if (results.length > 0) {
        trips = results[0].Trips;
        status = "Success";
    }
    var ret = {trips: trips, status: status};
    res.status(200).json(ret);
});

app.post('/api/createtraveltools', async (req, res, next) => {
    const { username } = req.body;
    const userDocument = {
        Username: username,
        UpcomingFlights: [],
        PackingList: [{
            name: "General Packing",
            list: []
        }]
    };
    const db = client.db();
    const results = await db.collection('TravelTools').insertOne(userDocument);
    var status = "Failed to add user";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.put('/api/addpackinglist/:username', async (req, res, next) => {
    const username = req.params.username;
    const { name } = req.body
    const packinglist = {
        name: name,
        list: []
    }
    const db = client.db();
    const results = await db.collection('TravelTools').updateOne({Username:username}, {$push: {PackingList:packinglist}});
    var status = "Failed to add list";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.put('/api/addtopacking/:username', async (req, res, next) => {
    const username = req.params.username;
    const { name, packinglist } = req.body
    const db = client.db();
    const results = await db.collection('TravelTools').updateOne({Username:username, "PackingList.name": name}, {$set: {"PackingList.$.list":packinglist}});
    var status = "Failed to add list";
    if (results.acknowledged) {
        status = "Success";
    }
    var ret = {status: status};
    res.status(200).json(ret);
});

app.get('/api/getlist/:username', async (req, res, next) => {
    const username = req.params.username;
    const { name } = req.body;
    const db = client.db();
    var list = [];
    var status = "Failed to get list";
    if (name === "") {
        const results = await db.collection('TravelTools')
        .find({Username:username}, { projection: { PackingList: 1, _id: 0 } }).toArray();
        if (results?.length > 0) {
            status = "Success";
            list = results[0].PackingList;
        }
    }else {
        const results = await db.collection('TravelTools')
        .find({Username:username, "PackingList.name":name}, { projection: { PackingList: 1, _id: 0 } }).toArray();
        if (results?.length > 0) {
            status = "Success";
            list = results?.[0]?.PackingList?.find(p => p.name === name)?.list || [];
        }
    }
    var ret = {list: list, status: status};
    res.status(200).json(ret);
});

app.post('/webhook', express.raw({ type: '*/*' }),  (req, res) => {
    console.log('🚨 Received webhook POST request!');
    exec('pm2 restart script', (err, stdout, stderr) => {
        if (err) {
            console.error(`Deployment error: ${err.message}`);
            return res.status(500).send('Deployment failed');
        }
        console.log(`Deployment triggered:\n${stdout}`);
        res.status(200).send('Deployment triggered');
    });
    return;
    // For verifying the webhook. Temporarily removed validation.
    const signature = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
    const digest = 'sha256=' + hmac.update(req.body).digest('hex');

    if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
        console.warn('Invalid GitHub webhook signature.');
        return res.status(401).send('Invalid signature');
    }
    console.log('GitHub webhook verified.');
    
});

app.listen(5000); // start Node + Express server on port 3000
