// AJAX Load Components
// -----------------------------
$('#header').load('components/header.html');
$('#footer').load('components/footer.html');
$('#modal').load('components/modal.html');

$(document).ready(function () {
    $(document).ajaxComplete(function () {

        // Sticky
        // -----------------------------
        $("#menu").sticky();

        if ($('#banner').length) {
            $(function() {
                var windowH = $(window).height();
                var bannerH = $('#banner').height();
                if (windowH > bannerH) {
                    $('#banner').css({'height': ($(window).height() - 68) + 'px'});
                    $('#bannertext').css({'height': ($(window).height() - 68) + 'px'});
                }
                $(window).resize(function () {
                    var windowH = $(window).height();
                    var bannerH = $('#banner').height();
                    var differenceH = windowH - bannerH;
                    var newH = bannerH + differenceH;
                    var truecontentH = $('#bannertext').height();
                    if (windowH < truecontentH) {
                        $('#banner').css({'height': (newH - 68) + 'px'});
                        $('#bannertext').css({'height': (newH - 68) + 'px'});
                    }
                    if (windowH > truecontentH) {
                        $('#banner').css({'height': (newH - 68) + 'px'});
                        $('#bannertext').css({'height': (newH - 68) + 'px'});
                    }
                })
            });
        }

        // Modal
        // -----------------------------
        $('#modal [type="submit"]').on('click', function() {
            $('#modal .close').click();
        })
    });
});

// Smooth Scrolling
// -----------------------------
$('a.page-scroll').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
        $('html,body').animate({
            scrollTop: target.offset().top
        }, 1000);
        return false;
        }
    }
});

// Tumblr
// -----------------------------
if ($('#blog').length) {
    function loadPosts() {
        var key = "api_key=USV2JcShmHgoYysSrXKL1OyzmouVcG3PxCtAJ0OT8rGkSkuGNR";
        var api = "https://api.tumblr.com/v2/blog/c4ministry.tumblr.com/";
        var retrieve_more = function(offset) {
            $.getJSON(api + "posts/text?callback=?&filter=text&offset=" + offset + "&" + key,function(data) {
                $.each(data.response.posts, function(i, item) {
                    moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
                    var date = new Date(item.date).toISOString();
                    var momentDate = moment(date).tz('America/Los_Angeles').format('MMMM Do, YYYY');
                    var postUrl = item.post_url;
                    var title = item.title;
                    var body = item.body;
                    $("#tumblr").append('<li>' +
                        '<h3><a href="' + postUrl + '" target="blank">' + title + '</a></h3>' +
                        '<p class="title">' + 'Pastor DP - ' + '<em>' + momentDate + '</em></p>' +
                        '<p class="body">' + body.substring(0,500) + '...' + '</p>' +
                        '<p><a class="btn btn-info" href="' + postUrl + '" target="blank">' + 'Read More' + '</a></p>' +
                    '</li>')
                });
            });
        };
        retrieve_more(0);
    }
}

// MixCloud
// -----------------------------
if ($('#sermon').length) {
    $(document).ready(function() {
        $.ajax({
            type: 'GET',
            url: encodeURI('https://api.mixcloud.com/c4ministry/cloudcasts'),
            dataType: 'jsonp',
            success: function(response) {
                var slugArray = [];

                for (var i = 0; i < response.data.length; i++) {
                    slugArray.push(response.data[i].slug);
                }
                
                $('#mixcloud-embed').html('<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=%2Fc4ministry%2F" + response.data[i].slug + "%2F" frameborder="0"></iframe>')

                $.each(slugArray, function(i, slug) {
                    $.ajax({
                        type: 'GET',
                        url: encodeURI('https://api.mixcloud.com/c4ministry/' + slug),
                        dataType: 'jsonp',
                        success: function(response) {
                            var date = "Date: ";
                            var scripture = "Scripture: ";
                            var speaker = "Speaker: ";
                            var videosMax = 20;

                            var des = response.description;
                            var desDate = des.substring(des.indexOf(date) + date.length, des.indexOf("| " + scripture));
                            var desScripture = des.substring(des.indexOf(scripture) + scripture.length, des.indexOf("| " + speaker));
                            var desSpeaker = des.substring(des.indexOf(speaker) + speaker.length);
                
                            var html = '<tr>';
                            html += '<td>' + desDate + '</td>'
                            html += '<td><a target="_blank" class="sermon" href="' + response.url + '">' + response.name + '</a></td>';
                            html += '<td><a target="_blank" href="' + 'http://www.biblegateway.com/passage/?search=' + desScripture + '">' + desScripture + '</a></td>'
                            html += '<td>' + desSpeaker + '</td>'
                            html += '</tr>'
                            $('#mixcloud-table tbody').append(html);
                        }
                    });
                });
                
                $('#mixcloud-table').DataTable();
            }
        });
    });
}

