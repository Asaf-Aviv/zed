const rp = require('request-promise')
const fs = require('fs')

rp.get(
    'http://ddragon.leagueoflegends.com/cdn/8.1.1/data/en_US/summoner.json'
)
.then(data => {
    fs.writeFile('summoner.json', data, err => console.log(err))
})

rp.get(
    'http://ddragon.leagueoflegends.com/cdn/8.11.1/data/en_US/champion.json'
)
.then(data => {
    fs.writeFileSync('champion.json', data, err => console.log(err))
})

rp.get(
    'http://ddragon.leagueoflegends.com/cdn/8.11.1/data/en_US/item.json'
)
.then(data => {
    fs.writeFileSync('item.json', data, err => console.log(err))
})