const rp               = require('request-promise');
const redisClient      = require('./redis_client');
const championIds      = require('../assets/data/champions/championIds.json');
const champions        = require('../assets/data/champions/champion.json');
const leagueItems      = require('../assets/league/data/en_US/item.json');
const runes            = require('../assets/league/data/en_US/runesReforged.json');
const summonerSpells   = require('../assets/league/data/en_US/summoner.json');
const general_cmp_info = require('../assets/data/general_champ_info.json')

const ddragon      = `//ddragon.leagueoflegends.com/cdn/8.10.1`;
const ddragonNoVer = '//ddragon.leagueoflegends.com/cdn';
const riot         = '.api.riotgames.com/lol/';
const champGG      = 'http://api.champion.gg/v2';

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

global.regionNameFix = {
    NA1: 'North America',
    EUW1: 'Eu West',
    EUN1: 'Eu Nordic & East',
    BR1: 'Brazil',
    KR: 'Korea',
    JP1: 'Japan',
    LA1: 'Latin America',
    LA2: 'Latin America',
    TR1: 'Turkey',
    OC1: 'Oceania',
    RU: 'Russia'
};

// SPECTATE
async function makeSpecBatch(specObject) {
    const specBat = String.raw`CD /D D:\Riot Games\League of Legends\RADS\solutions\lol_game_client_sln\releases\0.0.1.217\deploy`;
    const batch = `${specBat}\n\t${specGrid.start}${specGrid[specObject.region]}${specObject.key} ${specObject.gameId} ${specObject.region}"`;
    return batch;
}

// RIOT API

// SUMMONER
async function getSummoner(summonerName, region) {
    return redisClient.getAsync(`summoner_${summonerName}_${region}`)
        .then(async summonerData => {
            if (summonerData) return JSON.parse(summonerData);

            summonerData = await rp({
                uri: `https://${region}${riot}summoner/v3/summoners/by-name/${summonerName}?api_key=${process.env.LOL_KEY}`,
                json: true 
            })
            .catch(err => console.log("getSummoner ERROR: " + err));

            redisClient.SET(`summoner_${summonerName}_${region}`, JSON.stringify(summonerData), 'EX', 3600 * 12);
            return summonerData;
        });
}

// SUMMONER GAME
async function checkActiveGame(summonerId, region) {
    const summonerGameData = await rp({
        uri: `https://${region}${riot}spectator/v3/active-games/by-summoner/${summonerId}?api_key=${process.env.LOL_KEY}`,
        json: true
    })
    .catch(err => console.log("checkActiveGame ERROR: " + err));
    return summonerGameData;
}

// MATCH LIST
async function getMatchList(summonerId, region, beginIndex='', endIndex='', queue='', timestamp='') {
    const matchList = await rp({
        uri: `https://${region}${riot}match/v3/matchlists/by-account/\
        ${summonerId}?beginIndex=${beginIndex}&endIndex=${endIndex}\
        &queue=${queue}&season=11&api_key=${process.env.LOL_KEY}`.replace(/ /g, ''),
        json: true
    })
    .catch(err => console.log("getMatchList ERROR: " + err));
    return matchList;
}

async function getMatchSummary(gameId, region) {
    return redisClient.getAsync(`match_summary_${gameId}_${region}`)
        .then(async summary => {
            if (summary) return JSON.parse(summary);

            summary = await rp({
                uri: `https://${region}${riot}match/v3/matches/${gameId}?api_key=${process.env.LOL_KEY}`,
                json: true
            })
            .catch(err => console.log('getMatchSummary ERROR:', err));
            console.log('caching');
            redisClient.SET(`match_summary_${gameId}_${region}`, JSON.stringify(summary));
            return summary;
    })
}

// SUMMONER LEAGUE POSITION
async function getSummonerPosition(summonerId, region) {
    return redisClient.getAsync(`summoner_pos_${summonerId}_${region}`)
        .then(async summonerPosition => {
            if (summonerPosition) return JSON.parse(summonerPosition);
            
            summonerPosition = await rp({
                uri: `https://${region}${riot}league/v3/positions/by-summoner/${summonerId}?api_key=${process.env.LOL_KEY}`,
                json: true
            })
            .catch(err => console.log('getSummonerPosition ERROR: ', err));

            redisClient.SET(`summoner_pos_${summonerId}_${region}`, JSON.stringify(summonerPosition), 'EX', 3600);
            return summonerPosition;
        });
}

// LEAGUE
async function getLeague(leagueId, region) {
    return redisClient.getAsync(`league_${leagueId}`)
        .then(async league => {
            if (league) return JSON.parse(league);
            
            league = await rp({
                uri: `https://${region}${riot}league/v3/leagues/${leagueId}?api_key=${process.env.LOL_KEY}`,
                json: true
            })
            .catch(err => console.log('getLeague error:', err));

            redisClient.SET(`league_${leagueId}`, JSON.stringify(league), 'EX', 3600 * 12);
            return league; 
        });
}

