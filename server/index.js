const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initEmailJS } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();
initEmailJS();


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../dist')));


// --- API Routes ---
app.use('/api/upload', require('./routes/upload'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/bookings', require('./routes/bookings'));



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

