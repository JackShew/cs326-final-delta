// import {settings} from './settings.env';
const express = require('express');
//const multer  = require('multer');
const app = express();

const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
require('dotenv').config();
console.log(process.env)
const {MongoClient} = require("mongodb");
//const uri = process.env.MONGODB_URI; 
//console.log(uri);// Causes error
// new stuff from minicrypt
const expressSession = require('express-session');
const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
const minicrypt = require('./miniCrypt');
const mc = new minicrypt();


const session = {
  secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
  resave : false,
  saveUninitialized: false
};

// App configuration
const strategy = new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password'
},
  async (username, password, done) => {
    if (!findUser(username)) {
        // no such user
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { 'message' : 'Wrong username' });
    }
    if (!validatePassword(username, password)) {
        // invalid password
        // should disable logins after N messages
        // delay return to rate-limit brute-force attacks
        await new Promise((r) => setTimeout(r, 2000)); // two second delay
        return done(null, false, { 'message' : 'Wrong password' });
    }
  // success!
  // should create a user object here, associated with a unique identifier
    return done(null, username);
  });

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
  done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
  done(null, uid);
});

app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : true})); // allow URLencoded data
// new stuff

let secrets;
let uri;
if (!process.env.MONGODB_URI) {
  secrets = require('secrets.json');
  uri = secrets.MONGODB_URI;
} else {
	uri = process.env.MONGODB_URI;
}



app.use(express.static(__dirname + '/public'))
//app.use(express.static(__dirname + '/images'))
app.use('/uploads', express.static('uploads'));
app.get('/failure',(req,res)=>{
    res.send('Hello World, from express');
  }
)
// authentication round 9
app.post('/alogin',
	 passport.authenticate('local' , {     // use username/password authentication
	     'successRedirect' : '/private',   // when we login, go to /private 
	     'failureRedirect' : '/dishes'      // otherwise, back to login
	 }));

// Handle the URL /login (just output the login.html file).
// app.get('/alogin/:address/:password',
// app.get('/alogin',
// 	(req, res) => res.sendFile('public/index.html',
// 				   { 'root' : __dirname }));

// Handle logging out (takes us back to the login page).
app.get('/alogout', (req, res) => {
    req.logout(); // Logs us out!
    res.redirect('/dishes'); // back to login
});


// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register',
	 (req, res) => {
  const username = req.body['username'];
  const password = req.body['password'];
  if (addUser(username, password)) {
    res.redirect('/login');
	} else {
	  res.redirect('/register');
	}
});

// Register URL
app.get('/register',
	(req, res) => res.sendFile('public/index.html',
				   { 'root' : __dirname }));

// Private data
app.get('/private',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
	    res.redirect('/private/' + req.user);
	});

// A dummy page for the user.
app.get('/private/:userID/',
	checkLoggedIn, // We also protect this route: authenticated...
	(req, res) => {
	    // Verify this is the right user.
	    if (req.params.userID === req.user) {
		res.writeHead(200, {"Content-Type" : "text/html"});
		res.write('<H1>HELLO ' + req.params.userID + "</H1>");
		res.write('<br/><a href="/logout">click here to logout</a>');
		res.end();
	    } else {
		res.redirect('/private/');
	    }
	});
  
// authentication stuff
// app.post('/authLogin',
//     passport.authenticate('local',{
//       'successRedirect':'/private',
//       'failureRedirect':'/authLogin'
//     }));

// // Handle the URL /login (just output the login.html file).
// app.get('/authLogin',
// 	(req, res) => {
//     console.log("WEE");
//     res.sendFile('/public/index.html',
// 				   { 'root' : __dirname });
//   });

// // Handle logging out (takes us back to the login page).
// app.get('/authLogout', (req, res) => {
//     req.logout(); // Logs us out!
//     res.redirect('/authLogin'); // back to login
// });

// // Like login, but add a new user and password IFF one doesn't exist already.
// // If we successfully add a new user, go to /login, else, back to /register.
// // Use req.body to access data (as in, req.body['username']).
// // Use res.redirect to change URLs.
// app.post('/register',
// 	 (req, res) => {
// 	     const username = req.body['username'];
// 	     const password = req.body['password'];
// 	     if (addUser(username, password)) {
// 		      res.redirect('/authLogin');
// 	     } else {
// 		      res.redirect('/register');
// 	     }
// 	 });

// // Register URL
// app.get('/register',
// 	(req, res) => res.sendFile('/public/index.html',
// 				   { 'root' : __dirname }));

// // Private data
// app.get('/private',
// 	checkLoggedIn, // If we are logged in (notice the comma!)...
// 	(req, res) => {             // Go to the user's page.
//       console.log("weee");
// 	    res.redirect('/private/' + req.user);
// 	});

// // A dummy page for the user.
// app.get('/private/:userID/',
// 	checkLoggedIn, // We also protect this route: authenticated...
// 	(req, res) => {
// 	    // Verify this is the right user.
// 	    if (req.params.userID === req.user) {
// 		res.writeHead(200, {"Content-Type" : "text/html"});
// 		res.write('<H1>HELLO ' + req.params.userID + "</H1>");
// 		res.write('<br/><a href="/logout">click here to logout</a>');
// 		res.end();
// 	    } else {
// 		res.redirect('/private/');
// 	    }
// 	});

app.post('/updateScore', async function(req, res) {
  
  console.log(req.body);
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');

    collection.updateOne({title: req.body.title}, {$set:{score:req.body.score}});
    //const p = await collection.insertOne(data);
    const myDoc = await collection.findOne();
  }catch(err){
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  res.status(200).json({ status: 'success'});
});