// LEADERBOARDS
async function getLeaderboards(region='NA1') {
    return redisClient.getAsync(`challenger_${region}`)
        .then(async leaderboardData => {
            if (leaderboardData) return JSON.parse(leaderboardData);
                
            leaderboardData = await rp({
                uri: `https://${region}${riot}league/v3/challengerleagues/by-queue/RANKED_SOLO_5x5?api_key=${process.env.LOL_KEY}`,
                json: true 
            })
            .catch(err => console.log("getLeaderboards ERROR:", err));

            leaderboardData.entries.sort((a, b) => b.leaguePoints - a.leaguePoints);
            redisClient.set(`challenger_${region}`, JSON.stringify(leaderboardData), 'EX', 3600);
            return leaderboardData;
        });
}

// CHAMPION API

async function getAllChampionsStats(elo='platplus') {
    const allData = `kda,minions,goldEarned`
    const getChampsData = elo && elo !== 'platplus' ? 
        `${champGG}/champions?limit=250&elo=${elo.toUpperCase()}&champData=${allData}&api_key=${process.env.CHAMPION_KEY}` :
        `${champGG}/champions?limit=250&champData=${allData}&api_key=${process.env.CHAMPION_KEY}`;
    const champData = await rp({
        uri: getChampsData,
        json: true
    })
    .catch(err => console.log("getAllChampionsStats ERROR: " + err));
    return champData;
}

async function getIndepthStats(champName, position, elo) {
    champName = String(Object.keys(championIds).filter(c => c.toLowerCase() === champName.toLowerCase()))
    if (!champName) return;

    elo = (elo && elo.toLowerCase() !== 'platplus') ? elo.toUpperCase() : '';
    
    const allData = 'kda,damage,goldEarned,sprees,hashes,wards,averageGames,killingSpree,minions,wins,trinkets,runes,firstitems,summoners,skills,finalItems,matchups'
    const getIndepthData = `${champGG}/champions/${championIds[champName]}?elo=${elo}&champData=${allData}&api_key=${process.env.CHAMPION_KEY}`;
    
    let indepthStats = await rp({ 
        uri: getIndepthData, 
        json: true 
    });
    console.log(getIndepthData);
    if (position) {
        position = position.toUpperCase().replace('SUPPORT', 'DUO_SUPPORT').replace('ADC','DUO_CARRY');
        indepthStats = indepthStats.filter(champ => champ.role == position);
    } else {
        indepthStats = [indepthStats
            .reduce((positionA, positionB) => positionA.gamesPlayed > positionB.gamesPlayed ? positionA : positionB)]
    }
    return indepthStats;
}

async function getOverallStatistics(elo='platplus') {
    const getOverallData = elo && elo !== 'platplus' ? 
        `${champGG}/overall?elo=${elo.toUpperCase()}&api_key=${process.env.CHAMPION_KEY}` :
        `${champGG}/v2/overall?&api_key=${process.env.CHAMPION_KEY}`;
    const overallStats = await rp({
        uri: getOverallData,
        json: true
    })
    .catch(err => console.log("getOverallStatistics ERROR: " + err));
    return overallStats[0];
}

async function getOverallPatchInfo(elo='platplus') {
    const getOverallPatchData = elo && elo !== 'platplus' ? 
        `${champGG}/v2/general?elo=${elo.toUpperCase()}&api_key=${process.env.CHAMPION_KEY}` :
        `${champGG}/v2/general?&api_key=${process.env.CHAMPION_KEY}`;
    const overallPatch = await rp({ uri:
        getOverallPatchData,
        json: true
    })
    .catch(err => console.log("getOverallPatch ERROR: " + err));
    return overallPatch[0];
}

// STATIC DATA
function getChampDesc(champ) {
    champ = Object.keys(championIds).filter(k => k.toLowerCase() === champ.toLowerCase())
    const id = championIds[champ[0]];
    return new Promise((resolve, reject) => {
        resolve(champions.data[championIds[id]]);
    });
}

function getChampionsIdsAndNames() {
    return new Promise((resolve, reject) => {
        resolve(champions.keys);
    });
}

function getRunesReforged() {
    return new Promise((resolve, reject) => {
        resolve(runes);
    });
}

module.exports = {
    getSummoner,
    getLeague,
    getSummonerPosition,
    getMatchSummary,
    checkActiveGame,
    getLeaderboards,
    getMatchList,
    getOverallPatchInfo,
    getOverallStatistics,
    getAllChampionsStats,
    getIndepthStats,
    getChampionsIdsAndNames,
    getChampDesc,
    getRunesReforged,
    ddragon,
    ddragonNoVer,
    makeSpecBatch,
    summonerSpells,
    leagueItems,
    general_cmp_info,
};