// Vimeo
// -----------------------------
// if ($('#vimeo').length) {
//     var apiEndpoint = 'http://vimeo.com/api/v2/';
//     var vimeoUsername = 'c4ministry';
//     var videosCallback = 'setupGallery';
//     var oEmbedEndpoint = 'http://vimeo.com/api/oembed.json'
//     var oEmbedCallback = 'switchVideo';

//     // Get the user's videos
//     $(document).ready(function() {
//         $.getScript(apiEndpoint + vimeoUsername + '/videos.json?callback=' + videosCallback);
//     });

//     function getVideo(url) {
//         $.getScript(oEmbedEndpoint + '?url=' + url + '&callback=' + oEmbedCallback);
//     }

//     function setupGallery(videos) {
//         // Load the first video
//         getVideo(videos[0].url);

//         var date = "Date: ";
//         var scripture = "Scripture: ";
//         var speaker = "Speaker: ";
//         var videosMax = 12;

//         // Add the videos list to table
//         for (var i = 0; i < videosMax; i++) {
//             var des = videos[i].description; // Date: yyyy-mm-dd, Scripture: Romans 8:14-17, Speaker: Pastor Daniel Park
//             var desDate = des.substring(des.indexOf(date) + date.length, des.indexOf(", " + scripture));
//             var desScripture = des.substring(des.indexOf(scripture) + scripture.length, des.indexOf(", " + speaker));
//             var desSpeaker = des.substring(des.indexOf(speaker) + speaker.length);

//             var html = '<tr>';
//             html += '<td>' + desDate + '</td>'
//             html += '<td><a class="sermon" href="' + videos[i].url + '">' + videos[i].title + '</a></td>';
//             html += '<td><a target="_blank" href="' + 'http://www.biblegateway.com/passage/?search=' + desScripture + '">' + desScripture + '</a></td>'
//             html += '<td>' + desSpeaker + '</td>'
//             html += '</tr>'
//             $('#vimeo-table tbody').append(html);

//             // See more link beyond last element in array
//             if (i === videosMax - 1) {
//                 var htmlUrl = '<a href="https://vimeo.com/c4ministry/videos/page:2/sort:date">';
//                 htmlUrl += 'Hear more sermons before ' + desDate + '</a>';
//                 $('#see-more').append(htmlUrl);
//             }
//         }

//         // Switch to the video when a thumbnail is clicked
//         $('#vimeo-table a.sermon').click(function(event) {
//             event.preventDefault();
//             getVideo(this.href + '&autoplay=true');
//             return false;
//         });
//     }

//     function switchVideo(video) {
//         $('#embed').html(unescape(video.html));
//     }
// }

// Cleanup Table
// -----------------------------
if ($('.cleanup').length) {
    var cleanupDatesArray = $('.cleanup table tr td.cleanup-date');
    var cleanupStatusArray = $('.cleanup table tr td.cleanup-status')
    $.each(cleanupDatesArray, function() {
        var dateText = $(this).text();
        if (new Date(dateText) < new Date()) {
            $(this).siblings('.cleanup-status').addClass('success').text('COMPLETED');
        } else {
            $(this).siblings('.cleanup-status').addClass('warning').text('PENDING');
        }
    });

    $('.cleanup-status.warning').first()
        .removeClass('warning')
        .html('<a class="page-scroll" href="#cleanup">CLEANUP INSTRUCTIONS</a>')
        .parent().addClass('danger');
}

// Events Calendar
// -----------------------------
var API_KEY = 'AIzaSyClI00QamBabQuqnt-FLGHkXbOHZVI5NGY';
var calendarId = '0rm2tpg2mag9k28obk2b2dein4@group.calendar.google.com';

$.ajax({
    type: 'GET',
    url: encodeURI('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?key=' + API_KEY),
    dataType: 'json',
    success: function (response) {
        // console.log(response);
    },
    error: function (error) {
        // console.log(error);
    }
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// Google Analytics
// -----------------------------
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-53415604-2', 'auto');
ga('send', 'pageview');
