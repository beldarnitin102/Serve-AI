import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Worker from '../models/Worker.js';
import { sendOTP } from '../services/emailService.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'user', address } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      address,
      isVerified: true // Set to true by default for now
    });

    await user.save();

    let workerProfile = null;

    if (role === 'worker') {
      workerProfile = await Worker.create({
        user: user._id,
        services: req.body.services || [],
        hourlyRate: req.body.hourlyRate || 250,
        currentLocation: req.body.currentLocation || {},
        profileMedia: {},
        verification: {
          isVerified: false,
          trustRating: 0,
          score: 0,
          badge: 'Bronze'
        },
        trustFactors: {
          punctuality: 3,
          ratings: 4,
          cancellations: 0,
          complaints: 0,
          verificationQuality: 4,
          customerSentiment: 4
        }
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        worker: workerProfile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp.code !== otp || user.otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    let workerProfile = null;
    if (user.role === 'worker') {
      workerProfile = await Worker.findOne({ user: user._id });
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        worker: workerProfile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.toObject();

    if (user.role === 'worker') {
      const worker = await Worker.findOne({ user: user._id });
      if (worker) {
        profile.worker = worker;
      }
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update here

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};