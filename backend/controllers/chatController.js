import Message from '../models/Message.js';
import Booking from '../models/Booking.js';
import mongoose from 'mongoose';
import axios from 'axios';

export const getMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const messages = await Message.find({ booking: bookingId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { bookingId, receiverId, text } = req.body;
    
    // Safety checks
    if (!bookingId || !receiverId || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      console.error('Invalid ID format received:', { bookingId, receiverId });
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // 1. Save original message
    const message = await Message.create({
      booking: bookingId,
      sender: req.user._id,
      receiver: receiverId,
      text
    });

    const io = req.app.get('io');
    
    // 2. Emit to receiver
    if (io) {
      io.to(receiverId.toString()).emit('receive_message', {
        bookingId,
        senderId: req.user._id,
        text,
        createdAt: message.createdAt
      });
    }

    // 3. AI AUTO-REPLY LOGIC (If user sends to worker)
    const booking = await Booking.findById(bookingId).populate('worker user');
    const isUserToWorker = req.user.role === 'user';

    if (isUserToWorker && booking && booking.worker) {
      const lowerText = text.toLowerCase();
      const isAskingLocation = lowerText.includes('where') || lowerText.includes('location') || lowerText.includes('reached');
      const isAskingTime = lowerText.includes('time') || lowerText.includes('when') || lowerText.includes('long');

      if (isAskingLocation || isAskingTime) {
        // Trigger Groq AI for smart response
        try {
          const aiResponse = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              model: "llama-3.1-8b-instant",
              messages: [
                {
                  role: "system",
                  content: `You are the professional service worker for ServAI. 
                  The customer asked: "${text}". 
                  Context: 
                  - Your current location: Sector 5, near the main market (1.2km from customer).
                  - Estimated arrival: 10 minutes.
                  Reply professionally as the worker. Say you're nearby and will reach in 10 mins.`
                },
                { role: "user", content: text }
              ]
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
              },
              timeout: 5000 // 5s timeout for AI
            }
          );

          const aiText = aiResponse.data.choices[0].message.content;

          // Save AI reply
          const aiMessage = await Message.create({
            booking: bookingId,
            sender: receiverId,
            receiver: req.user._id,
            text: aiText
          });

          // Emit AI reply
          if (io) {
            io.to(req.user._id.toString()).emit('receive_message', {
              bookingId,
              senderId: receiverId,
              text: aiText,
              createdAt: aiMessage.createdAt,
              isAI: true
            });
          }
        } catch (aiErr) {
          console.error('AI Auto-reply failed:', aiErr.message);
        }
      }
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message 500 error:', error);
    res.status(500).json({ message: error.message });
  }
};
