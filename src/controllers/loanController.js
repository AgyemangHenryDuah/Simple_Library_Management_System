const asyncHandler = require('express-async-handler');
const Loan = require('../models/loanModel');

exports.createLoan = asyncHandler(async (req, res) => {
  const { bookId, memberId } = req.body;
  try {
    await Loan.create(bookId, memberId);
    res.redirect('/loans/' + memberId);
  } catch (error) {
    res.render('error', { message: error.message });
  }
});

exports.getMemberLoans = asyncHandler(async (req, res) => {
  const loans = await Loan.getMemberLoans(req.params.memberId);
  res.render('loans/index', { loans });
});