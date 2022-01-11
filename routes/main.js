require('dotenv').config();

const express = require('express');
const router = express.Router();

//Login page
router.get('/', (req, res) => {
  try {
    if (!req.session.loggedin) {
      res.status(200).sendFile('index.html', { root: './public' });
    } else {
      res.status(307).sendFile('home.html', { root: './public/pages' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Home page
router.get('/home', (req, res) => {
  try {
    if (req.session.loggedin === true) {
      res.status(200).sendFile('home.html', { root: './public/pages' });
    } else {
      res.status(401).sendFile('index.html', { root: './public' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
