function sendMessage() {
	if (!document.getElementById('send_message').disabled) {
		document.getElementById('send_message').disabled = true;
		document.getElementById('send_message_button_error').innerHTML = '';
		var send_message_email = document.getElementById('send_message_email').value;
		var send_message_subject = document.getElementById('send_message_subject').value;
		var send_message_message = document.getElementById('send_message_message').value;
		var send_message_timezoneoffset = -(new Date()).getTimezoneOffset() / 60;
		var send_message_ipaddress = document.getElementById('send_message_ipaddress').value;
		var email_regx = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if (!send_message_email || !send_message_subject || !send_message_message) {
			document.getElementById('send_message_button_error').innerHTML = "All fields are required.";
			document.getElementById('send_message').disabled = false;
			$('#send_message_form').effect("shake", { distance:8, times:2 }, 100);
		} else if (!email_regx.test(send_message_email)) {
			document.getElementById('send_message_button_error').innerHTML = "Please enter a valid email address.";
			document.getElementById('send_message').disabled = false;
			$('#send_message_form').effect("shake", { distance:8, times:2 }, 100);
		} else {
			document.getElementById('send_message_button_error').style.color="#000000";
			document.getElementById('send_message_button_error').innerHTML = "Sending...";
			if (window.XMLHttpRequest) {
				xmlhttp = new XMLHttpRequest();
			} else {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (xmlhttp.responseText == 1) {
						$('#send_message_form').fadeOut(400);
						$('#message_sent').delay(410).fadeIn(400);
					} else {
						document.getElementById('send_message_button_error').style.color="#FF0000";
						document.getElementById('send_message_button_error').innerHTML = "Unable to send message, please email us directly at beats@jeejuh.com.";
						document.getElementById('send_message').disabled = false;
						$('#send_message_form').effect("shake", { distance:8, times:2 }, 100);
					}
				}
			}
			xmlhttp.open("POST","/ajax/send-message.php",true);
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xmlhttp.send("email="+escape(send_message_email)+"&subject="+escape(send_message_subject)+"&message="+escape(send_message_message)+"&timezoneoffset="+send_message_timezoneoffset+"&ipaddress="+send_message_ipaddress);
		}
	}
}