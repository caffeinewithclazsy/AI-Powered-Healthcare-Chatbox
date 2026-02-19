const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load .env file with explicit path
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('PORT from env:', process.env.PORT); // Debug log
console.log('__dirname:', __dirname); // Debug log

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Final PORT value:', PORT); // Debug log

// Middleware
app.use(cors());
app.use(express.json());

// Safety middleware
const safetyMiddleware = require('./middleware/safetyMiddleware');
app.use('/api/chat', safetyMiddleware);

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});