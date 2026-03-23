require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const petRoutes = require('./routes/pet');
const hospitalRoutes = require('./routes/hospital');
const postRoutes = require('./routes/post');
const questionRoutes = require('./routes/question');
const reminderRoutes = require('./routes/reminder');
const notificationRoutes = require('./routes/notification');
const consultationRoutes = require('./routes/consultation');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/consultation', consultationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;