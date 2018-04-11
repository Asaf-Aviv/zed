global.connectedUsers = {};

io.on('connection', function(socket) {
    // console.log('A user connected');
    if (socket.handshake.session.passport) {
        connectedUsers[socket.handshake.session.passport.user._id] = socket.id
        // console.log(socket.handshake.session.passport.user, 'connected')
    }
    // console.log(connectedUsers)
    socket.on('disconnect', function () {
        if (socket.handshake.session.passport) {
            delete connectedUsers[socket.handshake.session.passport.user._id]
        }
        // console.log('A user disconnected');
        // console.log(connectedUsers)
    });
});