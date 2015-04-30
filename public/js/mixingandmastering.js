var currentType = '';
var pricePerSongObject = {
	silver: {
		standard: 4999,
		ep: 4499,
		lp: 3999
	},
	gold: {
		standard: 8999,
		ep: 7999,
		lp: 6999
	},
	platinum: {
		standard: 14999,
		ep: 12999,
		lp: 11999
	}
};
var totalPrice = 0;

function showPopover(type) {
	if (currentType == type) {
		$('#popover').hide();
		currentType = '';
	} else {
		$('#popover').show()[0].className = 'popover ' + type;
		currentType = type;
		buildCart();
	}
}

function buildCart() {
	$('#popover-title').html(currentType.capitalize() + ' Package');
	var songCount = $('#songCount').val();
	var radioEditCount = Math.min(songCount, $('#radioEditCount').val());
	var pricePerSong = pricePerSongObject[currentType][songCount < 2 ? 'standard' : songCount < 8 ? 'ep' : 'lp'];
	totalPrice = ((songCount * pricePerSong) + (radioEditCount * 999)) / 100;
	$('.total-price').html(addCommas(totalPrice.toFixed(2)));
	var paypalItems = '';
	var itemIndex = 0;
	console.log('a', songCount, radioEditCount, songCount < radioEditCount);
	if (radioEditCount < songCount) {
		itemIndex++;
		paypalItems += '<input type="hidden" name="item_name_' + itemIndex + '" value="Mixing and Mastering (' + currentType.capitalize() + ' Package)">';
		paypalItems += '<input type="hidden" name="amount_' + itemIndex + '" value="' + (pricePerSong / 100) + '">';
		paypalItems += '<input type="hidden" name="quantity_' + itemIndex + '" value="' + (songCount - radioEditCount) + '">';
	}
	if (radioEditCount > 0) {
		itemIndex++;
		paypalItems += '<input type="hidden" name="item_name_' + itemIndex + '" value="Mixing and Mastering (' + currentType.capitalize() + ' Package with Radio Edit)">';
		paypalItems += '<input type="hidden" name="amount_' + itemIndex + '" value="' + ((pricePerSong + 999) / 100) + '">';
		paypalItems += '<input type="hidden" name="quantity_' + itemIndex + '" value="' + radioEditCount + '">';
	}
	paypalItems += '<input type="hidden" name="custom" value="mm|' + $('#ipAddress').val() + '|' + currentType.charAt(0) + songCount + (radioEditCount > 0 ? 'r' + radioEditCount : '') + '">';
	$('#paypal-items').html(paypalItems);
	if (songCount >= 2) {
		var originalPricePerSong = pricePerSongObject[currentType]['standard'];
		var originalPrice = ((songCount * originalPricePerSong) + (radioEditCount * 999)) / 100;
		$('#original-price').html(addCommas(originalPrice.toFixed(2)));
		var savedPrice = (originalPrice * 100 - totalPrice * 100) / 100;
		$('#saved-price').html(addCommas(savedPrice.toFixed(0)));
		$('#popover-normal-price').hide();
		$('#popover-reduced-price').show();
	} else {
		$('#popover-normal-price').show();
		$('#popover-reduced-price').hide();
	}
}

function proceedToCheckout() {
	alert('This service is not yet available, but will be available very soon. Check back tomorrow.');
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.substring(1);
};

// http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function addCommas(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}