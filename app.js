const express = require('express');
const app = express();
const https = require('https');
const axios = require('axios');
const cheerio = require('cheerio');
const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
require('dotenv').config();
console.log(process.env)
const {MongoClient} = require("mongodb");
const minicrypt = require('./miniCrypt');
const mc = new minicrypt(); 
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const { rmSync } = require('fs');
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
var account = "guest";
const session = {
  secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
  resave : false,
  saveUninitialized: false
};

let secrets;
let uri;

if (!process.env.MONGODB_URI) {
  secrets = require('./secrets.json');
  uri = secrets.MONGODB_URI;
} else {
	uri = process.env.MONGODB_URI;
}


const strategy = new LocalStrategy(
  async (username, password, done) => {
	if (! await findUser(username)) {
    // no such user
    await new Promise((r) => setTimeout(r, 2000)); // two second delay
    return done(null, false, { 'message' : 'Wrong username' });
	}
	if (! await validatePassword(username, password)) {
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
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))
//app.use(express.static(__dirname + '/images'))
app.use('/uploads', express.static('uploads'));


// Account management Functions
// Returns true iff the user exists.
async function findUser(username) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    const user = await collection.findOne({address:username});
    if(!user){
      return false;
    }else{
      return true;
    }
    }catch(err){
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

// Returns true iff the password is the one we have stored.
async function validatePassword(name, pwd) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    const user = await collection.findOne({address:name});
    if(!user){
      return false;
    }
    if (mc.check(pwd, user.password[0], user.password[1])) {
      return true;
    }
      return false;
    }catch(err){
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

// Add a user to the "database".
async function addUser(name, pwd) {
  if(await findUser(name)){
    return false;
  }
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    const [salt, hash] = mc.hash(pwd);
    const user = await collection.insertOne({address:name, password: [salt,hash]});
    console.log(user);
    return true;
    }catch(err){
      console.log(err);
    }
    finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

// Routes

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // If we are authenticated, run the next route.
    next();
  } else {
    // Otherwise, redirect to the login page.
    res.redirect('/login');
  }
}

app.post('/updateScore', async function(req, res) {
  
  console.log(req.body);
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const index = req.body.index;
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    if(index){
      collection.updateOne({title: req.body.title}, {$set:{[`comments.${index}.score`]:req.body.score}});
    }else{
      collection.updateOne({title: req.body.title}, {$set:{score:req.body.score}});
    }
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
  if(account == "Admin"){
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
  }
});

app.post('/deleteDish',checkLoggedIn, async function(req, res) {
  if(account == "Admin"){
    console.log(req.body);
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect();
      const database = client.db('GrubGaugeData');
      const collection = database.collection('Posts');

      await collection.deleteOne({title: req.body.title});
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
  }
});

app.get('/commentData/:dish', async function(req,res){
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  const dish = req.params.dish;
  try {
    await client.connect();

    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    //console.log(collection);
    const dishPost = await collection.findOne({"title":dish});
    res.send(dishPost.comments);
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});
app.get('/comments.html', checkLoggedIn,
(req, res) => {
    console.log(res);
    res.render("./comments.html");
})

app.post('/postComment', checkLoggedIn, async function(req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const dish = req.body.dish;
  console.log(req.body);
  const d = new Date().toLocaleDateString();
  const text = req.body.text;
  const user = account;
  // const score = req.body.score;
  const data = {
    "commenter":user,
    "date":d,
    "text":text,
    "score":1
  }

  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    await collection.updateOne(
      {"title": dish},
      {$push:
      {
        "comments":data
      }}
  );
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
  console.log(req.body);
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const image = req.body.image;
  const score = 1;
  const comments = [];
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
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    await client.connect();

    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    //console.log(collection);
    const cursor = collection.find();
// console.log(cursor);
    let data = [];
    await cursor.forEach((entry) => {data.push(entry)});
    // console.log(data);
    res.send(data);
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.get('/dish/:title/:hall', async function(req,res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const title = req.params.title;
  const hall = req.params.hall;
  try {
    await client.connect();

    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    //console.log(collection);
    const dishData = await collection.findOne({"title":title, "location":hall});
    res.send(dishData);
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

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

function getScrapeDishes(data, location) {
  var $ = cheerio.load(data);
  var result = [];
  let inter = 0;
  $('.dinner_fp').each(function(i, element) {
    // Select the .lightbox-nutrition elements within the current .dinner_fp element
    var lightboxElements = $(this).find('.lightbox-nutrition');

    // Iterate over the .lightbox-nutrition elements
    lightboxElements.each(function(j, lightboxElement) {
      var title = $(this).text();
      var description = $(this).find('a').attr('data-ingredient-list');
      if(inter < 7) {
        result.push({
          title: title,
          description: description,
          location: location,
          image: "",
          score: 0,
          comments:[]
        });
        inter++;
      }
     
    });
  });
  return result;
}

app.get('/worchester', function(req, res) {
  // Using the http module
  https.get('https://umassdining.com/locations-menus/worcester/menu', (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let result = getScrapeDishes(data, "worcester");
      res.send(result);
    });
  });
});

app.get('/frank', function(req, res) {
  // Using the http module
  https.get('https://umassdining.com/locations-menus/franklin/menu', (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let result = getScrapeDishes(data, "frank");
      res.send(result);
    });
  });
});

app.get('/hamp', function(req, res) {
  // Using the http module
  https.get('https://umassdining.com/locations-menus/hampshire/menu', (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let result = getScrapeDishes(data, "hamp");
      res.send(result);
    });
  });
});

app.get('/berk', function(req, res) {
  // Using the http module
  https.get('https://umassdining.com/locations-menus/berkshire/menu', (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      let result = getScrapeDishes(data, "berk");
      res.send(result);
    });
  });
});

app.get('/account', (req,res)=>{
  if(req.isAuthenticated){
    res.send({"account":account});
  }
});
// Private data
app.get('/home',
	checkLoggedIn, // If we are logged in (notice the comma!)...
	(req, res) => {             // Go to the user's page.
      account = req.user;
	    res.redirect('/' + req.user);
	});

// newLogin stuff
// Handle post data from the login.html form.
app.post('/login',
	 passport.authenticate('local' , {     // use username/password authentication
	     'successRedirect' : '/home',   // when we login, go to /private 
	     'failureRedirect' : '/login'      // otherwise, back to login
	 }));

// Handle the URL /login (just output the login.html file).
app.get('/login',
	(req, res) => res.sendFile('public/login.html',
				   { 'root' : __dirname }));

// Handle logging out (takes us back to the login page).
app.get('/logout', function(req, res, next) {
	req.logout(function(err) {
		if (err) { return next(err); }
    account = "guest";
		res.redirect('/');
	});
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
	(req, res) => res.sendFile('public/register.html',
				   { 'root' : __dirname }));
app.get('/:userID',checkLoggedIn,
(req, res) => {
	    if (req.params.userID === req.user) {
        res.sendFile('public/index.html',
              { 'root' : __dirname })
      }else{
        res.redirect('/');
      }
    });
app.get('/',checkLoggedIn,
    (req, res) => {
      res.redirect('/login');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})