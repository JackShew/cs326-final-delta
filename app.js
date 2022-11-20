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
const uri = process.env.MONGODB_URI; 
console.log(uri);// Causes error

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



app.post('/postDish', async function(req, res) {
  console.log(req.query);
  // console.log(req.body);
  console.log("uri" + uri);
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const image = req.body.image;
  const score = req.body.score;
  const comments = req.body.comments;
  const data = {
    "title":title,
    "description":description,
    "location":location,
    "image":image,
    "score":score,
    "comments":comments
  }

  console.log(req.body);
  console.log(data);
  // Data is empty 
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

    let data = [];
    await cursor.forEach((entry) => {data.push(entry)});
    //console.log(data);
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

app.post("/signUp", async function(req,res){
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  const address = res.body.address;
  const password = res.body.password;
  const data = {"address":address, "password":password};
  try{
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Users');
    const p = await collection.insertOne(data);
    const myDoc = await collection.findOne();
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