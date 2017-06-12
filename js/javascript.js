/* globals $ */
var audio;
var playlist = [
	{
		"song": "ActToo.mp3",
		"cover": "TheRoots.jpg",
		"artist": "The Roots",
	},
	{
		"song": "AintNobody.mp3",
		"cover": "ChakaKhan.jpg",
		"artist": "Chaka Khan",
	},
	{
		"song": "Ants.mp3",
		"cover": "Edit.jpg",
		"artist": "edIT",
	},
	{
		"song": "BabsUvulaWho.mp3",
		"cover": "GreenDay.jpg",
		"artist": "Green Day",
	},
	{
		"song": "Decimate.mp3",
		"cover": "Amalgamate.jpg",
		"artist": "Amaglamate",
	},
	{
		"song": "ForThoseAboutToRock.mp3",
		"cover": "ACDC.jpg",
		"artist": "ACDC",
	},
	{
		"song": "FunkinForJamaica.mp3",
		"cover": "TomBrowne.jpg",
		"artist": "Tom Browne",
	},
	{
		"song": "LongCoolWoman.mp3",
		"cover": "TheHollies.jpg",
		"artist": "The Hollies",
	},
	{
		"song": "RockYourBody.mp3",
		"cover": "JustinTimberlake.jpg",
		"artist": "Justin Timberlake",
	},
	{
		"song": "TheSpark.mp3",
		"cover": "TheRoots.jpg",
		"artist": "The Roots",
	},
];

// Hide Pause Initially
$('#pause').hide();


function getPlaylist() {
	return playlist;
}

function setPlaylist(p) {
	playlist = p;
}

function renderPlaylist() {
	$('#playlist').html('');
	getPlaylist().forEach(function(item) {
		var li = $('<li>')
			.attr('song', item.song)
			.attr('cover', item.cover)
			.attr('artist', item.artist)
			.text(item.song);
		$('#playlist').append(li);
	});
}

renderPlaylist();

// Initialize - Play First Song
initAudio($('#playlist li:first-child'));

function update() {

}


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
	audio.play();
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
	audio.play();
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
	audio.play();
	showDuration();
});

// Playlist Song Click
$('#playlist li').click(function() {
	audio.pause();
	initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	audio.play();
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
