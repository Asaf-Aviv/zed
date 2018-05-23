global.connectedUsers = {};

io.on('connection', function(socket) {
    // if (Object && Object.keys(socket.handshake.session.passport).length) {
    //     connectedUsers[socket.handshake.session.passport.user._id] = socket.id
    // }
    socket.on('disconnect', function () {
        // if (Object && Object.keys(socket.handshake.session.passport).length) {
        //     delete connectedUsers[socket.handshake.session.passport.user._id]
        // }
    });
});