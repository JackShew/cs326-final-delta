const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());

require('dotenv').config();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/GrubGauge');
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/images'))

app.post('/dish', (req, res) => {
  const dish = req.body;

  // Output the book to the console for debugging
  console.log(dish);
  worchester.push(dish);

  res.send(worchester);
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