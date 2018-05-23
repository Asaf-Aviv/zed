$(function() {

    var path = window.location.pathname.split("/").pop();
    if (!path) $('#main-nav-bar a[href="/"]').addClass('nav-active');
    else $('#main-nav-bar a[href*="'+path+'"]').addClass('nav-active');

    $('.lazy').Lazy();

    fixPopover();

    $('#tier-1 table, #tier-2 table, #tier-3 table, #tier-4 table, #tier-5 table, #leaderboard-table').DataTable({
        "iDisplayLength": -1,
        "paging": false,
    });

    $('[data-toggle="tooltip"]').tooltip().click(function(e) {
        e.preventDefault()
    });

    // NavBar utilities
    $('.util-box').click(function(e) {
        e.stopPropagation();

        const $this = $(this);
        const divToShow = $(`${$(this).data('link')}`);

        $this.find('span').text('');

        $this.siblings('.is-active')
            .removeClass('is-active');

        $this.toggleClass('is-active')

        $('.util-box')
            .children()
            .not(divToShow)
            .removeClass('is-active');

        if (!divToShow.hasClass('is-active')) divToShow.addClass('is-active');
        else divToShow.removeClass('is-active').addClass('is-closed');
    });

    $('.util-content').click(function(e) {
        e.stopPropagation();
    });

    $(document).scroll(function() {
        const y = $(this).scrollTop();
        if (y > 900) $('#scroll-top').css({'display': 'block'});
        else $('#scroll-top').css({'display': 'none'});
    });

    $('#scroll-top').click( () => $("html, body").animate({ scrollTop: 0 }, 280, 'easeOutCubic'));

    $(document).click(function(e) {
        if (!$(e.target).is('.util-box') || !$(e.target).parents('.util-box').length) {
            const actives = $('.util-box').find('.is-active')
            if (actives.length) {
                actives.removeClass('is-active').addClass('is-closed').parents().removeClass('is-active')
            }
        }
    });

    $('.lb-summoner').on('click', function() {
        window.location = `/summoner?userName=${$(this).text()}&region=${location.href.slice(location.href.lastIndexOf('=')+1)}`;
    });

    $('#filter-items input').click(function() {
        let values = [],
            tags,
            show;

        $('#filter-items input:checkbox:checked').each(function() {
            values.push($(this).val())
        });

        if(values.length > 0) {
            $('.league-item-wrapper > div').map(function() {
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
            $('.league-item-wrapper > div').show()
        }
    });

    $('#search-filter input').keyup(function() {
        let value = $(this).val().toLowerCase()
        $('.league-item-wrapper > div').each(function() {
            $(this).data('title').search(value) < 0 ? $(this).hide() : $(this).show()
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
                window.location.href = '/profile';
            },
            error: function(err) {
                alert(err);
            }
        });
    });

    $('.like-post').click(function() {
        const postId = $(this).attr('data-id');
        let likes = $(`#${postId} .like-count`).text();

        $.ajax({
            type: 'POST',
            url: '/post/like/'+postId,
            success: function(res) {
                $(`#${postId} .like-post > button`).toggleClass('active');
                $(`#${postId} .like-count`).text(+likes + +res);
            },
            error: function(err) {
                errorAlert(err.responseText, 'center');
            }
        });
    });

    $('.comment-form').submit(function(e) {
        e.preventDefault();

        const postId = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            data: $(this).serialize(),
            url: '/post/comment/'+postId,
            success: function(res) {
                successAlert('success', 'center', 'fa fa-comment');
            },
            error: function(err) {
                errorAlert(err.responseText, 'center')
            }
        });
    });
    
    $('#message-form').submit(function(e) {
        e.preventDefault();
        $this = $(this);
        $this.addClass('loading');
        const userId = $('#message-form').attr('data-id');

        $.ajax({
            type: 'POST',
            data: $(this).serialize(),
            url: '/message/'+userId,
            success: function(res) {
                successAlert('success', 'center', 'fa fa-comment');
            },
            error: function(err) {
                errorAlert(err.responseText, 'center')
            },
            complete: function() {
                $this.removeClass('loading');
            }
        });
    });

    $(document).on('click', '.delete-comment', function() {
        const commentId = $(this).attr('data-id');
        $this = $(this)
        $this.prop('disabled', true);

        $.ajax({
            type: 'DELETE',
            url: '/post/comment/'+commentId,
            success: function(res) {
                successAlert('Message deleted', 'topRight', 'fa fa-check');
            },
            error: function(err) {
                alert(err);
            },
            complete: () => $this.prop('disabled', false)
        });
    });

    $(document).on('click', '.send-friend-request', function() {

        const userId = $(this).attr('data-id');
        $this = $(this)
        $this.prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: 'users/sendFriendRequest/'+userId,
            success: function(res) {
                $(`[data-id=${res}]`).replaceWith($('<button>').addClass('btn btn-warning').html('Pending'));
                $(`#${res}`).append($('<button>').addClass('btn btn-danger cancel-friend-request').attr('data-id', res).html('cancle'));
                successAlert('Request sent', 'topRight', 'fa fa-user')
            },
            error: function(data) {
                errorAlert('Something went wrong :/ Please try again.', 'center');
            },
            complete: () => $this.prop('disabled', false)
        });
    });

    $(document).on('click', '.accept-friend-request', function() {
        const userId = $(this).attr('data-id');
        $this = $(this)
        $this.prop('disabled', true)

        $.ajax({
            type: 'POST',
            url: 'users/acceptFriendRequest/'+userId,
            success: function(res) {
                $(`#${userId}`).remove();
                // $(`#${res}`).find('button').remove();
                // $(`#${res}`).append($('<button>').addClass('btn btn-success ').html('Friends'));
            },
            error: function(err) {
                alert(err);
            },
            complete: () => $this.prop('disabled', false)
        });
    });

    $(document).on('click', '.decline-friend-request', function() {

        const userId = $(this).attr('data-id');
        $this = $(this)
        $this.prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: 'users/declineFriendRequest/'+userId,
            success: function(res) {
                $(`#${res}`).find('button').remove();
                $(`#${res}`).append($('<button>').addClass('btn btn-success send-friend-request').attr('data-id', res).html('ADD'));
            },
            error: function(err) {
                alert(err);
            },
            complete: () => $this.prop('disabled', false)
        });
    });

    $(document).on('click', '.cancel-friend-request', function() {
        
        const userId = $(this).attr('data-id');
        $this = $(this)
        $this.prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: 'users/cancelFriendRequest/'+userId,
            success: function(res) {
                $(`#${res}`).find('button').remove();
                $(`#${res}`).append($('<button>').addClass('btn btn-success send-friend-request').attr('data-id', res).html('ADD'));
            },
            error: function(err) {
                alert(err);
            },
            complete: () => $this.prop('disabled', false)
        });
    });

    $('#overall-wrapper').on('change', '#overall-league', function() {
        createLoader('#overall-patch-tables', 'Loading');
        $.ajax({
            type: 'GET',
            url: `/statistics/overall/${$(this).val()}`,
            success: function(res) {
                $('#overall-wrapper').html(res);
            }
        });
    });

    $('#overall-champs').on('change', '#overall-table-elo', function() {
        createLoader('#overall-table', 'Loading');
        $.ajax({
            type: 'GET',
            url: `/statistics/overall/champions/${$(this).val()}`,
            success: function(res) {
                $('#overall-champs').html(res);
            }
        });
    });

    $('#spectate').click(function() {
        const $this = $(this);
        const gameId = $this.attr('data-id');
        const region = $this.attr('data-region');
        const key = $this.attr('data-key');

        $.ajax({
            type: 'post',
            url: `/spectate/${gameId}`,
            data: {
                gameId,
                region,
                key,
            },
            success: function(res) {
                window.open('/spectate/'+res);
            },
            error: function(err) {
                alert(err);
            }
        });
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

    $('.delete-photo').click(function() {
        const photoId = $(this).data('id')
        const photoUuid = $(this).data('uuid')

        $.confirm({
            draggable: true,
            closeIcon: true,
            icon: 'fa fa-warning',
            type: 'red',
            title: 'Confirm',
            content: 'Are you sure you want to delete this photo ?',
            theme: 'dark',
            buttons: {
                Yes: {
                    action: function() {
                        $.ajax({
                            url: `/profile/image/${photoId}`,
                            type: 'DELETE',
                            data: {uuid: photoUuid},
                            success: function() {
                                alert('success');
                            },
                            error: function() {
                                alert('error');
                            }
                        })
                    },
                    btnClass: 'btn btn-outline-success'
                },
                No:{
                    action: () => {},
                    btnClass: 'btn btn-outline-danger'
                }
            }
        });
    });
    
    $('#summoner-search').on('click', 'button', function(e) {
        const query = window.location.href+`/summoner?${$('#summoner-search').serialize()}&region=${$('#summoner-search .active').attr('data-region')}`
        window.location = query
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
                successAlert(data, 'center', 'fa fa-thumps-up');
            },
            error: function(data) {
                errorAlert('Something went wrong :/ Please try again.', 'center');
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
                successAlert(data, 'topRight', 'fa fa-thumps-up');
            },
            error: function(data) {
                errorAlert('Something went wrong :/ Please try again.', 'center');
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

function successAlert(message, position, icon) {
    iziToast.show({
        titleColor: 'green',
        iconColor: 'green',
        icon,
        message,
        position,
    });
}

function errorAlert(message, position) {
    iziToast.show({
        titleColor: 'red',
        iconColor: 'red',
        icon: 'fa fa-exclamation-triangle',
        title: 'Error: ',
        message,
        position,
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

function fixPopover() {
    $('[data-trigger="manual"]').click(function(e) {
        $(this).popover('toggle');
        e.preventDefault();
    }).blur(function() {
        $(this).popover('hide');
    });
}

function createLoader(parent, text='') {
    $(parent)
        .addClass('position-relative')
        .prepend(
            $('<div class="ui active dimmer"></div>')
                .append(
                    $(`<div class="ui text loader">${text}</div>`)
        )
    );
}