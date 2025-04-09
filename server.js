require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
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
    var error = '';
    const { login, password } = req.body;
    const db = client.db();
    const results = await
        db.collection('Users').find({ Login: login, Password: password }).toArray();
    var id = -1;
    var fn = '';
    var ln = '';
    if (results.length > 0) {
        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }
    var ret = { id: id, firstName: fn, lastName: ln, error: '' };
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
    exec('bash ./deploy.sh', (err, stdout, stderr) => {
        if (err) {
            console.error(`Deployment error: ${err.message}`);
            return res.status(500).send('Deployment failed');
        }
        console.log(`Deployment triggered:\n${stdout}`);
        res.status(200).send('Deployment triggered');
    });
});

app.listen(5000); // start Node + Express server on port 3000
