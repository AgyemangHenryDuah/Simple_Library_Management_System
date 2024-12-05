const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/', loanController.createLoan);
router.get('/:memberId', loanController.getMemberLoans);

module.exports = router;