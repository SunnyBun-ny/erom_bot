const router = require('express').Router();

function isAuthorised(req, res, next) {
    req.user ? next() : res.redirect('/');
}
router.use('/', isAuthorised, (req, res) => {
    res.send(200);
})
module.exports = router;