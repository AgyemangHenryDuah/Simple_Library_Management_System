const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const bookRoutes = require('./routes/bookRoutes')
const loanRoutes = require('./routes/loanRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Routes
app.use('/books', bookRoutes)
app.use('/loans', loanRoutes)
app.use('/admin', adminRoutes)


// Redirect root to books
app.get('/', (req, res) => {
  res.redirect('/books')
})


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render('error', { message: 'Something went wrong!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})