const socket = io();

socket.on('friendRequest', user => {
    notificationHandler('#friend-requests', 'flash', 1000);
    createNotification('#friend-requests-nav', `<a class="notify-link" href="/users/${user}">${user}</a> sent you a friend request!`)

    successAlert(
        `<a href="/users/${user}">${user}</a> sent you a friend request`,
        'topRight',
        'fa fa-user'
    );
});

socket.on('likePost', user => {
    notificationHandler('#notifications', 'ring', 1500);
    createNotification('#notifications-nav', `<a class="notify-link" href="/users/${user}">${user}</a> liked your post!`)

    successAlert(
        `<a href="/users/${user}">${user}</a> liked your post!`,
        'topRight', 
        'fa fa-thumbs-up'
    );
});

socket.on('likeComment', user => {
    notificationHandler('#notifications', 'ring', 1500);
    createNotification('#notifications-nav', `<a class="notify-link" href="/users/${user}">${user}</a> liked your comment!`)

    successAlert(
        `<a href="/users/${user}">${user}</a> liked your comment!`,
        'topRight', 
        'fa fa-thumbs-up'
    );
});

socket.on('comment', user => {
    notificationHandler('#notifications', 'ring', 1500);
    createNotification('#notifications-nav', `<a class="notify-link" href="/users/${user}">${user}</a> commented on your post!`);
    
    successAlert(
        `<a href="/users/${user}">${user}</a> just commented on your post!`,
        'topRight',
        'fa fa-comment'
    );
});

socket.on('acceptFriendRequest', user => {
    console.log('accepted');
    notificationHandler('#notifications', 'ring', 1500);
    createNotification('#notifications-nav', `You and <a class="notify-link" href="/users/${user}">${user}</a> are now friends!`);

    successAlert(
        `You and <a href="/users/${user}">${user}</a> are now friends!`,
        'topRight',
        'fa fa-check'
    );
});

socket.on('newMessage', user => {
    notificationHandler('#messages', 'rubberBand', 1000);
    createNotification('#messages-nav', `<a class="notify-link" href="/users/${user}">${user}</a> sent you a message!`);
    
    successAlert(
        `${user} just sent you a message!`,
        'topRight',
        'fa fa-envelope'
    );
});

function notificationHandler(ele, className, ms) {
    let numOfNotific = $(ele).find('.badge:first').text();

    $(ele).find('.badge:first').text(numOfNotific.toString().length < 3 ? ++numOfNotific : '99+');
    $(`${ele} i:first-child`).addClass(className);
    setTimeout(() => $(`${ele} i:first-child`).removeClass(className), ms);
}

function createNotification(ele, text) {
    const notificationElement = 
    `
        <div class="notify-wrapper">
            <div class="notify-time">
                <span>a few seconds ago</span>
            </div>
            <div class="notify-body">
                ${text}
            </div>
        </div>
    `;

    $(`${ele} .notify-content`).prepend(notificationElement);
}