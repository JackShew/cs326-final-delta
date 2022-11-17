const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
const {MongoClient} = require("mongodb");
const uri = process.env.MONGODB_URI; 
// Causes error

// require('dotenv').config();
// var mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/GrubGauge');
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/images'))

app.post('/postDish', async function(req, res) {
  console.log(req.query);
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  // const {title, description, location, image} = req.body;
  console.log(req.body);
  try {
    await client.connect();
    const database = client.db('GrubGaugeData');
    const collection = database.collection('Posts');
    const p = await collection.insertOne(req.body);
    const myDoc = await collection.findOne();
    console.log(myDoc);
  }catch(err){
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
  //await mongo.createDish(title, description, location, image);
  // Output the book to the console for debugging
  //worchester.push(dish);
  //res.send(worchester);
  res.status(200).json({ status: 'success'});
});

app.get('/mongo', async function(req,res) {
  // res.send('Hello World, from express');
  // console.log("fdjhisfy");
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    await client.connect();

    const database = client.db('sample_mflix');
    const collection = database.collection('movies');

    // Query for a movie that has the title 'Back to the Future'
    const query = { genres: "Comedy", poster: { $exists: true } };
    const cursor = await collection.aggregate([
      { $match: query },
      { $sample: { size: 1 } },
      { $project: 
        {
          title: 1,
          fullplot: 1,
          poster: 1
        }
      }
    ]);

    const movie = await cursor.next();

    return res.json(movie);
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

let worchester = [
  {
    title: 'sushi',
    description: 'Loris Impsum',
    image: '/public/images/sushi.png',
    upvotes: 100,
    comments: 4
  },
  {
    title: 'stirfry',
    description: 'Loris Impsum',
    image: '/public/images/stirFry.webp',
    upvotes: 19,
    comments: 1
  }
];




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