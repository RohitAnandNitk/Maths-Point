const User = require('../Models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret_key = "$uperman1235";
const crypto = require('crypto');
const nodemailer = require('nodemailer');

async function handleSignIn(req, res) {
    try {
        const { email, password, role } = req.body;
        console.log("Login attempt:", { email, role });
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide both email and password' 
            });
        }

        // Ensure role is one of the allowed values
        const validRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student';

        const user = await User.findOne({ 
            email: email.toLowerCase(),
            role: validRole
        });
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: `No ${validRole} account found with this email` 
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Create JWT token with 2 months expiry
        const token = jwt.sign(
            { 
                id: user._id, 
                fullname: user.fullname, 
                email: user.email, 
                role: user.role 
            },
            secret_key,
            { expiresIn: '60d' } // 60 days
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: false,
            maxAge: 60 * 24 * 60 * 60 * 1000, // 60 days in milliseconds
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ 
            success: true,
            message: `${user.fullname} signed in successfully`,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error in sign-in:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error', 
            error: error.message 
        });
    }
}

async function handleSignUp(req, res) {
    try {
        const { fullname, email, password, role } = req.body;
        console.log("Sign up attempt:", { fullname, email, role });

        if (!fullname || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide fullname, email and password' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: 'User with this email already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Validate role
        const validRole = ['student', 'teacher', 'admin'].includes(role) ? role : 'student';

        // Create new user
        const newUser = new User({
            fullname,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: validRole
        });

        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { 
                id: newUser._id, 
                fullname: newUser.fullname, 
                email: newUser.email, 
                role: newUser.role 
            },
            secret_key,
            { expiresIn: '60d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: false,
            maxAge: 60 * 24 * 60 * 60 * 1000,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(201).json({ 
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error in sign-up:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error', 
            error: error.message 
        });
    }
}

async function handleUpdateProfile(req, res) {
    try {
        const { fullname, email, currentPassword, newPassword } = req.body;
        const userId = req.user.id; // Assuming you have user data in req from auth middleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update basic info
        if (fullname) user.fullname = fullname;
        if (email) user.email = email.toLowerCase();

        // Update password if provided
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
}

async function handleLogout(req, res) {
    try {
        // Clear the token cookie
        res.cookie('token', '', {
            httpOnly: false,
            expires: new Date(0),
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during logout',
            error: error.message
        });
    }
}

async function checkAuth(req, res) {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.json({ isAuthenticated: false });
        }

        // Verify token
        const decoded = jwt.verify(token, secret_key);
        
        if (!decoded) {
            return res.json({ isAuthenticated: false });
        }

        // Check if user still exists in database
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.json({ isAuthenticated: false });
        }

        // Return user data
        res.json({
            isAuthenticated: true,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        res.json({ isAuthenticated: false });
    }
}

module.exports = {
    handleSignIn,
    handleSignUp,
    handleLogout,
    checkAuth,
    handleUpdateProfile
};
