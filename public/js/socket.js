const socket = io();

socket.on('friendRequest', (user) => {
    successAlert(
        `<a href="/users/${user}">${user}</a> sent you a friend request`,
        'topRight',
        'fa fa-user'
    );
});

socket.on('likePost', (user) => {
    successAlert(
        `<a href="/users/${user}">${user}</a> liked your post`,
        'topRight', 
        'fa fa-thumbs-up'
    );
});

socket.on('acceptFriendRequest', (user) => {
    successAlert(
        `You and <a href="/users/${user}">${user}</a> are now friends!`,
        'topRight',
        'fa fa-check'
    );
});