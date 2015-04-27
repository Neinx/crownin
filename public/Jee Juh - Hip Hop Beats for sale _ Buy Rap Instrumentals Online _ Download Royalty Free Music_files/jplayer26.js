var currentSongID = 0;
var currentInit = '';
var currentHash = '';
var currentSlug = '';
var currentTitle = '';
var currentDuration = 0;
var currentBy = '';
var lastBuyMenu = 0;
var lastBuyButton;
var cart_items = new Array();
var cart_names = new Array();
var cart_amounts = new Array();
var gprice = 19.95;
var pprice = 39.95;
var dprice = 79.95;
var buy1get1free = false;
var hasflash = 1;

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(c){var a="";var k,h,f,j,g,e,d;var b=0;c=Base64._utf8_encode(c);while(b<c.length){k=c.charCodeAt(b++);h=c.charCodeAt(b++);f=c.charCodeAt(b++);j=k>>2;g=((k&3)<<4)|(h>>4);e=((h&15)<<2)|(f>>6);d=f&63;if(isNaN(h)){e=d=64}else{if(isNaN(f)){d=64}}a=a+this._keyStr.charAt(j)+this._keyStr.charAt(g)+this._keyStr.charAt(e)+this._keyStr.charAt(d)}return a},decode:function(c){var a="";var k,h,f;var j,g,e,d;var b=0;c=c.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(b<c.length){j=this._keyStr.indexOf(c.charAt(b++));g=this._keyStr.indexOf(c.charAt(b++));e=this._keyStr.indexOf(c.charAt(b++));d=this._keyStr.indexOf(c.charAt(b++));k=(j<<2)|(g>>4);h=((g&15)<<4)|(e>>2);f=((e&3)<<6)|d;a=a+String.fromCharCode(k);if(e!=64){a=a+String.fromCharCode(h)}if(d!=64){a=a+String.fromCharCode(f)}}a=Base64._utf8_decode(a);return a},_utf8_encode:function(b){b=b.replace(/\r\n/g,"\n");var a="";for(var e=0;e<b.length;e++){var d=b.charCodeAt(e);if(d<128){a+=String.fromCharCode(d)}else{if((d>127)&&(d<2048)){a+=String.fromCharCode((d>>6)|192);a+=String.fromCharCode((d&63)|128)}else{a+=String.fromCharCode((d>>12)|224);a+=String.fromCharCode(((d>>6)&63)|128);a+=String.fromCharCode((d&63)|128)}}}return a},_utf8_decode:function(a){var b="";var d=0;var e=c1=c2=0;while(d<a.length){e=a.charCodeAt(d);if(e<128){b+=String.fromCharCode(e);d++}else{if((e>191)&&(e<224)){c2=a.charCodeAt(d+1);b+=String.fromCharCode(((e&31)<<6)|(c2&63));d+=2}else{c2=a.charCodeAt(d+1);c3=a.charCodeAt(d+2);b+=String.fromCharCode(((e&15)<<12)|((c2&63)<<6)|(c3&63));d+=3}}}return b}};
var jsAudio;
var jsTemp;
var jsDuration;
var jsSongID = 0;
var jsIsPaused;
var jsIsSoundLoaded = 0;
var jsPausePosition = 0;
var jsTrackWidth = 214;
var jsCurrentVolume = 1;
var jsCurrentLoading = 0;

function debugg(str) {
	//document.getElementById('debugg').innerHTML += str + '<br /><br />';
}

function jsStopSong() {
	jsPauseSong();
	jsPausePosition = 0;
	jsIsSoundLoaded = false;
}

function jsPauseSong() {
	jsPausePosition = jsAudio.currentTime;
	jsAudio.pause();
	jsIsPaused = true;
}

function jsPlaySong() {
	if (!jsIsSoundLoaded) {
		//jsAudio.innerHTML = '<source src="/test/test.mp3" type="audio/mpeg">';
		jsAudio.innerHTML = '<source src="/temphandler/' + jsTemp + '.mp3" type="audio/mpeg">';
		jsAudio.addEventListener("progress", jsProgress);
		jsAudio.addEventListener("suspend", jsSuspend);
		jsAudio.addEventListener("timeupdate", jsTimeUpdate);
		jsAudio.addEventListener("ended", jsEnded);
		
		jsIsStreaming = true;
		jsAudio.load();
		jsIsSoundLoaded = true;
		songLoaded = true;
	} else {
		jsAudio.currentTime = jsPausePosition;
	}
	jsAudio.play();
	jsAudio.volume = jsCurrentVolume;
	jsIsPaused = false;
}

function jsProgress() {
	jsCurrentLoading = jsAudio.readyState ? Math.min(jsTrackWidth, Math.floor(jsTrackWidth * jsAudio.buffered.end(0) / 100)) : 0;
	sendToJavaScript('loading.' + jsSongID + '.' + jsCurrentLoading);
}

function jsSuspend() {
	jsCurrentLoading = jsTrackWidth;
	sendToJavaScript('loading.' + jsSongID + '.' + jsCurrentLoading);
	jsIsStreaming = false;
}

function jsTimeUpdate() {
	sendToJavaScript('blue.' + jsSongID + '.' + (jsTrackWidth * jsAudio.currentTime / (jsAudio.duration > 0 && jsAudio.duration < 99999 ? jsAudio.duration : currentDuration)));
	sendToJavaScript('time.' + jsSongID + '.' + Math.floor(jsAudio.currentTime / 60) + ':' + (Math.floor(jsAudio.currentTime % 60) < 10 ? '0' : '') + Math.floor(jsAudio.currentTime % 60));
}

function jsEnded() {
	jsIsPaused = true;
	jsPausePosition = 0;
	sendToJavaScript('complete');
}

function noFlash(var1, var2) {
	if (var1 == 'play' || var1 == 'playfromtop') {
		var2split = Base64.decode(var2).split('|');
		if (jsSongID != var2split[0]) {
			if (jsIsSoundLoaded) jsStopSong();
			jsSongID = var2split[0];
			jsTemp = var2;
		}
		if (var1 == 'playfromtop') jsPausePosition = 0;
		jsPlaySong();
	} else if (var1 == 'pause') {
		jsPauseSong();
	} else if (var1 == 'track') {
		jsPausePosition = var2 / jsTrackWidth * (jsAudio.duration > 0 && jsAudio.duration < 99999 ? jsAudio.duration : currentDuration);
		if (!jsIsPaused) jsPlaySong();
	} else if (var1 == 'vol') {
		jsCurrentVolume = var2 / 64;
		jsAudio.volume = jsCurrentVolume;
	}
}

