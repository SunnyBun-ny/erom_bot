const DiscordStrategy = require('passport-discord').Strategy;
const DiscordUser = require('../models/DiscordUser');
const passport = require('passport');
const axios = require('axios');
const { logger } = require('../utils/logger');

const scopes = ['identify', 'guilds', 'email'];


passport.serializeUser((user, done) => {
    logger.debug('Serializing user', { discordId: user.discordId });
    done(null, user.discordId);
});

passport.deserializeUser(async (id, done) => {
    logger.debug('Deserializing user', { discordId: id });
    try {
        const user = await DiscordUser.findOne({ discordId: id });
        if (user) {
            logger.info('User found during deserialization', { discordId: id });
        } else {
            logger.warn('User not found during deserialization', { discordId: id });
        }
        done(null, user);
    } catch (err) {
        logger.error('Error during deserialization', { error: err });
        done(err, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: scopes
}, async (access_token, refresh_token, profile, done) => {
    try {
        logger.debug('Processing Discord OAuth callback', { profile: profile });
        let user = await DiscordUser.findOne({ discordId: profile.id });

        if (user) {
            logger.info('User found during OAuth callback', { discordId: profile.id });
            user.accessToken = access_token;
            user.refreshToken = refresh_token;
            await user.save();
            logger.debug('User tokens updated', { discordId: profile.id });
            return done(null, user);
        } else {
            logger.info('New user detected during OAuth callback', { discordId: profile.id });
            user = new DiscordUser({
                discordId: profile.id,
                username: profile.username,
                accessToken: access_token,
                refreshToken: refresh_token
            });
            await user.save();
            logger.debug('New user created and saved', { discordId: profile.id });
            return done(null, user);
        }
    } catch (err) {
        logger.error('Error during OAuth callback', { error: err });
        return done(err, null);
    }
}));

async function refreshAccessToken(user) {
    logger.debug('Refreshing access token', { discordId: user.discordId });
    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: user.refreshToken,
            redirect_uri: process.env.BACKEND_REDIRECT_URI,
            scope: scopes.join(' ')
        }).toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        user.accessToken = response.data.access_token;
        user.refreshToken = response.data.refresh_token;
        await user.save();

        logger.info('Access token refreshed successfully', { discordId: user.discordId });
        return user.accessToken;
    } catch (error) {
        logger.error('Error refreshing access token', { error });
        throw new Error('Failed to refresh access token');
    }
}

module.exports = {
    refreshAccessToken
};
