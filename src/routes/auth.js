const router = require('express').Router();
const passport = require('passport');

router.get('/', passport.authenticate('discord'));

router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/forbidden',
    successRedirect: '/dashboard'
}));

// Your route for logging out
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err); // Passes the error to the next middleware
        }
        res.redirect('/'); // Redirects to the home page after successful logout
    });
});

module.exports = router;