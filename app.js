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
const minicrypt = require('./miniCrypt');
const mc = new minicrypt(); 
//const uri = process.env.MONGODB_URI; 
//console.log(uri);// Causes error

let secrets;
let uri;
if (!process.env.MONGODB_URI) {
  secrets = require('secrets.json');
  uri = secrets.MONGODB_URI;
} else {
	uri = process.env.MONGODB_URI;
}
// const uri = process.env.MONGODB_URI;
// console.log(uri);

// require('dotenv').config();
// var mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/GrubGauge');
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))
//app.use(express.static(__dirname + '/images'))
app.use('/uploads', express.static('uploads'));

// var storage = multer.diskStorage({
//   destination: '/uploads',
//   filename: function (req, file, cb) {
//     cb(null, file.originalname)
//   }
// })
// const upload = multer({ storage: storage })
// , upload.single("imageUpload")
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
});

app.get('/comments.html', function(req,res){
  res.render("./comments.html");
})

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
  console.log(address);
  console.log(password);
  try{
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    // console.log(collection);
    const user = await collection.findOne({"address": address});
    console.log(user);
    // if(user){

    if(mc.check(password, user.password[0], user.password[1])){
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
  const data = {"address":address, "password":mc.hash(password)};
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