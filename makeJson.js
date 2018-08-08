const fs = require('fs')
const rp = require('request-promise')

function getRunes() {
    return rp({
        uri: 'https://euw1.api.riotgames.com/lol/static-data/v3/reforged-runes?api_key='+process.env.LOL_KEY,
        json: true
    })
} 

getRunes().then(runes => {
    // wrap every rune object with the id of the rune
    const keyBy = (arr, key) => arr.reduce((r, o) => ({ ...r,  [o[key]]: o }), {})
    result = keyBy(runes, 'id')
    fs.writeFileSync('result.json', JSON.stringify(result))
})