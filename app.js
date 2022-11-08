const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/images'))


let food = [{
  id: 1,
  title: 'sushi',
  place: 'worchester'
}];


app.get('/api/food', (req, res) => {
  res.send(food);
})



// app.put('/user', (req, res) => {
//     res.send('Got a PUT request at /user')
//   })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})