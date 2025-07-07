const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otpRoutes');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/users', userRoutes);
app.use('/otp', otpRoutes);

app.get('/', (req, res) => {
  res.send("API is running");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
