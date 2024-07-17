const router = require('express').Router();
const passport = require('passport');
const { refreshAccessToken } = require('../strategies/discordStrategy');
const DiscordUser = require('../models/DiscordUser');
const { logger } = require('../utils/logger');

const headers = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001'); // Adjust this to your frontend origin
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
};
router.get('/', headers, passport.authenticate('discord'));

router.get('/redirect', headers, passport.authenticate('discord', {
    failureRedirect: '/forbidden',
}), (req, res) => {
    logger.info('Authentication successful', {
        userId: req.user ? req.user.discordId : 'unknown',
        redirectUrl: 'http://localhost:3001/dashboard'
    });
    res.redirect('http://localhost:3001/dashboard');
});

//
router.get('/refresh', headers, async (req, res) => {
    logger.debug('Refresh token endpoint accessed', {
        userId: req.user ? req.user.discordId : 'unknown'
    });

    if (!req.isAuthenticated() || !req.user) {
        logger.info('Access token Failed - Unauthorised user');
        return res.status(401).json({ error: 'Unauthorized' });
    }


    try {
        const user = await DiscordUser.findOne({ discordId: req.user.discordId });
        if (user) {
            const newAccessToken = await refreshAccessToken(user);
            logger.info('Access token refreshed', { userId: user.discordId });
            res.status(200).json({ accessToken: newAccessToken });
        } else {
            logger.warn('User not found for refresh token', { userId: req.user.discordId });
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        logger.error('Failed to refresh token', { error });
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});


// Logout route
router.post('/logout', (req, res) => {
    logger.info('Logout request', { userId: req.user ? req.user.discordId : 'unknown' });
    req.logout((err) => {
        if (err) {
            logger.error('Logout error', { error: err });
            return res.status(500).send('Failed to logout.');
        }
        req.session.destroy((err) => {
            if (err) {
                logger.error('Session destruction error during logout', { error: err });
                return res.status(500).send('Failed to logout.');
            }
            res.clearCookie('connect.sid', { path: '/' });
            logger.info('User logged out', { userId: req.user ? req.user.discordId : 'unknown' });
            res.status(200).send('Logged out');
        });
    });
});

module.exports = router;
