import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import techFundings from './data/tech_fundings.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/livesession-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const User = mongoose.model('User', {
  name: String,
  age: Number,
})

const newUser = new User({
  name: 'Jennie',
  age: 35,
})

const newUser2 = new User({
  name: 'Marie',
  age: 30,
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await User.deleteMany({})

    newUser.save()
    newUser2.save()
  }

  seedDatabase()
}

// This is our first endpoint
app.get('/', (req, res) => {
  res.send('Hello from us!')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} YAY YAY`)
})