function playlistClick(mouseEvent) {
	var eventTarget;
	if (!mouseEvent) mouseEvent = window.event;
	if (mouseEvent.target) eventTarget = mouseEvent.target;
	else if (mouseEvent.srcElement) eventTarget = mouseEvent.srcElement;
	
	if (eventTarget.parentNode.tagName == "TR") eventTR = eventTarget.parentNode;
	else if (eventTarget.parentNode.parentNode.tagName == "TR") eventTR = eventTarget.parentNode.parentNode;
	else if (eventTarget.parentNode.parentNode.parentNode.tagName == "TR") eventTR = eventTarget.parentNode.parentNode.parentNode;

	if (eventTarget.tagName == "INPUT") {
		var songInfo = eventTR.id.split('|');
		var itemid = eventTarget.className.charAt(0) + songInfo[0];
		var itempack = itemid.substring(0,1);
		var itemsongid = itemid.substring(1);
		if (hasClassName(eventTarget, 'exclusive')) {
			var itemprice = Number(songInfo[7]);
			var itemname = songInfo[1] + ' (Exclusive Rights)';
		} else {
			var itemprice = hasClassName(eventTarget, 'half_off') ? (eventTarget.className.charAt(0) == 'G' ? 9.95 : (eventTarget.className.charAt(0) == 'P' ? 19.95 : 39.95)) : (eventTarget.className.charAt(0) == 'G' ? gprice : (eventTarget.className.charAt(0) == 'P' ? pprice : dprice));
			var itemname = songInfo[1] + ' (' + (eventTarget.className.charAt(0) == 'G' ? 'MP3 file' : (eventTarget.className.charAt(0) == 'P' ? 'WAV file' : 'Tracked Out')) + ')';
		}
		if (cart_items.indexOf(itemid) != -1) {
			cart_names.splice(cart_items.indexOf(itemid), 1);
			cart_amounts.splice(cart_items.indexOf(itemid), 1);
			cart_items.splice(cart_items.indexOf(itemid), 1);
		} else {
			for (i=0; i<3; i++) {
				var ipack = (i == 0) ? "G" : ((i == 1) ? "P" : "D");
				if (cart_items.indexOf(ipack+itemsongid) != -1) {
					if (document.getElementById(ipack+'_check_'+itemsongid)) document.getElementById(ipack+'_check_'+itemsongid).checked = false;
					if (cart_items.indexOf(ipack+itemsongid) != -1) {
						cart_names.splice(cart_items.indexOf(ipack+itemsongid), 1);
						cart_amounts.splice(cart_items.indexOf(ipack+itemsongid), 1);
						cart_items.splice(cart_items.indexOf(ipack+itemsongid), 1);
					}
				}
			}
			cart_names.push(itemname);
			cart_amounts.push(itemprice.toFixed(2));
			cart_items.push(itemid);
		}
		updateCart();
	} else if (eventTarget.tagName != "A") {
		if (currentFound[currentLibrary] > 0) removeClassName(document.getElementById('jprev'), 'disabled');
		else addClassName(document.getElementById('jprev'), 'disabled');
		if (currentFound[currentLibrary] > 1) removeClassName(document.getElementById('jnext'), 'disabled');
		else addClassName(document.getElementById('jnext'), 'disabled');
		playEventTR(1);
	}
}

function initializeCart() {
	var tbody = document.getElementById('tbody1');
	for (var i=0; i<tbody.rows.length; i++) {
		var songInfo = tbody.rows[i].id.split('|');
		if (document.getElementById('G_check_'+songInfo[0]) && document.getElementById('G_check_'+songInfo[0]).checked) {
			cart_names.push(songInfo[1] + ' (MP3 file)');
			cart_amounts.push(gprice);
			cart_items.push('G'+songInfo[0]);
		} else if (document.getElementById('P_check_'+songInfo[0]) && document.getElementById('P_check_'+songInfo[0]).checked) {
			cart_names.push(songInfo[1] + ' (WAV file)');
			cart_amounts.push(pprice);
			cart_items.push('P'+songInfo[0]);
		} else if (document.getElementById('D_check_'+songInfo[0]) && document.getElementById('D_check_'+songInfo[0]).checked) {
			cart_names.push(songInfo[1] + ' (Tracked Out)');
			cart_amounts.push(dprice);
			cart_items.push('D'+songInfo[0]);
		}
		updateCart();
	}
}

function updateCart() {
	var cart_beats = 0;
	var cart_total = 0;
	var paypal_items = '';
	for (i=0; i < cart_items.length; i++) {
		cart_beats += 1;
		cart_total += Number(cart_amounts[i]);
		paypal_items += '<input type="hidden" name="item_name_' + (i+1) + '" value="' + cart_names[i] + '">';
		paypal_items += '<input type="hidden" name="amount_' + (i+1) + '" value="' + cart_amounts[i] + '">';
	}
	paypal_items += '<input type="hidden" name="custom" value="0|' + document.getElementById("jshopping_cart_ipaddress").value + '|' + cart_items.toString().replace(/,/g, "|") + '">';
	var jcart = 'Items Selected: ' + cart_beats + ' beat' + (cart_beats == 1 ? '' : 's') + ' ($' + addCommas(cart_total.toFixed(2)) + ')';
	var num_free = 0;
	if (buy1get1free) {
		num_free = cart_beats;
	} else {

    // NEW BULK DEALS
    if (cart_beats > 2 && document.getElementById("page").value == 'index') {
      num_free = cart_beats >= 10 ? cart_beats : (cart_beats >= 7 ? 6 : (cart_beats >= 5 ? 4 : 2));
    }

    // OLD BULK DEALS
    // if (cart_beats > 2 && document.getElementById("page").value == 'index') {
    //   if (cart_beats < 5) {
    //     num_free = 1;
    //   } else if (cart_beats < 7) {
    //     num_free = 2;
    //   } else if (cart_beats < 10) {
    //     num_free = 3;
    //   } else {
    //     num_free = Math.floor(cart_beats / 2);
    //   }
    // }

	}
	if (num_free > 0) {
		if (buy1get1free) {
			jcart += '<br /><small>* Special Sale: Buy ' + cart_beats + ' get ' + num_free + ' free.<br />(Choose your ' + num_free +' free beat' + (num_free == 1 ? '' : 's') + ' after your purchase.)';
		} else {
			jcart += '<br /><small>* Special Bulk Deal: Buy ' + cart_beats + ' get ' + num_free + ' free.<br />(Choose your ' + num_free +' free beat' + (num_free == 1 ? '' : 's') + ' after your purchase.)';
		}
		document.getElementById("jcart").style.marginTop = '8px';
	} else {
		document.getElementById("jcart").style.marginTop = '25px';
	}
	document.getElementById("jcart").style.marginLeft = (cart_total >= 1000) ? '10px' : '24px';
	document.getElementById("jcart").innerHTML = jcart;
	document.getElementById("paypal_items").innerHTML = paypal_items;
}
window.onkeydown = function(e) {
	if (e.keyCode == 32 && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
		playClick();
		return false;
	}
	if (e.keyCode == 13 && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
		playEventTR(1);
		return false;
	}
//	if ((e.keyCode == 37 || e.keyCode == 38) && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
	if ((e.keyCode == 37) && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
		playlistNav('prev');
		return false;
	}
//	if ((e.keyCode == 39 || e.keyCode == 40) && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
	if ((e.keyCode == 39) && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
		playlistNav('next');
		return false;
	}
}

