require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('PostgreSQL database connected');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Blockchain event listener setup
const { setupBlockchainListener } = require('./services/blockchainService');
setupBlockchainListener();