app.post('/updateDescription', async function(req, res) {
  
  console.log(req.body);
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');

    collection.updateOne({title: req.body.title}, {$set:{description:req.body.description}});
    //const p = await collection.insertOne(data);
    const myDoc = await collection.findOne();
  }catch(err){
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  res.status(200).json({ status: 'success'});
});

app.post('/deleteDish', async function(req, res) {
  
  console.log(req.body);
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');

    collection.deleteOne({title: req.body.title});
    //const p = await collection.insertOne(data);
    const myDoc = await collection.findOne();
  }catch(err){
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  res.status(200).json({ status: 'success'});
});



app.post('/postDish', async function(req, res) {
  console.log(req.query);
  // console.log(req.body);
  console.log("uri" + uri);
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const image = req.body.image;
  const score = 1;
  const comments = 0;
  const data = {
    "title":title,
    "description":description,
    "location":location,
    "image":image,
    "score":0,
    "comments":comments
  }

  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    const p = await collection.insertOne(data);
    const myDoc = await collection.findOne();
  }catch(err){
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  res.status(200).json({ status: 'success'});
});

app.get('/dishes', async function(req,res) {
  console.log('data');

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  console.log('data');

  try {
    await client.connect();

    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    const cursor = collection.find();
    let data = [];
    console.log('data');

    await cursor.forEach((entry) => {console.log(data); data.push(entry)});
    console.log(data);
    res.send(data);
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});
app.get('/hi', (req, res) => {
  res.send('Hello World, from express');
});

app.get('/api/worchester/', (req, res) => {
  res.send(worchester);
})

app.get("/login/:address/:password", async function(req,res){
  console.log("attempting login");
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const address = req.params.address;
  const password = req.params.password;
  // const [salt,hash] = mc.hash(password);

  console.log(address);
  console.log(password);
  try{
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    // console.log(collection);
    const user = await collection.findOne({
      "address": address});
    console.log(user);
    if(mc.check(password,user.password[0],user.password[1])){
      console.log("signing in");
      res.send(user);
    }else{
      console.log("Address or password does not match");
      res.send({"no Sign in":"Address or password does not match"});
    }
    // const data = [];
    // await users.forEach((entry)=>{data.push(entry)});
    // console.log(users);
  }catch(err){
    console.log(err);
  }finally{
    client.close();
  }
})

app.post("/signUp", async function(req,res){
  // console.log(res.body);
  // console.log(uri);
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const address = req.body.address;
  const password = req.body.password;
  const [salt,hash] = mc.hash(password);
  const data = {"address":address, "password":[salt,hash]};
  try{
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    // console.log(collection);
    const userInColl = await collection.findOne({
      "address": address
    });
    if(userInColl){  
      console.log("address already has account")
    }else{
      await collection.insertOne(data);
      console.log(data);
    }

  }catch(err){
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
})

app.put('/increment', async function(req, res){
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const title = req.body.title;
  const score = req.body.score;
  try{
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    const p = await collection.updateOne(
        {"title": title},
        {$set:
        {
          "score":score+1
        }}
    );
  }
  catch(err){
    console.log(err);
  }
  finally{
    await client.close();
  }
  res.status(200).json({ status: 'success'});
})

// minicrypt stuff
async function findUser(address){
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    
    if(collection.findOne({
      "address": address
    })){
      client.close();
      return true;
    }else{
      client.close();
      return false;
    }
  }catch(err){
    console.log(err);
  }
  finally{
    await client.close();
  }
}

async function addUser(address, password){
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    
    if(collection.findOne({
      "address": address
    })){
      client.close();
      return false;
    }else{
      const [salt, hash] = mc.hash(password);
      await collection.insertOne({"address":address, "password":[salt,hash]});
      client.close();
      return true;
    }
  }catch(err){
    console.log(err);
  }
  finally{
    await client.close();
  }
}

// Returns true iff the password is the one we have stored.
async function validatePassword(name, pwd) {
  if (!findUser(name)) {
    return false;
  }
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    
    if (mc.check(pwd, users[name][0], users[name][1])) {
      return true;
    }
      return false;
  }catch(err){
    console.log(err);
  }
  finally{
    await client.close();
  }
}
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {    
// If we are authenticated, run the next route.
    next();
  } else {
// Otherwise, redirect to the login page.            
    res.redirect('/authLogin');
  }
}
let users = {}; // name : [salt, hash]

// Illustration of how salts and hashes look and work
const exampleSalt = '541818e33fa6e21a35b718bbd94d1c7f';
const exampleHash = '902f945dc114cdf04bb1b2bbcc2ccdef6e416fdb1dce93ed8f34dc6aac02eefaaaf5d65c657dec6e405efa977a26c8e41ff4eb3f46722fbd88779a25d1a22c5b';
console.log(mc.check('compsci326', exampleSalt, exampleHash)); // true
console.log(mc.check('nope', exampleSalt, exampleHash)); // false

async function main(){
  /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";


  const client = new MongoClient(uri);

  try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      await  listDatabases(client);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}



// app.post('/book', (req, res) => {
//   const book = req.body;

//   // Output the book to the console for debugging
//   console.log(book);
//   books.push(book);

//   res.send('Book is added to the database');
// });


// app.put('/user', (req, res) => {
//     res.send('Got a PUT request at /user')
//   })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})