function playClick() {
	if (!hasClassName(document.getElementById('jplay'), 'playing')) {
		addClassName(document.getElementById('jplay'), 'playing');
		addClassName(document.getElementById('speaker_'+currentSongID), 'playing');
		document.getElementById('jtrack_click').style.cursor = "pointer";
		if (hasflash) callToActionscript('jeejuhplayer', 'play.'+currentHash);
		else noFlash('play', currentHash);
	} else {
		removeClassName(document.getElementById('jplay'), 'playing');
		removeClassName(document.getElementById('speaker_'+currentSongID), 'playing');
		currentInit = '';
		if (hasflash) callToActionscript('jeejuhplayer', 'pause');
		else noFlash('pause');
	}
}

var shuf = 0;
function shufClick() {
	if (!shuf) {
		addClassName(document.getElementById('jshuf'), 'on');
		shuf = 1;
	} else {
		removeClassName(document.getElementById('jshuf'), 'on');
		shuf = 0;
	}
}

var loop = 0;
function loopClick() {
	if (!loop) {
		addClassName(document.getElementById('jloop'), 'all');
		loop = 2;
	} else if (loop == 2) {
		removeClassName(document.getElementById('jloop'), 'all');
		addClassName(document.getElementById('jloop'), 'one');
		loop = 1;
	} else {
		removeClassName(document.getElementById('jloop'), 'one');
		loop = 0;
	}
}

function playlistNav(nav) {
	if (nav == "complete" && loop == 1) {
		if (hasflash) callToActionscript('jeejuhplayer', 'playfromtop.'+currentHash);
		else noFlash('playfromtop', currentHash);
	} else if (nav == "complete" && hasClassName(document.getElementById('jprev'), 'disabled')) {
		document.getElementById('jtrack_time').innerHTML = "0:00";
		document.getElementById('jtrack_blue').style.width = "0";
		document.getElementById('jtrack_head').style.left = "0";
		removeClassName(document.getElementById('jplay'), 'playing');
		removeClassName(document.getElementById('speaker_'+currentSongID), 'playing');
	} else if (nav == "complete" || !hasClassName(document.getElementById('j'+nav), 'disabled')) {
		var trow = 0;
		var tbody = currentTR.parentNode;
		if (currentTR.style.display != "none") {
			for (var i = 0; i < tbody.rows.length; i++) {
			    if (tbody.rows[i].id == currentTR.id) {
					trow = i;
					break;
				}
			}
		}
		var visiblerow = 0;
		while (visiblerow < 1 && visiblerow > -100000) {
			if (shuf) {
				eventTR = tbody.rows[Math.floor(Math.random()*tbody.rows.length)];
			} else if (nav == "prev") {
				trow = (trow == 0) ? tbody.rows.length - 1 : trow - 1;
				eventTR = tbody.rows[trow];
			} else if (nav == "next" || (nav == "complete" && (trow < tbody.rows.length - 1 || loop == 2))) {
				trow = (trow == tbody.rows.length - 1) ? 0 : trow + 1;
				eventTR = tbody.rows[trow];
			} else {
				document.getElementById('jtrack_time').innerHTML = "0:00";
				document.getElementById('jtrack_blue').style.width = "0";
				document.getElementById('jtrack_head').style.left = "0";
				removeClassName(document.getElementById('jplay'), 'playing');
				removeClassName(document.getElementById('speaker_'+currentSongID), 'playing');
				return;
			}
			if (eventTR.style.display != "none" && !(shuf && eventTR == currentTR && !hasClassName(document.getElementById('jnext'), 'disabled'))) visiblerow = 1;
			else visiblerow--;
		}
		if (visiblerow > 0) playEventTR();
	}
}

function beatLink(title) {
	title = title.toLowerCase();
	var tbody = document.getElementById('tbody1');
	var found = 0;
	for (var i=0; i<tbody.rows.length; i++) {
		var rowtitle = tbody.rows[i].cells[1].innerHTML.toLowerCase();
		if (rowtitle.indexOf('<') != -1) rowtitle = rowtitle.substring(0, rowtitle.indexOf('<'));
		if (rowtitle == title) {
			eventTR = tbody.rows[i];
			if (eventTR.style.display == "none") {
				searchPlaylist(1, '')
			}
			playEventTR();
			scrollToSong(1);
			found = 1;
			break;
		}
	}
	if (!found) alert("This beat has not been added to our playlist yet. If you would like to request that we add it, please contact us.");
}

