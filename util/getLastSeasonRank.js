const rp = require('request-promise');
const keys = require('../private/keys');

function getLastSeasonRank(gameId) {
    const lastSeason = `https://euw1.api.riotgames.com/lol/match/v3/matches/${gameId}?api_key=${keys.lol}`;
    return rp({ uri: lastSeason, json: true })
        .catch(function(err) {
            console.log("getLastSeasonRank ERROR: " + err);
        });
}

module.exports = getLastSeasonRank;
