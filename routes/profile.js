const express    = require('express');
const router     = express.Router();
const moment     = require('moment');
const Legend     = require('../models/user');
const auth       = require('../middlewares/auth');
const uploadcare = require('uploadcare')(process.env.UPLOADCARE_PUB_KEY, process.env.UPLOADCARE_PR_KEY);

console.log(process.env.UPLOADCARE_PUB_KEY);
console.log(process.env.UPLOADCARE_PR_KEY);



router.get('/', auth.isLogged(), (req, res) => {
    res.render('profile', {
        title: `${req.user.username} | Legends`
    });
});

router.get('/messages', auth.isLogged(), (req, res) => {
    res.render('messages', {
        title: `${req.user.username} messages | Legends`
    });
});

router.get('/friends', auth.isLogged(), (req, res) => {
    Legend.find({ _id: req.user._id }, {friends: 1, _id: 0}).then(user => {
        console.log(user[0].friends)
    });
    res.render('friends', {
        title: `Friends | Legends`
    });
});

router.get('/images', auth.isLogged(), (req, res) => {
    res.render('images', {
        title: `${req.user.username} Images | Legends`
    });
});

router.delete('/image/:id', (req, res) => {
    Legend.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { images: { _id: req.params.id }},
            remove: true, new: false
        },
        (err, doc) => {
            if (err) return res.status(500).send();
            res.status(200).send();
            uploadcare.files.remove(req.body.uuid, (err, data) => {
                if (err) console.log(err);
            });
        }
    );
});


router.get('/info', auth.isLogged(), (req, res) => {
    res.render('info', {
        title: `${req.user.username} Info | Legends`
    });
});

router.post('/info', auth.isLogged(), (req, res) => {
    console.log(req.body);
    if (req.body.day && req.body.month && req.body.year) {
        req.body.birthday = req.body.day+'-'+req.body.month+'-'+req.body.year;
    }
    Legend.findByIdAndUpdate(
        req.user._id,
        {
            $set: { info: { ...req.body }}
        },
        (err, doc) => {
            if(err) console.log(err);
            res.send();
        }
    );
});

module.exports = router;