const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const userRouter = require('./Routes/user.routes');
const testRouter = require('./Routes/test.routes');
const testimonialRouter = require('./Routes/testimonial.routes');
const questionRouter = require('./Routes/question.routes');
const connectToDatabase = require('./db');
const cors = require('cors');

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
}));

// Parse JSON requests
app.use(express.json());
app.use(cookieParser());

const port = 5000;

// Connect to MongoDB
connectToDatabase('mongodb+srv://karnrahul2001:EIh7rfxcU1r8zzuX@cluster0.qb1i5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Add a test route to verify API is working
app.get('/', (req, res) => {
  res.json({ message: 'API is working' });
});

// Use the user router
app.use('/api/user', userRouter);

// Use the test router
app.use('/api/tests', testRouter);

// Use the testimonial router
app.use('/api/testimonials', testimonialRouter);

//Use the question router
app.use('/api/questions', questionRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Internal server error:', err);
  res.status(500).json({ msg: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
