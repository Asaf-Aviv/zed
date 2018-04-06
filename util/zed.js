const rp = require('request-promise');
const championSkins = require('../assets/data/champions/championSkins');
const championIds = require('../assets/data/champions/championIds');
const champions = require('../assets/data/champions/champion');
const items = require('../assets/league/data/en_US/item');
const runes = require('../assets/league/data/en_US/runesReforged');
const summonerSpells = require('../assets/league/data/en_US/summoner');

const ddragon = '8.7.1';
const lol = '.api.riotgames.com/lol/';
const specGrid = {
    start: '"League of Legends.exe" 8394 LoLLauncher.exe "" "spectator ',
    NA1: 'spectator.na.lol.riotgames.com:80 ',
    EUW1: 'spectator.euw1.lol.riotgames.com:80 ',
    EUNE: 'spectator.eu.lol.riotgames.com:8080 ',
    JP1: 'spectator.jp1.lol.riotgames.com:80 ',
    KR: 'spectator.kr.lol.riotgames.com:80 ',
    OC1: 'spectator.oc1.lol.riotgames.com:80 ',
    BR1: 'spectator.br.lol.riotgames.com:80 ',
    LA1: 'spectator.la1.lol.riotgames.com:80 ',
    LA2: 'spectator.la2.lol.riotgames.com:80 ',
    RU: 'spectator.ru.lol.riotgames.com:80 ',
    TR1: 'spectator.tr.lol.riotgames.com:80 '
};

async function makeSpecBatch(summonerId, region) {
    const match = await rp({uri: `https://${region}${lol}spectator/v3/active-games/by-summoner/44840773?api_key=${process.env.LOL_KEY}`, json: true});
    // console.log(match.observers)
    const batch = `${specGrid.start}${specGrid[match.platformId]}${match.observers.encryptionKey} ${match.gameId} ${match.platformId}"`
    // console.log(batch)
    return batch
}

function getSummonerGame(summonerId, region) {
    const summonerGameData = `https://${region}${lol}spectator/v3/active-games/by-summoner/${summonerId}?api_key=${process.env.LOL_KEY}`;
    return rp({ uri: summonerGameData, json: true })
        .catch(function(err) {
            console.log("getSummonerGame ERROR: " + err);
        });
}
function getSummoner(summonerName, region) {
    const getSummonerData = `https://${region}${lol}summoner/v3/summoners/by-name/${summonerName}?api_key=${process.env.LOL_KEY}`;
    return rp({ uri: getSummonerData, json: true })
        .catch(err => {
            console.log("getSummoner ERROR: " + err);
        });
}

function getLeague(summonerId, region) {
    const getLeagueData = `https://${region}${lol}league/v3/positions/by-summoner/${summonerId}?api_key=${process.env.LOL_KEY}`;
    return rp({ uri: getLeagueData, json: true })
        .catch(function(err) {
            console.log("getLeague ERROR: " + err);
        });
}

function getMastery(summonerId, region) {
    const getMasteryData = `https://${region}${lol}champion-mastery/v3/champion-masteries/by-summoner/${summonerId}?api_key=${process.env.LOL_KEY}`;
    return rp({ uri: getMasteryData, json: true })
        .catch(function(err) {
            console.log("getMastery ERROR: " + err);
        });
}

function getLeaderboards(region) {
    const getLeaderboardData = `https://${region}${lol}league/v3/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_KEY}`;
    return rp({ uri: getLeaderboardData, json: true })
        .catch(function(err) {
            console.log("getLeaderboards ERROR: " + err);
        });
}

function getMatches(summonerId, region) {
    const getMatchesData = `https://${region}${lol}match/v3/matchlists/by-account/${summonerId}/recent?api_key=${process.env.LOL_KEY}`;
    return rp({ uri: getMatchesData, json: true })
        .catch(function(err) {
            console.log("getMatches ERROR: " + err);
        });
}

function getChampionStats(champName) {
    const allData = `kda,damage,minions,wins,positions,wards,normalized,averageGames,overallPerformanceScore,goldEarned,sprees,hashes,wins,maxMins` //,matchups
    const champId = +Object.keys(champions.keys).filter(v => champions.keys[v].toLowerCase() === champName.toLowerCase());
    // const allData = `kda,damage,minions,gold`;
    const getChampsData = `http://api.champion.gg/v2/champions/${champId}?champData=${allData}&api_key=${process.env.CHAMPION_KEY}`;
    console.log(getChampsData)
    return rp({ uri: getChampsData, json: true })
        .catch(function(err) {
            console.log("getChampionStats ERROR: " + err);
        });
}

function getOverallStatistics(elo) {
    const getOverallData = `http://api.champion.gg/v2/overall?elo=PLATINUM&api_key=${process.env.CHAMPION_KEY}`;
    return rp({ uri: getOverallData, json: true })
        .catch(function(err) {
            console.log("getOverallStatistics ERROR: " + err);
        });
}

function getChampDesc(champId) {
    return new Promise((resolve, reject) => {
        resolve(champions.data[championIds[champId]]);
    });
}

function getChampionsIdsAndNames() {
    return new Promise((resolve, reject) => {
        resolve(champions.keys);
    });
}

function getBg(name, max) {
    name = name.replace(' ', '').replace("'", '');
    const skinNum = Math.floor(Math.random() * max);
    return `${name}_${skinNum}.jpg`;
}

function getSkins(champId) {
    champId = championIds[champId];
    return championSkins["data"][champId];
}

function setIdToName(obj) {
    for (let i = 0, x = obj.length; i < x; i++) {
        obj[i].championName = championIds[obj[i].championId];
    }
}

function getNameById(champId) {
    return championIds[champId];
}

function getRunesReforged() {
    return new Promise((resolve, reject) => {
        resolve(runes);
    });
}

function getSummonerSpells() {
    return new Promise((resolve, reject) => {
        resolve(summonerSpells);
    });
}

function getItems() {
    return new Promise((resolve, reject) => {
        resolve(items);
    });
}

module.exports = {
    setIdToName,
    getSummoner,
    getLeague,
    getChampionStats,
    getSummonerGame,
    getMastery,
    getLeaderboards,
    getMatches,
    getSkins,
    getBg,
    getChampionsIdsAndNames,
    getChampDesc,
    getRunesReforged,
    getItems,
    getSummonerSpells,
    getOverallStatistics,
    makeSpecBatch,
};