function playEventTR(playfromtop) {
	var songInfo = eventTR.id.split('|');
	document.getElementById('jtitle').innerHTML = songInfo[1];
	document.getElementById('jby').innerHTML = ' &nbsp;by <b>'+songInfo[2]+'</b>';
	document.getElementById('jbpm').innerHTML = songInfo[5]+' bpm';
	document.getElementById('jshare').innerHTML = '<a href="http://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.jeejuh.com%2F' + songInfo[8] + '" title="Share on Facebook" target="_blank"><div class="jshare_facebook"></div></a> <a href="http://twitter.com/share?url=http%3A%2F%2Fwww.jeejuh.com%2F' + songInfo[8] + '&amp;text=' + songInfo[1] + ' - Beat by ' + songInfo[2] + ' @JeeJuh" title="Share on Twitter" target="_blank"><div class="jshare_twitter"></div></a> <a href="javascript:void(0)" title="Share URL" onclick="showLink(357, \'beat\', \'' + songInfo[8] + '\')"><div class="jshare_link"></div></a></td>';
	if (alreadyLiked.indexOf('.'+songInfo[0]+'.') > -1) {
		songInfo[3]++;
		addClassName(document.getElementById('like_button'), 'clicked');
	} else {
		removeClassName(document.getElementById('like_button'), 'clicked');
	}
	if (alreadyDisliked.indexOf('.'+songInfo[0]+'.') > -1) {
		songInfo[4]++;
		addClassName(document.getElementById('dislike_button'), 'clicked');
	} else {
		removeClassName(document.getElementById('dislike_button'), 'clicked');
	}
	var likes_content = '<div class="jlikes_bar" id="jlikes_bar">';
	if (songInfo[3] == 0 && songInfo[4] == 0) {
		likes_content += '<div class="jlikes_white"></div>';
	} else if (songInfo[3] > 0 && songInfo[4] > 0) {
		var likespixels = Math.ceil(98 * Number(songInfo[3]) / (Number(songInfo[3]) + Number(songInfo[4])));
		likes_content += '<div class="jlikes_green" style="width:' + likespixels + 'px"></div><div class="jlikes_red" style="width:' + (98 - likespixels) + 'px"></div>';
	} else if (songInfo[3] > 0) {
		likes_content += '<div class="jlikes_green" style="width:100px"></div>';
	} else {
		likes_content += '<div class="jlikes_red" style="width:100px"></div>';
	}
	likes_content += '</div><span id="like_count">' + addCommas(songInfo[3]) + '</span> likes, <span id="dislike_count">' + addCommas(songInfo[4]) + '</span> dislikes';
	document.getElementById('jlikes').innerHTML = likes_content;
	removeClassName(document.getElementById('speaker_'+currentSongID), 'playing');
	addClassName(document.getElementById('speaker_'+songInfo[0]), 'playing');
	addClassName(document.getElementById('jplay'), 'playing');
	currentInit = songInfo[9];
	currentSongID = songInfo[0];
	currentHash = songInfo[9];
	currentSlug = songInfo[8];
	currentTitle = songInfo[1];
	currentBy = songInfo[2];
	currentDuration = currentTR.cells[3].id;
	removeClassName(currentTR, "current");
	addClassName(eventTR, "current");
	currentTR = eventTR;
	scrollToSong();
	document.getElementById('jtrack_time').innerHTML = "0:00";
	if (!playfromtop) document.getElementById('jtrack_loading').style.width = "0";
	document.getElementById('jtrack_blue').style.width = "0";
	document.getElementById('jtrack_head').style.left = "0";
	document.getElementById('jtrack_click').style.cursor = "pointer";
	if (hasflash) callToActionscript('jeejuhplayer', (playfromtop ? 'playfromtop' : 'play') + '.' + songInfo[9]);
	else noFlash((playfromtop ? 'playfromtop' : 'play'), songInfo[9]);
}

function scrollToSong(centered) {
	if (centered) {
		eventTR.parentNode.parentNode.parentNode.scrollTop = eventTR.offsetTop - 38;
	} else if (eventTR.offsetTop - eventTR.parentNode.parentNode.parentNode.scrollTop < 0) {
		eventTR.parentNode.parentNode.parentNode.scrollTop = eventTR.offsetTop;
	} else if (eventTR.offsetTop - eventTR.parentNode.parentNode.parentNode.scrollTop + 19 > eventTR.parentNode.parentNode.parentNode.offsetHeight) {
		eventTR.parentNode.parentNode.parentNode.scrollTop = eventTR.offsetTop - eventTR.parentNode.parentNode.parentNode.offsetHeight + 19;
	}
}

function closeVideo() {
	$('#jvideo').slideUp();
	document.getElementById('jvideo').innerHTML = '';
}

function showLink(left, type, slug) {
	if (document.getElementById('jshare_link_content').style.display != 'block') {
		document.getElementById('jshare_link_input').value = 'http://www.jeejuh.com/' + slug;
		document.getElementById('jshare_link_type').innerHTML = type;
		document.getElementById('jshare_link_content').style.left = left + 'px';
		$('#jshare_link_content').slideDown();
	} else {
		$('#jshare_link_content').slideUp();
	}
}

var currentLibrary = 1;
function libraryClick(lib) {
	document.getElementById('p'+currentLibrary).style.display = "none";
	document.getElementById('p'+lib).style.display = "block";
	removeClassName(document.getElementById('jlibrary_'+currentLibrary), 'current');
	addClassName(document.getElementById('jlibrary_'+lib), 'current');
	document.getElementById('jorder_'+currentLibrary).style.display = "none";
	document.getElementById('jorder_'+lib).style.display = "block";
	document.getElementById('jgenre').style.display = (lib == 1) ? "block" : "none";
	document.getElementById('jsearch_'+currentLibrary).style.display = "none";
	document.getElementById('jsearch_'+lib).style.display = "block";
	document.getElementById('jtotals_'+currentLibrary).style.display = "none";
	document.getElementById('jtotals_'+lib).style.display = "block";
	currentLibrary = lib;
}

