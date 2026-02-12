const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const authRoutes = require('./controllers/auth')
const userRoutes = require('./controllers/user');
const hootRoutes = require('./routes/hoot.routes')
const verifyToken = require('./middleware/verify-token');
const PORT = process.env.PORT || 3000

require('./db/connection')
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/auth', authRoutes)
app.use('/users', userRoutes)

// Any routes below this would require AUTH
app.use(verifyToken) 
app.use('/hoots', hootRoutes)

app.listen(PORT, () => {
  console.log('The express app is ready!', PORT);
});


// Model View == (React) Controller, optional "R" stands routes
// MVC*R

