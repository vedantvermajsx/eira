const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Piece = require('../models/Piece');
const { sendEmail } = require('../services/emailService');
const verifyAdmin = require('../middleware/auth');


router.get('/', verifyAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { userName, userEmail, userPhone, pieceId, pieceName, url } = req.body;
    
    const booking = new Booking({
      userName,
      userEmail,
      userPhone,
      pieceId,
      pieceName,
      url,
      timestamp: new Date()
    });
    await booking.save();

    if (userEmail) {
      const bookingDate = new Date();
      let piecePrice = 'Contact for Price';
      
      try {
        const piece = await Piece.findById(pieceId);
        if (piece) piecePrice = piece.price;
      } catch (err) {
        console.error('[MailSender] Could not fetch piece details for price:', err);
      }

      const emailResult = await sendEmail({
        customer_name: userName,
        item_name: pieceName,
        item_price: piecePrice,
        booking_date: bookingDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        booking_time: bookingDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        item_link: url,
        email: userEmail
      });

      if (!emailResult || !emailResult.success) {
        console.error('[MailSender] Email delivery failed:', emailResult?.error);
        return res.status(201).json({ 
          id: booking._id,
          userName,
          userEmail,
          userPhone,
          pieceId,
          pieceName,
          url,
          status: booking.status,
          timestamp: booking.timestamp,
          emailError: emailResult?.error || 'Unknown email error' 
        });
      }
    }
    
    res.status(201).json(booking);
  } catch (err) {
    console.error('[Booking Error] Failed to create booking:', err);
    res.status(400).json({ error: err.message });
  }
});


router.patch('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { 
      status, 
      updatedAt: new Date() 
    }, { new: true });

    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
