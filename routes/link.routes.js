const { Router } = require('express');
const config = require('config');
const shortId = require('shortid');
const Link = require('../models/Link');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const baseURL = config.get('baseURL');
    const { from } = req.body;

    const code = shortId.generate();

    const link = await Link.findOne({ from });

    if (link) {
      return res.json({ link });
    }

    const to = `${baseURL}/t/${code}`;

    const newLink = new Link({
      code,
      to,
      from,
      owner: req.user.userId
    });

    await newLink.save();

    res.status(201).json({
      link: newLink,
      message: 'Link successfully created'
    })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;