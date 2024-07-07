const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    
    obj = {
        a : 'Hello World',
        number : '18'
    }

    res.json( obj);
})

module.exports = router;
