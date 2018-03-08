/* globals $, SC */

var audio;
var playlist = [];
var currentTrackId = 0;
var currentTrackIndex = 0;
var player;

SC.initialize	({
	client_id: 'ebe2d1362a92fc057ac484fcfb265049',
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
	if (!id) {
	id = playlist[currentTrackIndex].id;
	}

	SC.stream('/tracks/' + id).then(function(p) {
		player = p;
		player.play();
		$('img.cover').attr('src', playlist[currentTrackIndex].artwork_url);
		$('#audio-player .title').text(playlist[currentTrackIndex].title);
	});
	currentTrackId = id;
} // end play

function pause() {
	player.pause();
}

function prev() {
	currentTrackIndex = currentTrackIndex - 1;
	if (this.currentTrackIndex < 0) {
			this.currentTrackIndex = this.playlist.length - 1;
	}
	play(playlist[currentTrackIndex].id);
	console.log(playlist[currentTrackIndex]);
}

function next() {
	currentTrackIndex = currentTrackIndex + 1;
	if (this.currentTrackIndex > this.playlist.length - 1) {
			this.currentTrackIndex = 0;
	}
	play(playlist[currentTrackIndex].id);
	console.log(playlist[currentTrackIndex]);
}

function playFirstTrack() {
	play(playlist[0].id); // plays the first song.
}

 // Search Function and renders the playlist.
function search(searchTerm) {
	SC.get('/tracks', {
		q: searchTerm,
	}).then(function(tracks) {
		playlist = tracks;
		renderPlaylist(tracks);
		playFirstTrack(); // plays the first song.
	});
}
// Add the ability to search
document.addEventListener("DOMContentLoaded", function(event) {
	var input = document.getElementById('searchInput');
	input.addEventListener('keyup', function(evt) {
		search(input.value);
	});
});

// Adding an event listener on the <li>.
// 1. add ID to the newly created li
// 2. add a click event to that same li calling the play function with that ID
// Looping over the array of songs.
function renderPlaylist() {
	$('#playlist li').html('');

	getPlaylist().forEach(function(item) {
		var element;
		var li = $('<li>')
			.attr('song', item.genre)
			.attr('cover', item.artwork_url)
			.attr('artist', item.title)
			.attr('id', item.id)
			.click(function(id) {
			$('#playlist li').removeClass("active");
			 play(li.attr('id'));
			 li.addClass("active");
		 })
			.text(item.genre)
			.text(item.title);
		$('#playlist').append(li);
	});
}

// Initialize - Play First Song
initAudio($('#playlist li:first-child'));

// Initializer Function
function initAudio(element) {
	var song = element.attr('song');
	var title = element.text();
	var cover = element.attr('cover');
	var artist = element.attr('artist');

// Create a New Audio Object instance.
	audio = new Audio(playlist);

// If song is not playing then duration starts at 0.00
	if (!audio.currentTime) {
		$('#duration').html('0.00');
	}


// Insert Cover Image
	$('img.cover').attr('src', cover);
	$('#playlist li').removeClass('active');
	element.addClass('active');
}

// Play Button
$('#play').click(function() {
	console.log("player is clicked");
	$('#play').hide();
	$('#pause').show();
	play();
	$('#duration').fadeIn(400);
});

// Pause Button
$('#pause').click(function() {
	console.log("pause is clicked");
	$('#pause').hide();
	$('#play').show();
	pause();
});

// Stop Button
$('#stop').click(function() {
	console.log("stop is clicked");
	$('#pause').hide();
	$('#play').show();
	$('#duration').fadeOut(400);
	pause();
});

// Next Button
$('#next').click(function(nextTrack) {
	console.log("next is clicked");
	next(nextTrack);
});

// Prev Button
$('#prev').click(function() {
	console.log("prev is clicked");
	prev();
});

// Playlist Song Click
$('#playlist li').click(function() {
	initAudio(this);
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	pause();
	play();
	showDuration();
});

// Volume Control
function setVolume() {
	$('#volume').change(function() {
		audio.volume = parseFloat(this.value / 10);
	});
	setVolume();
}
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
search("Prince");