function sortPlaylist(playlist,headcol,col,num,desc,fragmented,always) {
	tbody = document.getElementById("tbody"+playlist);
	col--;
	if (headcol) {
		theadcell = document.getElementById("h"+playlist+"_c"+headcol);
		if (theadcell.className.search(/\basc\b/) != -1 || theadcell.className.search(/\bdesc\b/) != -1) {
			if (theadcell.className.search(/\basc\b/) != -1) {
				theadcell.className = theadcell.className.replace('asc','desc');
			} else {
				theadcell.className = theadcell.className.replace('desc','asc');
			}
	
			if (!fragmented) {
				row_array = [];
				for (var i=0; i<tbody.rows.length; i++) {
					row_array[row_array.length] = tbody.rows[i];
				}
				for (var i=row_array.length-1; i>=0; i--) {
					tbody.appendChild(row_array[i]);
				}
				delete row_array;
				return;
			} else {
				if (theadcell.className.search(/\bdesc\b/) != -1) desc = 1;
			}
		} else {
			theadcells = document.getElementById("thead"+playlist).rows[0].cells;
			for (i in theadcells) {
				if (theadcells[i].className) {
					theadcells[i].className = theadcells[i].className.replace(' asc','');
					theadcells[i].className = theadcells[i].className.replace(' desc','');
					theadcells[i].className = theadcells[i].className.replace(' dark','');
				}
			}
			theadcell.className += desc ? ' desc' : ' asc';
			var theadcelli;
			for (theadcelli = 0; theadcelli < theadcell.parentNode.childNodes.length; theadcelli++) {
				if (theadcell == theadcell.parentNode.childNodes[theadcelli]) break;
			}
			theadcell.parentNode.childNodes[theadcelli - 2].className += ' dark';
			if (theadcelli + 1 < theadcell.parentNode.childNodes.length) theadcell.parentNode.childNodes[theadcelli + 1].className += ' dark';
			if (document.getElementById('jsortSortBy')) {
				if (col == 1 && document.getElementById('jsortSortBy').selectedIndex != 3) document.getElementById('jsortSortBy').selectedIndex = 3;
				if (col == 2 && document.getElementById('jsortSortBy').selectedIndex != 4) document.getElementById('jsortSortBy').selectedIndex = 4;
				if (col == 3 && document.getElementById('jsortSortBy').selectedIndex != 2) document.getElementById('jsortSortBy').selectedIndex = 2;
			}
		}
	} else {
		theadcells = document.getElementById("thead"+playlist).rows[0].cells;
		for (i in theadcells) {
			if (theadcells[i].className) {
				theadcells[i].className = theadcells[i].className.replace(' asc','');
				theadcells[i].className = theadcells[i].className.replace(' desc','');
				theadcells[i].className = theadcells[i].className.replace(' dark','');
			}
		}
	}
	row_array = [];
	rows = tbody.rows;
	for (var i=0; i<rows.length; i++) {
		if (rows[i].cells[col].getAttribute("customkey") != null) {
			if (fragmented && !desc && rows[i].cells[col].getAttribute("customkey") == '') {
				row_array[row_array.length] = ['zzz', rows[i]];
			} else {
				row_array[row_array.length] = [rows[i].cells[col].getAttribute("customkey"), rows[i]];
			}
		} else {
			row_array[row_array.length] = [rows[i].cells[col].childNodes[0].textContent, rows[i]];
		}
	}
	if (!headcol && !always) {
		row_array.sort(sortRandom);
	} else if (num) {
		row_array.sort(sortNumber);
	} else {
		row_array.sort();
	}
	if (desc) {
		for (var i=row_array.length-1; i>=0; i--) {
			tbody.appendChild(row_array[i][1]);
		}
	} else {
		for (var i=0; i<row_array.length; i++) {
			tbody.appendChild(row_array[i][1]);
		}
	}
	delete row_array;
	document.getElementById('tbody'+playlist).parentNode.parentNode.scrollTop = 0;
//	if (playlist == 1) {
//		for (var i=1; i<=6; i++) {
//			removeClassName(document.getElementById('jorder_1_'+i), 'current');
//		}
//		if (headcol == 10) addClassName(document.getElementById('jorder_1_1'), 'current');
//		if (headcol == 4) addClassName(document.getElementById('jorder_1_2'), 'current');
//		if (headcol == 9) addClassName(document.getElementById('jorder_1_3'), 'current');
//		if (headcol == 2) addClassName(document.getElementById('jorder_1_4'), 'current');
//		if (headcol == 6) addClassName(document.getElementById('jorder_1_5'), 'current');
//		if (headcol == 0) addClassName(document.getElementById('jorder_1_6'), 'current');
//	} else if (playlist == 2) {
//		for (var i=1; i<=5; i++) {
//			removeClassName(document.getElementById('jorder_2_'+i), 'current');
//		}
//		if (headcol == 9) addClassName(document.getElementById('jorder_2_1'), 'current');
//		if (headcol == 4) addClassName(document.getElementById('jorder_2_2'), 'current');
//		if (headcol == 8) addClassName(document.getElementById('jorder_2_3'), 'current');
//		if (headcol == 2) addClassName(document.getElementById('jorder_2_4'), 'current');
//		if (headcol == 0) addClassName(document.getElementById('jorder_2_5'), 'current');
//	} else if (playlist == 3) {
//		for (var i=1; i<=4; i++) {
//			removeClassName(document.getElementById('jorder_3_'+i), 'current');
//		}
//		if (headcol == 8) addClassName(document.getElementById('jorder_3_1'), 'current');
//		if (headcol == 7) addClassName(document.getElementById('jorder_3_2'), 'current');
//		if (headcol == 2) addClassName(document.getElementById('jorder_3_3'), 'current');
//		if (headcol == 0) addClassName(document.getElementById('jorder_3_4'), 'current');
//	}
}

function sortNumber(a,b) {
	return a[0] - b[0];
}

function sortRandom(){
	return Math.round(Math.random()) - .5;
}

var jsortSortBy = "Hottest";
var jsortGenre = "All Genres";
var jsortProducer = "";
function updateSorting(type) {
	if (type == 1) {
		jsortSortBy = document.getElementById('jsortSortBy').options[document.getElementById('jsortSortBy').selectedIndex].text;
		if (jsortSortBy == "Hottest") sortPlaylist(1,0,8,1,1,0,1);
		if (jsortSortBy == "Newest") sortPlaylist(1,0,9,1,1,0,1);
		if (jsortSortBy == "Best Rating") sortPlaylist(1,4,4,1,1,0,1);
		if (jsortSortBy == "Beat Title") sortPlaylist(1,2,2,0,0,0,1);
		if (jsortSortBy == "Producer") sortPlaylist(1,3,3,0,0,0,1);
		if (jsortSortBy == "Tempo") sortPlaylist(1,0,10,1,1,0,1);
		if (jsortSortBy == "Random") sortPlaylist(1,0,1);
	} else {
		if (type == 4) {
			document.getElementById('jsortProducer').selectedIndex = 0;
			document.getElementById('jsortGenre').selectedIndex = 0;
			document.getElementById('jsortInstruments').selectedIndex = 0;
		} else {
			document.getElementById('jsortSoundsLike').selectedIndex = 0;
		}
		jsortP = document.getElementById('jsortProducer').options[document.getElementById('jsortProducer').selectedIndex].value;
		jsortG = document.getElementById('jsortGenre').options[document.getElementById('jsortGenre').selectedIndex].value;
		jsortS = document.getElementById('jsortSoundsLike').options[document.getElementById('jsortSoundsLike').selectedIndex].value;
		jsortI = document.getElementById('jsortInstruments').options[document.getElementById('jsortInstruments').selectedIndex].value;
		var tbody = document.getElementById('tbody1');
		var found = 0;
		for (var i=0; i<tbody.rows.length; i++) {
			if (tbody.rows[i].cells[2].innerHTML.indexOf(jsortP) > -1 && (jsortG == 'All Genres' || tbody.rows[i].cells[10].id.indexOf(jsortG) > -1) && (jsortS == 'All Artists' || tbody.rows[i].cells[11].id.indexOf(jsortS) > -1) && (jsortI == 'All Instruments' || tbody.rows[i].cells[12].id.indexOf(jsortI) > -1)) {
				tbody.rows[i].style.display = "table-row";
				found++;
			} else {
				tbody.rows[i].style.display = "none";
			}
		}
		if (document.getElementById('jsearch_1').value != 'Search Beats') {
			document.getElementById('jsearch_1').value='Search Beats';
			document.getElementById('jsearch_1').style.color = '#7f7f7f';
			document.getElementById('jsearch_1').style.width = '75px';
			document.getElementById('jsearch_1').style.paddingRight = '7px';
			document.getElementById('jsearch_close').style.display = 'none';
		}
		if (found > 0) removeClassName(document.getElementById('jprev'), 'disabled');
		else addClassName(document.getElementById('jprev'), 'disabled');
		if (found > 1) removeClassName(document.getElementById('jnext'), 'disabled');
		else addClassName(document.getElementById('jnext'), 'disabled');
		currentFound[1] = found;
	}
}

