const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const verifyAdmin = require('../middleware/auth');


router.post('/', verifyAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ url: req.file.path });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
