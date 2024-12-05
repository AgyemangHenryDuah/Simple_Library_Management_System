const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getDashboard);
router.post('/books', adminController.addBook);
router.put('/books/:id', adminController.updateBook);
router.delete('/books/:id', adminController.deleteBook);

module.exports = router;