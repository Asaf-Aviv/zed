global.connectedUsers = {};

io.on('connection', function(socket) {
    if (socket.handshake.session.passport) {
        connectedUsers[socket.handshake.session.passport.user._id] = socket.id
    }
    socket.on('disconnect', function () {
        if (socket.handshake.session.passport) {
            delete connectedUsers[socket.handshake.session.passport.user._id]
        }
    });
});