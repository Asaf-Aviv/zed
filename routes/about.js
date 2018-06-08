const express    = require('express');
const router     = express.Router();

router.get('/', (req, res) => {
    res.render('about', {
        title: 'About | Zed'
    });
});

router.get('/terms', (req, res) => {
    res.render('terms', {
        title: 'Terms of Service | Zed'
    });
});

router.get('/privacy', (req, res) => {
    res.render('privacy', {
        title: 'Privacy Policy | Zed'
    });
});

module.exports = router;