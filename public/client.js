$(function() {
    fixPopover();
    $('#tier-1 table, #tier-2 table, #tier-3 table, #tier-4 table, #tier-5 table').DataTable();
    $('#leaderboard-table').DataTable();
    $('[data-toggle="tooltip"]').tooltip().click(function(e) {
        e.preventDefault()
    });
    
    $('.lb-summoner').on('click', function() {
        window.location = `/summoner?userName=${$(this).text()}&region=${location.href.slice(location.href.lastIndexOf('=')+1)}`;
    });

    $('.fa-search').click( () => $('#navbar-search-form').submit());

    $(".icon-arrow-up2").click(function() {
        $("html, body").animate({ scrollTop: 0 }, 1000, 'easeInOutCubic');
        return false;
      });

    $(document).scroll(function() {
        $(this).scrollTop() > 200 ? $('.icon-arrow-up2').fadeIn() : $('.icon-arrow-up2').fadeOut();
    });

    $('#filter-items input').click(function() {
        let values = [],
            tags,
            show;

        $('#filter-items input:checkbox:checked').each(function() {
            values.push($(this).val())
        });

        if(values.length > 0) {
            $('.league-item-wrapper div').map(function() {
                show = true;
                tags = $(this).attr('tags').split(' ')
                for (let val of values) {
                    if (tags.indexOf(val) === -1) {
                        show = false;
                        break;
                    }
                }
                show ? $(this).show() : $(this).hide()
            });
        } else {
            $('.league-item-wrapper div').show()
        }
    });

    $('#search-filter input').keyup(function() {
        let value = $(this).val().toLowerCase()
        $('.league-item-wrapper div').each(function() {
            $(this).attr('data-title').search(value) < 0 ? $(this).hide() : $(this).show()
        });
    });

    {
        let unsorted = $('.league-item-wrapper div');
        let lowToHigh = $('.league-item-wrapper div').sort(function(a, b) {
            return +$(a).attr('data-price') - +$(b).attr('data-price');
        });
        let HighToLow = $('.league-item-wrapper div').sort(function(a, b) {
            return +$(b).attr('data-price') - +$(a).attr('data-price');
        });
        let i = 0;

        $('#sort-items input').click(function() {
            i++
            i === 1 ? $('.league-item-wrapper').html(lowToHigh) :
            i === 2 ? $('.league-item-wrapper').html(HighToLow) : ($('.league-item-wrapper').html(unsorted), i = 0)
            fixPopover();
        });
    }

    

    $('.delete-post').click(function() {
        const postId = $(this).attr('data-id');

        $.ajax({
            type: 'DELETE',
            url: '/post/'+postId,
            success: function(res) {
                console.log(res);
                window.location.href = '/profile';
            },
            error: function(err) {
                alert(err);
            }
        });
    });

    $('.like-post').click(function() {
        const postId = $(this).attr('data-id');
        let likes = $(this).text();

        $.ajax({
            type: 'POST',
            url: '/post/like/'+postId,
            success: function(res) {
                $(`#${postId} .like-post`).text(++likes);
            },
            error: function(err) {
                alert(err);
            }
        });
    });

    $('.send-friend-request').click(function() {
        const userId = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: 'users/sendFriendRequest/'+userId,
            success: function(res) {
                $(`[data-id=${res}]`).replaceWith($('<a>').addClass('btn btn-warning').html('Pending'));
            },
            error: function(err) {
                alert(err);
            }
        });
    });

    $('.decline-friend-request').click(function() {
        const userId = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: 'users/declineFriendRequest/'+userId,
            success: function(res) {
                $(`#${res}`).remove();
            },
            error: function(err) {
                alert(err);
            }
        });
    });

    $('.accept-friend-request').click(function() {
        const userId = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: 'users/acceptFriendRequest/'+userId,
            success: function(res) {
                $(`#${res}`).remove();
            },
            error: function(err) {
                alert(err);
            }
        });
    });

    $('.overall-wrapper').on('change', '#overall-league', function() {
        let league = $(this).val();

        $.ajax({
            type: 'GET',
            url: `/statistics?league=${$(this).val()}`,
            success: function(res) {
                console.log(res);
                $('.overall-wrapper').html(res);
            }
        })
    });

    $('#spectate').click(function() {
        const gameId = $(this).attr('data-id');
        const region = $(this).attr('data-region');
        const key = $(this).attr('data-key')
        $.ajax({
            type: 'POST',
            url: `/spectate/${gameId}`,
            data: {
                gameId,
                region,
                key,
            },
            success: function(res) {
                console.log(res)
                window.open(`/spectate/${gameId}`)
            },
            error: function(err) {
                alert(err);
            }
        });

    });

    var pusher = new Pusher('8a344f0f04d1ec9118c7', {
        cluster: 'mt1'
      });
    var channel = pusher.subscribe('my-channel');
    
    channel.bind('my-event', function(data) {
        alert('An event was triggered with message: ' + data.message);
      });

      $('.move-to-trash').click(function() {
        const msg = $(`#${$(this).parent().attr('id')}`)
        $.confirm({
            draggable: true,
            closeIcon: true,
            icon: 'fa fa-warning',
            type: 'red',
            title: 'Confirm',
            content: 'Are you sure you want to delete this message ?',
            theme: 'dark',
            buttons: {
                Yes: {
                    action: () => msg.remove(),
                    btnClass: 'btn btn-outline-success'
                },
                No:{
                    action: () => {},
                    btnClass: 'btn btn-outline-danger'
                }
            }
        });
    });

    $('.clear-trash').click(function() {
        const msg = $(`#${$(this).parent().attr('id')}`)
        $.confirm({
            draggable: true,
            closeIcon: true,
            icon: 'fa fa-warning',
            type: 'red',
            title: 'Confirm',
            content: 'Are you sto delete this message ?',
            theme: 'dark',
            buttons: {
                Yes: {
                    action: () => msg.remove(),
                    btnClass: 'btn btn-outline-success'
                },
                No:{
                    action: () => {},
                    btnClass: 'btn btn-outline-danger'
                }
            }
        });


    });
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        $('.ajax-loader-wrapper').removeClass('invisible');
        $('#contact-form button').prop('disabled', true);
        $.ajax({
            type: "POST",
            url: '/contact',
            data: $('#contact-form').serialize(),
            success: function(data) {
                succesAlertCenter(data);
            },
            error: function(data) {
                errorAlertCenter(data);
            },
            complete: function() {
                $('.ajax-loader-wrapper').addClass('invisible');
                $('#contact-form button').prop('disabled', false);
            }
        });
    });

    $('#feedback-form').submit(function(e) {
        e.preventDefault();
        $('.ajax-loader-wrapper').removeClass('invisible');
        $('#feedback-form button').prop('disabled', true);
        $.ajax({
            type: "POST",
            url: '/feedback',
            data: $('#feedback-form').serialize(),
            success: function(data) {
                succesAlertCenter(data);
            },
            error: function(data) {
                errorAlertCenter(data);
            },
            complete: function() {
                $('.ajax-loader-wrapper').addClass('invisible');
                $('#feedback-form button').prop('disabled', false);
            }
        });
    });
    $('.remove-feedback').click(function(){
        $('#feedback-wrapper, .feedback-btns').remove();
    });
    $('.feedback-btn, .close-feedback').click(function() {
        $('#feedback-wrapper').toggleClass('d-none');
        $('#feedback-form textarea').focus();
    });
    
    $('#inbox-controls > div').click(function(e) {
        if (!$(this).hasClass('inbox-nav-active')) {
            window.location.hash = $(this).attr('id');
            let divToShow = $(this).attr('data-link');
            $('.inbox-nav-active').removeClass('inbox-nav-active');
            $(this).addClass('inbox-nav-active');
            $('#inbox-msg-wrapper > div').hide();
            $(`#${divToShow}`).show();
        }
    });
    var href = location.href;
    var pgurl = href.substr(href.lastIndexOf('/') + 1);
    console.log(pgurl)
    $('.sidebar-item a[href="/' + pgurl + '"]').parent().addClass('sidebar-active');
});



