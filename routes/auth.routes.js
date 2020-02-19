const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = Router();

// /api/auth

const authValidator = [
  check('email', 'Email is incorrect').isEmail(),
  check('password', 'Password should not be empty').isEmpty(),
  check('password', 'Password length should be 6 characters or more')
    .isLength({ min: 6 })
];

async function registerHandler(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect registration data'
      })
    }

    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: `User ${email} already exist!` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'User has been successfully registered!' });

  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

async function loginHandler(req, res) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect login data'
      })
    }

    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: `User ${email} already exist!` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: 'User has been successfully registered!' });

  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

// /api/auth/register
router.post('/register', authValidator, registerHandler);

// /api/auth/login
router.post('/login', authValidator, loginHandler);

module.exports = router;