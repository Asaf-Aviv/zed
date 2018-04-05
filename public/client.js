$(function() {
    fixPopover();
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

    $('#spectate').click(function() {
        const gameId = $(this).attr('data-id');
        $.ajax({
            type: 'GET',
            url: `/spectate/${gameId}`,
            success: function(res) {
                window.open(window.location + `/${gameId}.bat`)
            },
            error: function(err) {
                alert(err);
            }
        });
    });

    $('#makeUsers').click( () => {
        $.ajax({
            type: 'GET',
            url: '/makeUsers'
        });
    });

    $('#clearDB').click( () => {
        $.ajax({
            type: 'GET',
            url: '/clearDB'
        });
    });
});


function fixPopover() {
    $('[data-trigger="manual"]').click(function(e) {
        $(this).popover('toggle');
        e.preventDefault();
    }).blur(function() {
        $(this).popover('hide');
        // e.preventDefault();
    });
}