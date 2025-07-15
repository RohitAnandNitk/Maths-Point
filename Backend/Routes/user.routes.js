const express = require('express');
const router = express.Router();
const {handleSignIn, handleSignUp, handleLogout, checkAuth} = require('../Controllers/user.controller'); 
const User = require('../Models/user');


router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, msg: 'No users found' });
        }

        res.status(200).json({users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
});


router.post('/login', handleSignIn);

router.post('/signup' , handleSignUp);



router.post('/logout', handleLogout);

router.get('/check-auth', checkAuth);

module.exports = router;