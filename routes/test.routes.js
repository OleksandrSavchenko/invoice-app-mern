const { Router } = require('express');
const Test = require('../models/Test');
const router = Router();


router.get('/', async (req, res) => {
  try {
    const testData = await Test.find();
    res.json(testData);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});


module.exports = router;