// controllers/userController.js
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Secret key for JWT (store in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Register new user

export const registerUser = async (req, res) => {
    try {
        let { name, email, password, isAdmin } = req.body;

        // Generate UUID first
        const userUUID = uuidv4();

        // Fallback dummy values if not provided
        if (!name) name = `User-${userUUID.slice(0, 8)}`;
        if (!email) email = `user-${userUUID}@dummy.com`;
        if (!password) password = 'default-password';

        // Check if user with same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

        // Hash the (real or default) password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            uuid: userUUID,
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false,
        });

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: { uuid: newUser.uuid, name: newUser.name, email: newUser.email } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ uuid: user.uuid, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get user by UUID
export const getUserByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const user = await User.findOne({ uuid }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, email, password, isAdmin } = req.body;

        const user = await User.findOne({ uuid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = name || user.name;
        user.email = email || user.email;
        user.isAdmin = typeof isAdmin === 'boolean' ? isAdmin : user.isAdmin;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        const user = await User.findOneAndDelete({ uuid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
