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

const Company = mongoose.model('Company', {
  index: Number,
  company: String,
  website: String,
  region: String,
  vertical: String,
  fundingAmountUSD: Number,
  fundingStage: String,
  fundingDate: String,
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Company.deleteMany({})

    techFundings.forEach(item => {
      const newCompany = new Company(item)
      newCompany.save()
    })
  }

  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Our own middleware that checks if the database is connected before going forward to our endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// This is our first endpoint
app.get('/', (req, res) => {
  res.send('Hello from us!')
})

// get all the companies
app.get('/companies', async (req, res) => {
  console.log(req.query)
  let companies = await Company.find(req.query)

  // if we want to filter the list where funding amount is greater than whatever query value we get in, we need to specify that separately
  if (req.query.fundingAmountUSD) {
    const comapniesByAmount = await Company.find().gt(
      'fundingAmountUSD',
      req.query.fundingAmountUSD
    )
    companies = comapniesByAmount
  }

  res.json(companies)
})

// get one company based on id
app.get('/companies/id/:id', async (req, res) => {
  try {
    const companyById = await Company.findById(req.params.id)
    if (companyById) {
      res.json(companyById)
    } else {
      res.status(404).json({ error: 'Company not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Id is invalid' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} YAY YAY`)
})
