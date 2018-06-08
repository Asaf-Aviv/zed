const express    = require('express');
const router     = express.Router();


router.get('/', (req, res) => {
    res.render('forgot', {
        title: 'Forgot Password | Zed'
    });
});

module.exports = router;