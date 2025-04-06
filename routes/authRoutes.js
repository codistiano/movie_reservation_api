import { Router } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
const router = Router();

// Sign-up route
router.post('/signup', async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ name, email, password });
        await newUser.save();

        const token = sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // res.status(201).json({ message: 'User created', token });
        res.status(201).json({ message: 'User created', name, email, password });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ Error: 'Username or password is incorrect' });
    }
});

export default router;