$(function() {
    $('.lazy').Lazy();

    fixPopover();

    $('#tier-1 table, #tier-2 table, #tier-3 table, #tier-4 table, #tier-5 table, #leaderboard-table').DataTable({
        "iDisplayLength": -1,
        "paging": false,
    });

    $('[data-toggle="tooltip"]').tooltip().click(function(e) {
        e.preventDefault();
    });

    $('.remove-history').click(function() {
        $(this).parent().remove();
        if (!$('.history-wrapper').children().length) $('#search-history').remove();
    });

    $('#nav-match-tab').click(function() {
        $(this).removeClass('animate');
    });

    $('#region-select > div').click(function(e) {
        const $this = $(this)
        const regionId = $this.data('region');
        const regionText = $this.text();

        $('#selected-region')
            .data('region', regionId)
            .text(regionText);
            
        $('#regions-wrapper').hide();
        $('#region-select').removeClass('bounceInDown');
    });

    $('#summoner-input input').focus(() => {
        $('#search-history').show();
    });

    $(document).click(function(e) {
        const target = $(e.target);

        if (!target.is('.util-box') || !target.parents('.util-box').length) {
            const actives = $('.util-box').find('.active');
            if (actives.length) {
                actives
                    .removeClass('active')
                    .addClass('is-closed')
                    .parents()
                    .removeClass('active');
            }
        }

        if (!$('#summoner-input input').is(":focus")
            && !target.is('#search-history')
            && !target.is('.remove-history i')
            && !target.is('.remove-history')) {
                if (!target.parents('#search-history').length) {
                    $('#search-history').hide();
                }
        }

        if (!target.parents('.actions-toggler').length ) {
            $('.actions').hide();
        }
    });

    $('#summoner-input input').keypress(e => {
        if (e.keyCode === 13) {
            $('#summoner-search-btn').click();
        }
    });

    $('#summoner-search-btn').click(() => {
        const summonerName = $('#summoner-input input').val().replace(/ /g, '+');
        const regionId = $('#selected-region').data('region');
            if (summonerName.length < 3) {
                return errorAlert('Summoner name must be at least 3 characters long.', 'topCenter', false);
            }
        window.location.href = `/summoner?region=${regionId}&userName=${summonerName}`;
    });

    // Navbar Utils
    $('.util-box').click(function(e) {
        e.stopPropagation();
        
        const $this = $(this);
        const divToShow = $(`${$(this).data('link')}`);

        $('#notifications i:first-child').addClass('ring');
        $('#messages i:first-child').addClass('animated rubberBand');
        $('#friend-requests i:first-child').addClass('animated flash');

        $this.find('.badge').text('');

        $this.siblings('.active')
            .removeClass('active');

        $this.toggleClass('active')

        $('.util-box')
            .children()
            .not(divToShow)
            .removeClass('active');

        if (!divToShow.hasClass('active')) divToShow.addClass('active');
        else divToShow.removeClass('active').addClass('is-closed');
    });

    $('.util-content').click(function(e) {
        e.stopPropagation();
    });

    $('#filter-items input').click(function() {
        let values = [],
            tags,
            show;

        $('#filter-items input:checkbox:checked').each(function() {
            values.push($(this).val())
        });

        if(values.length) {
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
    
    $('#overall-wrapper').on('change', '#overall-league-select', function() {
        createLoader('#overall-patch-tables', 'Loading');
        $.ajax({
            type: 'GET',
            url: `/statistics/overall/${$(this).val()}`,
            success: function(res) {
                $('#overall-wrapper').html(res);
            }
        });
    });

    $('#overall-champs').on('change', '#overall-table-elo-select', function() {
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
    
    // User events
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
        $this = $(this)
        const postId = $this.attr('data-id');
        const likes = $this.siblings('.like-count').text();

        $.ajax({
            type: 'POST',
            url: '/post/like/'+postId,
            success: function(res) {
                $this.find('button').toggleClass('active');
                console.log(likes)
                console.log(res)
                $this.siblings('.like-count').text(Number(likes) + Number(res));
            },
            error: function(err) {
                errorAlert(err.responseText, 'center');
            }
        });
    });

    $('.actions-toggler').click(function() {
        $(this)
            .find('.actions')
            .toggle()
    });

    $('.action-toggler').blur(function() {
        $('.actions').hide();
    });
    $('.actions').blur(function() {
        $('.actions').hide();
    });

    $('.comment-toggler').click(function() {
        $(this)
            .parent()
            .parent()
            .find('.comment-form')
            .slideToggle()
            .find('textarea')
            .focus()
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

    // Messages
    
    // Inbox nav
    $('#inbox-controls > div').click(function(e) {
        $this = $(this);

        if (!$this.hasClass('active')) {
            const divToShow = $(this).data('link');

            $('#inbox-controls .active').removeClass('active');
            $this.addClass('active');
            
            $('#inbox-msg-wrapper > div:visible').hide(0, () => $(`#${divToShow}`).fadeIn());
        }
    });

    // Send msg
    $('#message-form').submit(function(e) {
        e.preventDefault();
        $this = $(this);
        const userId = $this.data('id');

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
            }
        });
    });

    // Reply msg
    $('.reply-msg').click(function() {
        console.log('clicked');
        const userId = $(this).data('id');
        const username = $(this).data('username');
        console.log(userId, username);
    });

    // Toggle Bookmark Msg
    $('.bookmark-msg').click(function() {
        const msgId = $(this).data('id');
        const msgEle = $(`#${msgId}`);
        msgEle.find('.bookmark-msg').toggleClass('active');

        $.ajax({
            type: 'PATCH',
            url: `/message/bookmark/${msgId}`,
            success: function(bookmark) {
                if (bookmark) msgEle.clone(true, true).appendTo('#inbox-bookmark');
                else $(`#inbox-bookmark #${msgId}`).fadeOut(200);
                
            },
            error: function(err) {
                msgEle.find('.bookmark-msg').toggleClass('active');
                errorAlert(err.responseText, 'center')
            }
        });
    });

    // toggle self bookmark msg
    $('.self-bookmark-msg').click(function() {
        const msgId = $(this).data('id');
        const msgEle = $(`#${msgId}`);
        msgEle.find('.self-bookmark-msg').toggleClass('active');

        $.ajax({
            type: 'PATCH',
            url: `/message/bookmark/self/${msgId}`,
            success: function(bookmark) {
                if (bookmark) msgEle.clone(true, true).appendTo('#inbox-bookmark');
                else $(`#inbox-bookmark #${msgId}`).fadeOut(200);
                
            },
            error: function(err) {
                msgEle.find('.self-bookmark-msg').toggleClass('active');
                errorAlert(err.responseText, 'center')
            }
        });
    });

    // move msg to trash
    $('.move-to-trash').click(function() {
        const msgId = $(this).data('id');

        $.ajax({
            type: 'PATCH',
            url: `/message/moveToTrash/${msgId}`,
            success: function(res) {
                successAlert('success', 'center', 'fa fa-comment');
            },
            error: function(err) {
                errorAlert(err.responseText, 'center')
            },
            complete: function() {
            }
        });
    });

    // delete msg
    $('.delete-msg').click(function() {
        const msgId = $(this).data('id');

        $.ajax({
            type: 'PATCH',
            url: `/message/${msgId}`,
            success: function(res) {
                successAlert('success', 'center', 'fa fa-comment');
            },
            error: function(err) {
                errorAlert(err.responseText, 'center')
            },
            complete: function() {
            }
        });
    });

    // report msg
    $('.report-msg').click(function() {
        console.log('clicked');
        const msgId = $(this).data('id');
        console.log(msgId);
        
    });

    // messages end
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

    

    $('.remove-feedback').click(() => {
        $('#feedback-wrapper, .feedback-btns').remove();
    });
    
    $('.feedback-btn, .close-feedback').click(function() {
        $('#feedback-wrapper').toggleClass('d-none');
        $('#feedback-form textarea').focus();
    });

    // User events end

    // Observables
    $('#scroll-top').click(() => {
        setTimeout(() => $('#scroll-top').css({'display': 'none'}), 200);
        $("html, body").animate({ scrollTop: 0 }, 200, 'easeOutCubic')
    });

    throttle$('#selected-region', 'click', 500)
        .subscribe(() => {
            const $this = $('#regions-wrapper');
            const RS = $('#region-select');
            if (RS.hasClass('bounceInDown')) {
                RS.animateCss('bounceOutUp', () => {
                    $this.toggle();
                    RS.removeClass('bounceInDown');
                });
            } else {
                $this.toggle();
                RS.addClass('bounceInDown')
                    .removeClass('bounceOutUp');
            }
        });

    Rx.Observable.fromEvent(document, 'scroll')
        .throttleTime(300)
        .subscribe(() => {
            $(this).scrollTop() > 500 ? 
                $('#scroll-top').css({'display': 'block'}) :
                $('#scroll-top').css({'display': 'none'});
        });

    // Observables End
});

function throttle$(el, event, time=1000) {
    const element = document.querySelector(el);
    const eventObserver = Rx.Observable.fromEvent(element, event);
    return eventObserver.throttleTime(time).map(e => e);
}

function debounce$(el, event, time=1000) {
    const element = document.querySelector(el);
    const eventObserver = Rx.Observable.fromEvent(element, event);
    return eventObserver.debounceTime(time).map(e => e);
}

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

function errorAlert(message, position, overlay=true) {
    iziToast.show({
        titleColor: 'red',
        iconColor: 'red',
        icon: 'fa fa-exclamation-triangle',
        title: 'Error: ',
        message,
        position,
        overlay,
        overlayClose: overlay,
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

$.fn.extend({
    animateCss: function(animationName, callback) {
        const animationEnd = (function(el) {
            const animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (const t in animations) {
                if (el.style[t] !== undefined) {
                    return animations[t];
                }
        }})(document.createElement('div'));

        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);

            if (typeof callback === 'function') callback();
        });

        return this;
    },
});

jQuery.each(jQuery('textarea[data-autoresize]'), function() {
    const offset = this.offsetHeight - this.clientHeight;

    const resizeTextarea = function(el) {
        jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset + 2);
    };
    jQuery(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
});