$(function() {
    
    $('.lb-summoner').on('click', function() {
        window.location = `/summoner?userName=${$(this).text()}&region=${location.href.slice(location.href.lastIndexOf('=')+1)}`
    })

    $('.fa-search').click( () => $('#navbar-search-form').submit());

    $('a[href="' + window.location.href + '"]').addClass('current')

    $(".icon-arrow-up2").click(function() {
        $("html, body").animate({ scrollTop: 0 }, 1000, 'easeInOutCubic');
        return false;
      });

    $(document).scroll(function() {
        $(this).scrollTop() > 200 ? $('.icon-arrow-up2').fadeIn() : $('.icon-arrow-up2').fadeOut()
    });
    
    $('.delete-post').click(function() {
        const postId = $(this).attr('data-id')

        $.ajax({
            type: 'DELETE',
            url: '/post/'+postId,
            success: function(res) {
                console.log(res)
                window.location.href = '/profile'
            },
            error: function(err) {
                alert(err)
            }
        })
    })

    $('.like-post').click(function() {
        const postId = $(this).attr('data-id')
        let likes = $(this).text()

        $.ajax({
            type: 'POST',
            url: '/post/like/'+postId,
            success: function(res) {
                $(`#${postId} .like-post`).text(++likes)
            },
            error: function(err) {
                alert(err)
            }
        })
    })

    $('.send-friend-request').click(function() {
        const userId = $(this).attr('data-id')

        $.ajax({
            type: 'POST',
            url: 'users/sendFriendRequest/'+userId,
            success: function(res) {
                $(`[data-id=${res}]`).replaceWith($('<a>').addClass('btn btn-warning').html('Pending'))
            },
            error: function(err) {
                alert(err)
            }
        })
    })

    $('.decline-friend-request').click(function() {
        const userId = $(this).attr('data-id')

        $.ajax({
            type: 'POST',
            url: 'users/declineFriendRequest/'+userId,
            success: function(res) {
                $(`#${res}`).remove()
            },
            error: function(err) {
                alert(err)
            }
        })
    })

    $('.accept-friend-request').click(function() {
        const userId = $(this).attr('data-id')

        $.ajax({
            type: 'POST',
            url: 'users/acceptFriendRequest/'+userId,
            success: function(res) {
                $(`#${res}`).remove()
            },
            error: function(err) {
                alert(err)
            }
        })
    })
    


    $('#makeUsers').click( () => {
        $.ajax({
            type: 'GET',
            url: '/makeUsers'
        })
    })

    $('#clearDB').click( () => {
        $.ajax({
            type: 'GET',
            url: '/clearDB'
        })
    })

});

