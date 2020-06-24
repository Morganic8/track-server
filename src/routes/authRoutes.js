const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();

    //Generate Token
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    //Send token to user
    res.send({ token })

  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;


  //if no email or password provided
  if (!email || !password) return res.status(422).send({ error: 'Must provide email and password' });

  //send request to mongodb
  const user = await User.findOne({ email });

  //if no user found return error
  if (!user) return res.status(422).send({ error: 'Invalid password or email' });

  //compare passwords - if they are the same, sign and send jwt
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token })
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
})

module.exports = router;