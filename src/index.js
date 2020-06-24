require('./models/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');


const app = express();
app.use(bodyParser.json());
app.use(authRoutes);

const mongoUri = 'mongodb+srv://prodUser:dbREoWqACBDmRt6s@cluster0-sxm5l.mongodb.net/<dbname>?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance')
})

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err);
})

app.get('/', requireAuth, (req, res) => {
  res.send(`Your data: ${req.user}`);
});

app.listen(3000, () => {
  console.log('listening on port 3000')
})