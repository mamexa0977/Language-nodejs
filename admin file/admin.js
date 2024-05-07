const express = require('express');
const bodyParser = require('body-parser');
const Teacher = require('../teacher/teacherschema');

const router = express.Router();
router.use(bodyParser.json());
// Example of changing the secret key via an API endpoint

const SecretKey = require('./secretschema');

// POST request to change the secret key
router.post('/change-secret-key', async (req, res) => {
  const {newKey} = req.body;
  console.log("admin changing password")

  // Check if 'newKey' is missing or undefined
  if (!newKey) {
    return res.status(400).json({ error: 'The "newKey" field is required' });
  }

  // Update the secret key in the database
  try {
    await SecretKey.deleteMany(); // Delete all existing keys
    const secretKey = new SecretKey({ key: newKey });
    await secretKey.save(); // Save the new key
    res.status(200).json({ message: 'Secret key changed successfully' });
  } catch (error) {
    console.error('Error changing the secret key:', error);
    res.status(500).json({ error: 'Error changing the secret key' });
  }
});




router.post('/login', (req, res) => {
    console.log("admin login reached")
  const { email, password } = req.body;

  // Check if the provided email and password match the admin credentials
  if (email === "ab@gmail.com" && password === "12345") {
    res.status(200).json({ message: 'Admin login successful' });
    console.log("successfully admin login")
  } else {
    res.status(401).json({ message: 'Admin login failed' });
    console.log("failed to login admin")
  }
});
// POST request for user registration
router.get('/getteacher', async(req, res)=>{

 
  try {
    const list = await  Teacher.find().select('username _id').exec();
    res.status(201).json(list)
    console.log(list)
  } catch (error) {
    res.status(401).json(error)
  }
  
  

})


module.exports = router;
