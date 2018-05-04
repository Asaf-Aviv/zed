const fs = require('fs');
const rp = require('request-promise');

async function getRunes() {
    return rp({
        uri: 'https://euw1.api.riotgames.com/lol/static-data/v3/reforged-runes?api_key=RGAPI-efd0818d-bc80-4e12-8c4f-73405cef4d7a',
        json: true
    });
} 

getRunes().then(runes => {
    const keyBy = (arr, key) => arr.reduce((r, o) => ({ ...r,  [o[key]]: o }), {});
    result = keyBy(runes, 'id')
    fs.writeFileSync('result.json', JSON.stringify(result))
});