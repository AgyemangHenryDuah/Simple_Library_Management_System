const asyncHandler = require('express-async-handler');
const Book = require('../models/bookModel');

exports.getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.getAllAvailable();
  res.render('books/index', { books });
});

exports.getBookDetails = asyncHandler(async (req, res) => {
  const book = await Book.getBookDetails(req.params.id);
  if (!book) {
    res.status(404).render('error', { message: 'Book not found' });
    return;
  }
  res.render('books/details', { book });
});