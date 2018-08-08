global.connectedUsers = {}

io.on('connection', socket => {
    if (socket.handshake.session.passport) {
        const userId = socket.handshake.session.passport.user._id
        if (!connectedUsers[userId]) {
            connectedUsers[userId] = []
        }
        connectedUsers[userId].push(socket.id)
    } else {
        socket.disconnect(true)
    }

    socket.on('disconnect', () => {
        if (socket.handshake.session.passport) {
            const userId = socket.handshake.session.passport.user._id
            connectedUsers[userId].shift(socket.id)
        }
    })
})