var currentFound=[0,2,2,2];
var lastQuery = '';
function searchPlaylist(playlist, query) {
	query = query.toLowerCase();
	if (query != lastQuery) {
		var tbody = document.getElementById('tbody'+playlist);
		var found = 0;
		var totalseconds = 0;
		for (var i=0; i<tbody.rows.length; i++) {
			console.log(i);
			console.log(((query == '' || tbody.rows[i].cells[0].id.indexOf(query) > -1) && (jsortGenre == 'All Genres' || tbody.rows[i].cells[10].id.indexOf(jsortGenre) > -1) && tbody.rows[i].cells[2].innerHTML.indexOf(jsortProducer) > -1) ? 'yesy' : 'no');
			console.log(tbody.rows[i].cells[0].id);
			console.log(tbody.rows[i].cells[0].id.indexOf(query));
			console.log(jsortGenre);
			console.log(tbody.rows[i].cells[10].id);
			console.log(tbody.rows[i].cells[10].id.indexOf(jsortGenre));
			console.log(tbody.rows[i].cells[2].innerHTML);
			console.log(tbody.rows[i].cells[2].innerHTML.indexOf(jsortProducer));
			console.log(tbody.rows[i].cells[2].innerHTML.indexOf(jsortProducer));
			console.log('----------');
			if ((query == '' || tbody.rows[i].cells[0].id.indexOf(query) > -1) && (jsortGenre == 'All Genres' || tbody.rows[i].cells[10].id.indexOf(jsortGenre) > -1) && tbody.rows[i].cells[2].innerHTML.indexOf(jsortProducer) > -1) {
				tbody.rows[i].style.display = "table-row";
				found++;
				totalseconds += Number(tbody.rows[i].cells[3].id);
			} else {
				tbody.rows[i].style.display = "none";
			}
		}
		if (found > 0) removeClassName(document.getElementById('jprev'), 'disabled');
		else addClassName(document.getElementById('jprev'), 'disabled');
		if (found > 1) removeClassName(document.getElementById('jnext'), 'disabled');
		else addClassName(document.getElementById('jnext'), 'disabled');
		currentFound[playlist] = found;
		document.getElementById('jsearch_close').style.display = (query == '') ? 'none' : 'block';
		//document.getElementById('jtotals').innerHTML = 'Playlist: ' + found + 'beat' + (found == 1 ? ', ' : 's, ') + secondsToDecimal(totalseconds);
		lastQuery = query;
	}
}

function secondsToDecimal(s) {
	if (s < 3595) {
		n = Math.floor(s/60);
		d = Math.ceil((s % 60) / 6);
		t = 'minutes';
	} else {
		n = Math.floor(s/3600);
		d = Math.ceil((s % 3600) / 360);
		t = 'hours';
	}
	if (d > 9) {
		n++;
		d = 0;
	}
	if (n == 1 && d == 0) t = t.slice(0, -1);
	return (d > 0) ? n+'.'+d+' '+t : n+' '+t;
}

var currentCommentsSlug = '';
function showSidebar(page) {
	if ((page == 1 && !hasClassName(document.getElementById('jlicensing_link'), 'open')) || (page == 2 && !hasClassName(document.getElementById('jcomments_link'), 'open'))) {
		$("#jplaylist_container").animate({width:"396px"});
		$("#jplaylist_header_1").animate({width:"396px"});
		$("#jplaylist_header_2").animate({width:"396px"});
		$("#jplaylist_header_3").animate({width:"396px"});
		$("#jplaylist_1").animate({width:"396px"});
		$("#jplaylist_2").animate({width:"396px"});
		$("#jplaylist_3").animate({width:"396px"});
		document.getElementById('jplaylist_table_1').style.width = '809px';
		document.getElementById('jplaylist_table_2').style.width = '809px';
		document.getElementById('jplaylist_table_3').style.width = '809px';
	} else if ((page == 1 && hasClassName(document.getElementById('jlicensing_link'), 'open')) || (page == 2 && hasClassName(document.getElementById('jcomments_link'), 'open'))) {
		$("#jplaylist_container").animate({width:"825px"});
		$("#jplaylist_header_1").animate({width:"825px"});
		$("#jplaylist_header_2").animate({width:"825px"});
		$("#jplaylist_header_3").animate({width:"825px"});
		$("#jplaylist_1").animate({width:"825px"});
		$("#jplaylist_2").animate({width:"825px"});
		$("#jplaylist_3").animate({width:"825px"});
		document.getElementById('jplaylist_table_1').style.width = '100%';
		document.getElementById('jplaylist_table_2').style.width = '100%';
		document.getElementById('jplaylist_table_3').style.width = '100%';
	}
	if (page == 1 && !hasClassName(document.getElementById('jlicensing_link'), 'open')) {
		$("#jlicensing").animate({width:"429px"});
		document.getElementById('jlicensing_link').innerHTML = 'Hide Licensing Info';
		addClassName(document.getElementById('jlicensing_link'), 'open');
	} else if (hasClassName(document.getElementById('jlicensing_link'), 'open')) {
		$("#jlicensing").animate({width:"0"});
		document.getElementById('jlicensing_link').innerHTML = 'Show Licensing Info';
		removeClassName(document.getElementById('jlicensing_link'), 'open');
	}
	if (page == 2 && !hasClassName(document.getElementById('jcomments_link'), 'open')) {
		$("#jcomments").animate({width:"429px"});
		document.getElementById('jcomments_link').innerHTML = 'Hide Comments';
		addClassName(document.getElementById('jcomments_link'), 'open');
		if (currentCommentsSlug != currentSlug) {
			document.getElementById('jcomments_info').innerHTML = '<iframe width="428" height="558" src="http://www.jeejuh.com/includes/facebook-comments-iframe.php?slug=' + currentSlug + '&title=' + encodeURIComponent(currentTitle) + '&by=' + encodeURIComponent(currentBy) + '" frameborder="0"></iframe>';
			currentCommentsSlug = currentSlug;
		}
	} else if (hasClassName(document.getElementById('jcomments_link'), 'open')) {
		$("#jcomments").animate({width:"0"});
		document.getElementById('jcomments_link').innerHTML = 'Show Comments';
		removeClassName(document.getElementById('jcomments_link'), 'open');
	}
}