iziToast.settings({
    class: 'izi-alert',
    titleSize: '18px',
    titleColor: '#b1a0ff',
    messageSize: '15px',
    messageColor: '#b1a0ff',
    iconColor: '#b1a0ff',
    backgroundColor: 'rgba(44,44,44,0.7)',
    progressBarColor: '#b1a0ff',
    close: true,
    position: 'topRight',
    titleLineHeight: '1.2',
    messageLineHeight: '1.5'
});

function succesAlertCenter(message) {
    iziToast.show({
        titleColor: 'green',
        iconColor: 'green',
        icon: 'fa fa-check',
        title: 'Success: ',
        message,
        position: 'center',
        overlay: true,
        overlayClose: true,
    });
}

function errorAlertCenter(message) {
    console.log(message.responseJSON)
    iziToast.show({
        titleColor: 'red',
        iconColor: 'red',
        icon: 'fa fa-exclamation-triangle',
        title: 'Error: ',
        message: message.responseJSON,
        position: 'center',
        overlay: true,
        overlayClose: true,
    });
}

$('#suhdude').click( () => {
    iziToast.show({
        title: 'Friend Request',
        message: `<a href="/users/yojimbozx">yojimbozx</a> sent you a friend request`,
        icon: 'fa fa-user',
    });
});

var socket = io();

socket.on('friendRequest', (user) => {
    iziToast.show({
        title: 'Friend Request',
        message: `<a href="/users/${user}">${user}</a> sent you a friend request`,
        color: 'yellow',
        position: 'topRight'
    });
});

socket.on('acceptFriendRequest', (data) => {
    console.log(data);
    $('#modal').iziModal('open');
    $('#success-alerts').html(data)
});

function fixPopover() {
    $('[data-trigger="manual"]').click(function(e) {
        $(this).popover('toggle');
        e.preventDefault();
    }).blur(function() {
        $(this).popover('hide');
    });
}