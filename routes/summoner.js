const express     = require('express');
const router      = express.Router();
const zed         = require('../util/zed');
const championIds = require('../assets/data/champions/championIds');

const dummyMatch = {"gameId":2757253064,"mapId":11,"gameMode":"CLASSIC","gameType":"MATCHED_GAME","gameQueueConfigId":420,"participants":[{"teamId":100,"spell1Id":11,"spell2Id":4,"championId":59,"profileIconId":3382,"summonerName":"Modest Desires","bot":false,"summonerId":44299126,"gameCustomizationObjects":[],"perks":{"perkIds":[8112,8143,8136,8105,9111,9105],"perkStyle":8100,"perkSubStyle":8000}},{"teamId":100,"spell1Id":12,"spell2Id":4,"championId":36,"profileIconId":3233,"summonerName":"johnbonin","bot":false,"summonerId":22740059,"gameCustomizationObjects":[],"perks":{"perkIds":[8010,9111,9104,8299,8444,8453],"perkStyle":8000,"perkSubStyle":8400}},{"teamId":100,"spell1Id":4,"spell2Id":7,"championId":29,"profileIconId":3038,"summonerName":"my name a jefff","bot":false,"summonerId":23589065,"gameCustomizationObjects":[],"perks":{"perkIds":[8005,8009,9104,8014,8233,8236],"perkStyle":8000,"perkSubStyle":8200}},{"teamId":100,"spell1Id":4,"spell2Id":14,"championId":12,"profileIconId":551,"summonerName":"Archyboy","bot":false,"summonerId":18979536,"gameCustomizationObjects":[],"perks":{"perkIds":[8439,8473,8429,8242,8316,8352],"perkStyle":8400,"perkSubStyle":8300}},{"teamId":100,"spell1Id":12,"spell2Id":4,"championId":38,"profileIconId":23,"summonerName":"Ste1veLamZz","bot":false,"summonerId":34561333,"gameCustomizationObjects":[],"perks":{"perkIds":[8229,8243,8234,8237,8473,8472],"perkStyle":8200,"perkSubStyle":8400}},{"teamId":200,"spell1Id":12,"spell2Id":4,"championId":42,"profileIconId":576,"summonerName":"D1RTYPLAYER","bot":false,"summonerId":27212264,"gameCustomizationObjects":[],"perks":{"perkIds":[8021,8009,9104,8014,8234,8236],"perkStyle":8000,"perkSubStyle":8200}},{"teamId":200,"spell1Id":4,"spell2Id":11,"championId":60,"profileIconId":3013,"summonerName":"miséry","bot":false,"summonerId":46002265,"gameCustomizationObjects":[],"perks":{"perkIds":[8112,8126,8136,8134,8347,8313],"perkStyle":8100,"perkSubStyle":8300}},{"teamId":200,"spell1Id":4,"spell2Id":12,"championId":114,"profileIconId":527,"summonerName":"hashinshin","bot":false,"summonerId":349795,"gameCustomizationObjects":[],"perks":{"perkIds":[8010,9111,9105,8299,8453,8429],"perkStyle":8000,"perkSubStyle":8400}},{"teamId":200,"spell1Id":14,"spell2Id":4,"championId":267,"profileIconId":3374,"summonerName":"luxxbunny","bot":false,"summonerId":65721013,"gameCustomizationObjects":[],"perks":{"perkIds":[8214,8226,8233,8237,8345,8347],"perkStyle":8200,"perkSubStyle":8300}},{"teamId":200,"spell1Id":4,"spell2Id":7,"championId":81,"profileIconId":3233,"summonerName":"elandmiler","bot":false,"summonerId":33032173,"gameCustomizationObjects":[],"perks":{"perkIds":[8359,8304,8321,8347,8226,8236],"perkStyle":8300,"perkSubStyle":8200}}],"observers":{"encryptionKey":"o9h/ZELeWmceR+5WOUM7g3LTtqDZxPJr"},"platformId":"NA1","bannedChampions":[{"championId":50,"teamId":100,"pickTurn":1},{"championId":22,"teamId":100,"pickTurn":2},{"championId":55,"teamId":100,"pickTurn":3},{"championId":145,"teamId":100,"pickTurn":4},{"championId":121,"teamId":100,"pickTurn":5},{"championId":39,"teamId":200,"pickTurn":6},{"championId":238,"teamId":200,"pickTurn":7},{"championId":72,"teamId":200,"pickTurn":8},{"championId":35,"teamId":200,"pickTurn":9},{"championId":498,"teamId":200,"pickTurn":10}],"gameStartTime":0,"gameLength":0}

router.get('/', (req, res) => {
    const region = req.query.region;
    zed.getSummoner(req.query.userName, region).then(summoner => {
        if (!summoner) return res.redirect('/')
        zed.getSummonerLeague(summoner.id, region).then(summonerRank => {
            Promise.all([
                zed.getLeague(summoner.id, region),
                zed.getSummonerGame(summoner.id, region),
                zed.getMastery(summoner.id, region),
                zed.getSummonerSpells()
            ])
            .then(([league, match, mastery, summonerSpells]) => {
                res.render('summoner', {
                    title: summoner.name + " | Summoner Profile | Legends",
                    summoner,
                    summonerRank,
                    league,
                    match,
                    championIds,
                    mastery,
                    region,
                    summonerSpells,
                });
            });
        });
    });
});

module.exports = router;