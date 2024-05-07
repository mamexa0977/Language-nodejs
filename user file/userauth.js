// const bcrypt = require('bcrypt');
// const express = require('express');
// const User = require('./user');

// const router = express.Router();

// router.post('/signup', async (req, res) => {
//     console.log("signup reached")
//   const { name, email, password, language } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const registrationDate = new Date();
//     const user = await User.create({ name, email, password: hashedPassword, language, registrationDate});
//     res.status(201).json({ message: 'User registered successfully' });
//     console.log("User registered successfully")
//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(400).json({ message: 'Registration failed' });

//   }
// });

// router.post('/login', async (req, res) => {
//     console.log("signup reached")
//     const { email, password } = req.body;
//     try {
//       const user = await User.findOne({ email });
//       if (user) {
//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (passwordMatch) {
//           res.status(200).json({ message: 'Login successful' });
//           console.log("User registered successfully")
//         } else {
//           res.status(401).json({ message: 'Password incorrect' });
//           console.log('Password incorrect' )
//         }
//       } else {
//         res.status(401).json({ message: 'Authentication failed' });
//         console.log('auth failed' )
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       res.status(401).json({ message: 'Authentication failed' });
//     }
//   });
  
//   router.get('/registration-chart-data', async (req, res) => {
//     console.log("user chart getting")
//     try {
//       const result = await User.aggregate([
//         {
//           $match: {
//             registrationDate: {
//               $gte: new Date('2023-10-15T00:00:00.000Z'), // Start date
//               $lte: new Date(), // Current date
//             }
//           }
//         },
//         {
//           $group: {
//             _id: {
//               year: { $year: '$registrationDate' },
//               month: { $month: '$registrationDate' },
//               day: { $dayOfMonth: '$registrationDate' }
//             },
//             count: { $sum: 1 }
//           }
//         },
//         {
//           $project: {
//             date: {
//               $dateToString: {
//                 format: '%Y-%m-%d',
//                 date: {
//                   $dateFromParts: {
//                     year: '$_id.year',
//                     month: '$_id.month',
//                     day: '$_id.day'
//                   }
//                 }
//               }
//             },
//             count: 1
//           }
//         },
//         {
//           $sort: {
//             date: 1
//           }
//         }
//       ]);
      
  
//       res.status(200).json(result);
//       console.log("user chart success")
//     } catch (error) {
//       // Handle errors
//       res.status(500).json({ error: 'Server error' });
//       console.log("user chart failed")
//     }
//   });
  
//   router.get('/getuser', async (req, res) => {
//     try {
//       const users = await User.getAllUsers();
//       res.status(200).json(users);
//       console.log('User data retrieved successfully');
//     } catch (error) {
//       console.error('Error while retrieving user data:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   });

//   module.exports = router;

const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./user');

const router = express.Router();

// Secret key for JWT
const JWT_SECRET_KEY = 'your-secret-key';

// Function to create a JWT token
function createToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
}

router.post('/signup', async (req, res) => {
  const { name, email, password, language } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const registrationDate = new Date();
    const user = await User.create({ name, email, password: hashedPassword, language, registrationDate });
    const token = createToken(user);
    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
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

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access forbidden' });

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Protected routes
router.get('/registered-language', async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          language: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(result);
    console.log("User chart success");
  } catch (error) {
    console.error('Error during user chart data retrieval:', error);
    res.status(500).json({ error: 'Server error' });
    console.log("User chart failed");
  }
});

router.get('/registration-chart-data', verifyToken, async (req, res) => {
  try {
    
    const result = await User.aggregate([
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
            
        
            res.status(200).json(result);
            console.log("user chart success")
          } catch (error) {
            // Handle errors
            res.status(500).json({ error: 'Server error' });
            console.log("user chart failed")
          }
});

router.get('/getuser', verifyToken, async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.status(200).json(users);
      console.log('User data retrieved successfully');
    } catch (error) {
      console.error('Error while retrieving user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
