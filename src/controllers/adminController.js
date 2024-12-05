const asyncHandler = require('express-async-handler');
const Admin = require('../models/adminModel');

exports.getDashboard = asyncHandler(async (req, res) => {
  const books = await Admin.getAllBooks();
  const categories = await Admin.getCategories();
  const authors = await Admin.getAuthors();
  res.render('admin/dashboard', { books, categories, authors });
});

exports.addBook = asyncHandler(async (req, res) => {
  const { title, categoryId, publicationDate, copiesOwned, authorIds } = req.body;
  await Admin.addBook(title, categoryId, publicationDate, copiesOwned, Array.isArray(authorIds) ? authorIds : [authorIds]);
  res.redirect('/admin');
});

exports.updateBook = asyncHandler(async (req, res) => {
  const { title, categoryId, publicationDate, copiesOwned, authorIds } = req.body;
  const bookId = req.params.id
  await Admin.updateBook(bookId, title, categoryId, publicationDate, copiesOwned, Array.isArray(authorIds) ? authorIds : [authorIds]);
  res.redirect('/admin');
});

exports.deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Admin.deleteBook(id);
  res.redirect('/admin');
});