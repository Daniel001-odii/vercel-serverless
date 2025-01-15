const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const serverless = require("serverless-http");
const router = express.Router();


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // For static files
app.set('view engine', 'ejs');

app.use("/.netlify/functions/app", router);


// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.3rg9h4v.mongodb.net/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  age: Number,
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', async (req, res) => {
  const users = await User.find({});
  res.render('index', { users });
});

app.post('/add', async (req, res) => {
  const { username, email, age } = req.body;
  const user = new User({ username, email, age });
  await user.save();
  res.redirect('/');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports.handler = serverless(app);