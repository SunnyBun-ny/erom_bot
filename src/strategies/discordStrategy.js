const DiscordStrategy = require('passport-discord').Strategy;
const DiscordUser = require('../models/DiscordUser');
const passport = require('passport');

var scopes = ['identify', 'guilds', 'email']


passport.serializeUser( (user, done)=> {
    done(null, user.discordId);
});

passport.deserializeUser(async  (id, done) =>{
    try {
        const user = await DiscordUser.findOne({discordId : id});
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: scopes
},
    async (access_token, refresh_token, profile, done) => {
        try {
            let user = await DiscordUser.findOne({
                discordId: profile.id,
            });

            if (user) {
                return done(null, user);
            }
            else {
                user = new DiscordUser({
                    discordId: profile.id,
                    username: profile.username
                });
                await user.save();
                return done(null, user);
            }
        }
        catch (err) {
            console.log(err);
            return done(err, null);
        }
    }))
