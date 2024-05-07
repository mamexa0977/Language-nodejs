const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const userauth = require('./user file/userauth');
const admin = require('./admin file/admin');
const feedbacks = require('./user file/feedback');
const teachers = require('./teacher/techerauth');
const cors = require('cors')
const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect('mongodb+srv://mamex:jaksonfafa@cluster0.z65xuf6.mongodb.net/languagelearning?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3040, () => {
      console.log('Server is running on port 3040');
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/user', userauth);
app.use('/admin', admin);
app.use('/teachers', teachers);
app.use('/feedback', feedbacks); 

// Start the serv  er
const port = 3000;
const ip = '192.168.211.125'; // Replace with your local IP address
app.listen(port, ip, () => {                                
  console.log(`Server is running at http://${ip}:${port}`);
}); 