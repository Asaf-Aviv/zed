const Legend = require('../models/user')

// Make dummy users for testing
module.exports = {
    makeDummyUsers() {
        let user;

        for (let i = 1; i < 6; i++) {
            user = new Legend({
                username: 'test'+i,
                email: 'test'+i+'@gmail.com',
                password: '12345678'
            })
            user.save()
        }
    }
}
