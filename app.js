const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/images'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.put('/user', (req, res) => {
//     res.send('Got a PUT request at /user')
//   })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})