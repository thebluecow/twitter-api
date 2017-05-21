// JavaScript Document

// From stackoverflow: http://stackoverflow.com/questions/6549223/javascript-code-to-display-twitter-created-at-as-xxxx-ago

function parseTwitterDate(tdate) {
    let system_date = new Date(Date.parse(tdate));
    let user_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    let diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return system_date.toString().substring(0, 24);
}

// from http://widgets.twimg.com/j/1/widget.js
let K = function () {
    let a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();

// sets the time to a more readable format.
$('.app--tweet--timestamp, .app--message--timestamp').each( function(index, value) {
	
	$(this).html(parseTwitterDate($(this).html()));
	
});

// tweets when the 'Tweet' button is clicked.
$('button.button-primary').click(function() {
	if ($('#tweet-textarea').val().length > 0) {
		// build a json object or do something with the form, store in data
		let data = { message: $('#tweet-textarea').val() };
		
		// post to 'tweet' url, which is used only by app
		$.post('/tweet', data, function(resp) {
            // do something when it was successful
			window.location.replace('/');
        });
	}
});

$("#tweet-textarea").on('keyup', function(event) {
	let twitterMax = 140 - $('#tweet-textarea').val().length;
	$('#tweet-char').html(twitterMax.toString());
	
	twitterMax < 0 ? $('#tweet-char').addClass('over-max') : $('#tweet-char').removeClass('over-max');
});