function syncScroll(playlist, header) {
	document.getElementById('jplaylist_header_'+header).scrollLeft = playlist.scrollLeft;
}

function getFlashMovie(movieName) {
	var isIE = navigator.appName.indexOf("Microsoft") != -1;
	return (isIE) ? window[movieName] : document[movieName];
}

function callToActionscript(flash, str) {
	getFlashMovie(flash).sendToActionscript(str);
}

var songLoaded = false;
function sendToJavaScript(val) {
	var call = val.split('.');
	if (call[0] == 'time') {
		document.getElementById('jtrack_time').innerHTML = call[2];
	} else if (call[0] == 'loading') {
		document.getElementById('jtrack_loading').style.width = (Number(call[2]) + 2) + "px";
		songLoaded = true;
	} else if (call[0] == 'blue' && !draggingPlayhead) {
		document.getElementById('jtrack_blue').style.width = call[2] + "px";
		document.getElementById('jtrack_head').style.left = call[2] + "px";
	} else if (call[0] == 'complete') {
		playlistNav('complete');
	} else if (call[0] == 'loaded' && currentInit && currentLibrary != 3) {
		if (hasflash) callToActionscript('jeejuhplayer', 'play.'+currentInit);
		else noFlash('play', currentInit);
	}
}

var alreadyLiked = ".";
var alreadyDisliked = ".";
function likeClick(liked) {
	if (!hasClassName(document.getElementById('like_button'), 'clicked') && !hasClassName(document.getElementById('dislike_button'), 'clicked')) {
		addClassName(document.getElementById((liked ? '' : 'dis')+'like_button'), 'clicked');
		var likes = parseInt(document.getElementById('like_count').innerHTML.replace(/\,/g,''));
		var dislikes = parseInt(document.getElementById('dislike_count').innerHTML.replace(/\,/g,''));
		if (liked) {
			likes++;
			alreadyLiked += currentSongID + ".";
			document.getElementById('like_count').innerHTML = addCommas(likes);
		} else {
			dislikes++;
			alreadyDisliked += currentSongID + ".";
			document.getElementById('dislike_count').innerHTML = addCommas(dislikes);
		}
		if (likes > 0 && dislikes > 0) {
			var likespixels = Math.ceil(98 * likes / (likes + dislikes));
			document.getElementById('jlikes_bar').innerHTML = '<div class="jlikes_green" style="width:' + likespixels + 'px"></div><div class="jlikes_red" style="width:' + (98 - likespixels) + 'px"></div>';
			var mini_likespixels = Math.ceil(42 * likes / (likes + dislikes));
			document.getElementById('mini_likes_bar_'+currentSongID).innerHTML = '<div class="jlikes_green white_right" style="width:' + mini_likespixels + 'px"></div><div class="jlikes_red" style="width:' + (42 - mini_likespixels) + 'px"></div>';
		} else if (likes > 0) {
			document.getElementById('jlikes_bar').innerHTML = '<div class="jlikes_green" style="width:100px"></div>';
			document.getElementById('mini_likes_bar_'+currentSongID).innerHTML = '<div class="jlikes_green" style="width:44px"></div>';
		} else {
			document.getElementById('jlikes_bar').innerHTML = '<div class="jlikes_red" style="width:100px"></div>';
			document.getElementById('mini_likes_bar_'+currentSongID).innerHTML = '<div class="jlikes_red" style="width:44px"></div>';
		}
		document.getElementById('mini_likes_bar_'+currentSongID).parentNode.title = likes+' likes, '+dislikes+' dislikes';
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("POST","/ajax/add-like.php",true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send("songid="+currentSongID+"&liked="+liked+"&ipaddress="+document.getElementById("jshopping_cart_ipaddress").value);
	}
}

var _offsetX = 0;
var _dragElement;
var _oldZIndex = 0;
var currentVol = 64;
var newVol = 64;
var currentPlayhead = 0;
var newPlayhead = 0;
var draggingPlayhead = false;

InitVolDrag();
function InitVolDrag() {
	document.onmousedown = OnMouseDown;
	document.onmouseup = OnMouseUp;
}

function OnMouseDown(e) {
	if (e == null) e = window.event;
	var target = e.target != null ? e.target : e.srcElement;
	if (target.tagName == 'HTML' || target.tagName == 'BODY' || (!hasClassName(target, "jshare_link") && !hasClassName(target, "jshare_link_content") && !hasClassName(target.parentNode, "jshare_link_content"))) {
		$('#jshare_link_content').slideUp();
	}
	if ((e.button == 1 && window.event != null || e.button == 0) && (target.className == 'jvol' || target.parentNode.className == 'jvol' || target.className == 'jtrack_click')) {
		if (target.className == 'jvol' || target.parentNode.className == 'jvol') {
			target = document.getElementById('jvol_knob');
			target.style.backgroundPosition = '-348px -255px';
			_offsetX = $('#jvol').offset().left;
		} else {
			target = document.getElementById('jtrack_head');
			_offsetX = $('#jtrack').offset().left;
			draggingPlayhead = true;
		}
		document.body.style.cursor = 'pointer';
		_oldZIndex = target.style.zIndex;
		target.style.zIndex = 10000;
		_dragElement = target;
		document.onmousemove = OnMouseMove;
		document.body.focus();
		document.onselectstart = function () { return false; };
		target.ondragstart = function() { return false; };
		OnMouseMove(e);
		return false;
	}
}

function ExtractNumber(value) {
	var n = parseInt(value);
	return n == null || isNaN(n) ? 0 : n;
}

function OnMouseMove(e) {
	var hscroll = (document.all ? (document.scrollLeft ? document.scrollLeft : document.body.scrollLeft) : window.pageXOffset);
	if (e == null) var e = window.event;
	if (_dragElement.id == 'jvol_knob') {
		newVol = Math.min(Math.max(0, e.clientX + hscroll - _offsetX - 17), 64);
		if (newVol != currentVol) {
			document.getElementById('jvol_knob').style.left = newVol + 'px';
			document.getElementById('jvol_tail').style.width = newVol + 'px';
			if (hasflash) callToActionscript('jeejuhplayer', 'vol.'+newVol);
			else noFlash('vol', newVol);
			currentVol = newVol;
		}
	} else {
		if (songLoaded) {
			newPlayhead = Math.min(Math.max(0, e.clientX + hscroll - _offsetX - 28), 214, ExtractNumber(document.getElementById('jtrack_loading').style.width) > 0 || !songLoaded ? ExtractNumber(document.getElementById('jtrack_loading').style.width) : 214);
			if (newPlayhead != currentPlayhead) {
				document.getElementById('jtrack_head').style.left = newPlayhead + "px";
				document.getElementById('jtrack_blue').style.width = newPlayhead + "px";
				if (hasflash) callToActionscript('jeejuhplayer', 'track.'+newPlayhead);
				else noFlash('track', newPlayhead);
				currentPlayhead = newPlayhead;
			}
		} else {
			playClick();
		}
	}
}

function OnMouseUp(e) {
	if (_dragElement != null) {
		//currentVol = passVol;
		document.getElementById('jvol_knob').style.backgroundPosition = '-335px -255px';
		document.body.style.cursor = 'default';
		draggingPlayhead = false;
		_dragElement.style.zIndex = _oldZIndex;
		document.onmousemove = null;
		document.onselectstart = null;
		_dragElement.ondragstart = null;
		_dragElement = null;
	}
}

function sendOffer() {
	if (!document.getElementById('offer_form_button').disabled) {
		document.getElementById('offer_form_button').disabled = true;
		var send_message_email = document.getElementById('offer_form_email').value;
		var send_message_subject = "Exclusive Beats Offer";
		var send_message_message = "Beat Title(s): " + document.getElementById('offer_form_titles').value + "\nMonetary Offer: " + document.getElementById('offer_form_offer').value + (document.getElementById('offer_form_comments').value.length ? "\nAdditional Comments: " + document.getElementById('offer_form_comments').value : '');
		var send_message_timezoneoffset = -(new Date()).getTimezoneOffset() / 60;
		var send_message_ipaddress = document.getElementById('offer_form_ipaddress').value;
		var email_regx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if (!email_regx.test(send_message_email)) {
			alert("Please enter a valid email address.");
			document.getElementById('offer_form_button').disabled = false;
		} else {
			document.getElementById('offer_form_button').value = "Sending...";
			if (window.XMLHttpRequest) {
				xmlhttp = new XMLHttpRequest();
			} else {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (xmlhttp.responseText == 1) {
						document.getElementById('offer_form_button').style.display = "none";
						document.getElementById('offer_form_sent').innerHTML = "Thanks for sending us your offer.";
					} else {
						document.getElementById('offer_form_button').value = "Send Offer";
						document.getElementById('offer_form_button').disabled = false;
						alert("We were unable to send your offer due to a techinical error. Please email us directly at shayansbn@yahoo.com");
					}
				}
			}
			xmlhttp.open("POST","/ajax/send-message.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("email="+escape(send_message_email)+"&subject="+escape(send_message_subject)+"&message="+escape(send_message_message)+"&timezoneoffset="+send_message_timezoneoffset+"&ipaddress="+send_message_ipaddress);
		}
	}
}

function hasClassName(element, className) {
	return (element.className.length > 0 && (element.className == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className)));
}

