var NICORIPOFF = "";
var NICOCOUNTER = 0;
$('<li><a id="nicobtn" class="pointer">Turn on NND Bullet Text</a></li>')
.appendTo("#nav-collapsible ul:first-child");
$('#nicobtn').detach().appendTo('#settingsMenu .dropdown-menu').wrap('<li></li>');
if (NICORIPOFF) {
	socket.on("chatMsg", nicoChineseRipOff);
	socket.on("clearchat", removeNicoText);
	$(this).text('Turn off NND Bullet Text');
}
$('#nicobtn').on("click", function() {
	NICORIPOFF = !NICORIPOFF;
	if (!NICORIPOFF) {
		removeNicoText();
		socket.removeListener("chatMsg", nicoChineseRipOff);
		socket.removeListener("clearchat", removeNicoText);
		$(this).text('Turn on NND Bullet Text');
	} else {
		socket.on("chatMsg", nicoChineseRipOff);
		socket.on("clearchat", removeNicoText);
		$(this).text('Turn off NND Bullet Text');
	}
});


function nicoChineseRipOff(data) {
	SHADOWED = data.username === CLIENT.name && data.meta.shadow ? true : false;
	if (data.username !== "[server]" && (!data.meta.shadow || SHADOWED)) {
		var marqueeheight = $(".embed-responsive marquee").height();
		if (marqueeheight < 25) {
			marqueeheight = 25;
		} else if (marqueeheight > 50 && data.msg.indexOf("<img ") === -1) {
			marqueeheight = 25;
		}
		marqueeheight === 0 ? NICOCOUNTER = 0 : "";
		var offset = marqueeheight * NICOCOUNTER++;
		if (offset > $("#ytapiplayer").height() - (marqueeheight * (marqueeheight < 50 ? (PLAYER.mediaLength > 450 ? 5 : 2) : 1))) {
			offset = 0;
			NICOCOUNTER = 1;
		}
		data.meta.addClass === "shout" ? data.msg = '<span class="shout">' + data.msg : "";
		var vidchat = $('<marquee class="vidchat" scrollamount="15" loop="1" style="margin-top:' + offset + 'px">' + data.msg + '</div>');
		vidchat.appendTo(".embed-responsive");
		setTimeout(function() {
			vidchat.remove();
			$(".embed-responsive marquee").length === 0 ? NICOCOUNTER = 0 : "";
		}, 10000);
	}
}

function removeNicoText() {
	$(".embed-responsive").children("#vidchat").remove();
}
