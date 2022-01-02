import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import books from './data/books.json'

const port = process.env.PORT || 8080
const app = express()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/livesession-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise
//adding any fun comment
// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
})


if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    books.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

//getting all the books
app.get('/books', async (req, res) => {
  console.log(req.query)
  const books = await Book.find({})
  res.json(books)
})

//get only one book based on id
app.get('/books/:id', async (req, res) => {
  const bookById = await  Book.findById(req.params.id)
  if (bookById) {
    res.json(bookById)
  } else {
    res.status(404).json({error: "Book not found"})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