function addClassName(element, className) {
	if (!hasClassName(element, className)) element.className += (element.className ? ' ' : '') + className;
    return element;
}
	
function removeClassName(element, className) {
	element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').replace(/^\s+/, '').replace(/\s+$/, '');
	return element;
}

function addCommas(nStr) {
      nStr += '';
      x = nStr.split('.');
      x1 = x[0];
      x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
}

function css_browser_selector(u){var ua = u.toLowerCase(),is=function(t){return ua.indexOf(t)>-1;},g='gecko',w='webkit',s='safari',o='opera',h=document.documentElement,b=[(!(/opera|webtv/i.test(ua))&&/msie\s(\d)/.test(ua))?('ie ie'+RegExp.$1):is('firefox/2')?g+' ff2':is('firefox/3.5')?g+' ff3 ff3_5':is('firefox/3')?g+' ff3':is('gecko/')?g:is('opera')?o+(/version\/(\d+)/.test(ua)?' '+o+RegExp.$1:(/opera(\s|\/)(\d+)/.test(ua)?' '+o+RegExp.$2:'')):is('konqueror')?'konqueror':is('chrome')?w+' chrome':is('iron')?w+' iron':is('applewebkit/')?w+' '+s+(/version\/(\d+)/.test(ua)?' '+s+RegExp.$1:''):is('mozilla/')?g:'',is('j2me')?'mobile':is('iphone')?'iphone':is('ipod')?'ipod':is('mac')?'mac':is('darwin')?'mac':is('webtv')?'webtv':is('win')?'win':is('freebsd')?'freebsd':(is('x11')||is('linux'))?'linux':'','js']; c = b.join(' '); h.className += ' '+c; return c;}; css_browser_selector(navigator.userAgent);

if (!Array.indexOf) {
	Array.prototype.indexOf = function(obj) {
		for(var i=0; i<this.length; i++) {
			if(this[i]==obj) {
				return i;
			}
		}
		return -1;
	}
}

//v1.7
// Flash Player Version Detection
// Detect Client Browser type
// Copyright 2005-2008 Adobe Systems Incorporated.  All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
function ControlVersion()
{
	var version;
	var axo;
	var e;
	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry
	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}
	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful.
			
			// default to the first public version
			version = "WIN 6,0,21,0";
			// throws if AllowScripAccess does not exist (introduced in 6.0r47)
			axo.AllowScriptAccess = "always";
			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}
	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}
	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}
	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}
// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}
	return flashVer;
}
// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];
        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}
function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?');
  else
    return src + ext;
}
function AC_Generateobj(objAttrs, params, embedAttrs)
{
  var str = '';
  if (isIE && isWin && !isOpera)
  {
    str += '<object ';
    for (var i in objAttrs)
    {
      str += i + '="' + objAttrs[i] + '" ';
    }
    str += '>';
    for (var i in params)
    {
      str += '<param name="' + i + '" value="' + params[i] + '" /> ';
    }
    str += '</object>';
  }
  else
  {
    str += '<embed ';
    for (var i in embedAttrs)
    {
      str += i + '="' + embedAttrs[i] + '" ';
    }
    str += '> </embed>';
  }
  document.write(str);
}
function AC_FL_RunContent(){
  var ret =
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}
function AC_SW_RunContent(){
  var ret =
    AC_GetArgs
    (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}
function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();
    switch (currArg){
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblclick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
      case "id":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "width":
      case "height":
      case "align":
      case "vspace":
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}
