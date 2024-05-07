const bcrypt = require('bcrypt');
const express = require('express');
const Teacher = require('./teacherschema');
const jwt = require('jsonwebtoken');
const SecretKey = require('../admin file/secretschema');

const router = express.Router()

const JWT_SECRET_KEY = 'your-secret-key';

// Function to create a JWT token
function createToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
}
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Teacher.findOne({ username });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = createToken(user);
        res.status(200).json({ message: 'Login successful', token, user });
      } else {
        res.status(401).json({ message: 'Password incorrect' });
      }
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
});

router.post('/register', async (req, res) => {
  
    try {
    const { username, password, userKey, language, imageurl } = req.body;

      console.log('signing up')
        const secretKey = await SecretKey.findOne({ key: userKey });
        console.log(secretKey)
        if (!secretKey) {
          return res.status(403).json({ error: 'Invalid secret key' });
        }
        console.log(secretKey)
        // Continue with user registration
        const hashedPassword = await bcrypt.hash(password, 10);
        const registrationDate = new Date();
        console.log('registering');
        const user = await Teacher.create({ username, password: hashedPassword,  registrationDate, language, imageurl });
        console.log('registered');
        res.status(201).json({ message: 'User registered successfully', user});
      } catch (error) {
        // Handle errors
      }
      
    // Verify the secret key
   
  });

  router.get('/registration-chart-data', async (req, res) => {
    console.log("teacher chart getting")
    try {
      const result = await Teacher.aggregate([
        {
          $match: {
            registrationDate: {
              $gte: new Date('2023-10-15T00:00:00.000Z'), // Start date
              $lte: new Date(), // Current date
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$registrationDate' },
              month: { $month: '$registrationDate' },
              day: { $dayOfMonth: '$registrationDate' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: {
                  $dateFromParts: {
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day'
                  }
                }
              }
            },
            count: 1
          }
        },
        {
          $sort: {
            date: 1
          }
        }
      ]);
      console.log("teacher chart success")
  
      res.status(200).json(result);
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: 'Server error' });
      console.log("teacher chart error"+ error)
    }
  });

  
  router.get('/getteacher', async (req, res) => {
    try {
      const teacheris = await Teacher.getAllUsers();
      res.status(200).json(teacheris);
      console.log('User data retrieved successfully');
    } catch (error) {
      console.error('Error while retrieving user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  
  module.exports = router;