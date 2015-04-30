function submitSong() {
	if (document.getElementById('submit_song_button_uploading').innerHTML == '') {
		var email_regx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if (!document.getElementById('submit_song_file').value) {
			document.getElementById('submit_song_button_error').innerHTML = "Please choose an MP3 file.";
		} else if (!document.getElementById('submit_song_title').value) {
			document.getElementById('submit_song_button_error').innerHTML = "Please enter a song title.";
		} else if (!document.getElementById('submit_song_artist').value) {
			document.getElementById('submit_song_button_error').innerHTML = "Please enter the artist(s).";
		} else if (!document.getElementById('submit_song_email').value) {
			document.getElementById('submit_song_button_error').innerHTML = "Please enter your email address.";
		} else if (!email_regx.test(document.getElementById('submit_song_email').value)) {
			document.getElementById('submit_song_button_error').innerHTML = "Please enter a valid email address.";
		} else {
			document.getElementById('submit_song_button_error').innerHTML = '';
			document.getElementById('submit_song_button_uploading').innerHTML = 'Uploading MP3 file<span id="ellipsis"></span>';
			setInterval('Ellipsis()', 618);
			return true;
		}
	}
	return false;
}

function Ellipsis()
{
	var ellipsis = document.getElementById('ellipsis').innerHTML + ".";
	if (ellipsis == "....") ellipsis = '';
	document.getElementById('ellipsis').innerHTML = ellipsis;
}
