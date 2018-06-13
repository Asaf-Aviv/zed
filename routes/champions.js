const express = require('express');
const router  = express.Router();
const zed     = require('../util/zed');

router.get('/', (req, res) => {
    zed.getChampionsIdsAndNames().then(champs => {
        champs = Object.values(champs).sort()
        res.render('champions', {
            title: 'Champions | Legends',
            champs,
        });
    });
});

router.get('/:champName', async (req, res) => {
    const champ = await zed.getStaticChampStats(req.params.champName);
    res.render('champion', {
        title: `${champ.name} | Zed`,
        champ,
    });
});

module.exports = router;