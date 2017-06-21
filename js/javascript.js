/* globals $, SC */

var audio;
var playlist = [];
// Set a a gloabl var currentTrackID...
var currentTrackId;

	SC.initialize({
		client_id: 'fd4e76fc67798bfa742089ed619084a6',
	});

// Hide Pause Initially
$('#pause').hide();

// Gets the current playlist
function getPlaylist() {
	return playlist;
}

// Sets the current playlist
function setPlaylist(p) {
	playlist = p;
}

// Play function that accepts an ID.
function play(id) {
	SC.stream('/tracks/' + id).then(function(player) {
		player.play();
	});

	currentTrackId = id;
}

// Search Function and renders the playlist.
function search(searchTerm) {
	SC.get('/tracks', {
		q: searchTerm,
	}).then(function(tracks) {
		playlist = tracks;
		renderPlaylist(tracks);
		play(playlist[0].id); // this is just for testing it should be removed
	});
}
// Add the ability to search
document.addEventListener("DOMContentLoaded", function(event) {
	var input = document.getElementById('searchInput');
	input.addEventListener('keyup', function(evt) {
		search(input.value);
	});
});


function renderPlaylist() {
	$('#playlist').html('');
// Looping over the array of songs.
	getPlaylist().forEach(function(item) {
		var li = $('<li>')
			.attr('song', item.song)
			.attr('cover', item.artwork_url)
			.attr('artist', item.genre)
						 .attr('id', item.id)
// Adding an event listener on the <li>.
// 1. add ID to the newly created li
// 2. add a click event to that same li calling the play function with that ID
						 .click(function(id) {
							 play(li.attr('id'));
						 })
			.text(item.genre);
		$('#playlist').append(li);
	});
}
// renderPlaylist();



// Initialize - Play First Song
initAudio($('#playlist li:first-child'));


// Initializer Function
function initAudio(element) {
	var song = element.attr('song');
	var title = element.text();
	var cover = element.attr('cover');
	var artist = element.attr('artist');

// Create a New Audio Object instance.
	audio = new Audio('songs/' + song);

// If song is not playing then duration starts at 0.00
	if (!audio.currentTime) {
		$('#duration').html('0.00');
	}
// Prints title and Artist to player.
	$('#audio-player .title').text(title);
	$('#audio-player .artist').text(artist);

// Insert Cover Image
	$('img.cover').attr('src','img/' + cover);
	$('#playlist li').removeClass('active');
	element.addClass('active');
}

// Play Button
$('#play').click(function() {
	play(currentTrackId);
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	showDuration();
});

// Pause Button
$('#pause').click(function() {
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});

// Stop Button
$('#stop').click(function() {
	audio.pause();
	audio.currentTime = 0;
	$('#pause').hide();
	$('#play').show();
	$('#duration').fadeOut(400);
});

// Next Button
$('#next').click(function() {
	audio.pause();
	var next = $('#playlist li.active').next();
	if (next.length === 0) {
		next = $('#playlist li:first-child');
	}
	initAudio(next);
	play(currentTrackId);
	showDuration();
});

// Prev Button
$('#prev').click(function() {
	audio.pause();
	var prev = $('#playlist li.active').prev();
	if (prev.length === 0) {
		prev = $('#playlist li:last-child');
	}
	initAudio(prev);
	play(currentTrackId);
	showDuration();
});

// Playlist Song Click
$('#playlist li').click(function() {
	audio.pause();
	initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	play(currentTrackId);
	showDuration();
});

// Volume Control
$('#volume').change(function() {
	audio.volume = parseFloat(this.value / 10);
});

// Time Duration
function showDuration() {
	$(audio).bind('timeupdate', function() {
		// Get hours and minutes
		var seconds = parseInt(audio.currentTime % 60);
		var minutes = parseInt((audio.currentTime / 60) % 60);
		// Add 0 if seconds less than 10
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		$('#duration').html(minutes + '.' + seconds);
		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		$('#progress').css('width', value + '%');
	});
}
search("David Bowie");
