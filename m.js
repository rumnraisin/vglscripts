$('<link id="chanfavicon" href="https://implyingrigged.info/w/images/d/df/Vglg_icon.png" type="image/x-icon" rel="shortcut icon" />').appendTo("head");
$('.navbar-brand').attr('href','https://implyingrigged.info/wiki//vg/_League').text(' /vg/ League').css('padding', '0 10px 0 0').prepend('<img src="https://implyingrigged.info/w/images/d/df/Vglg_icon.png" style="display: inline;" height="20"/>');
$('head').append('<script type="text/javascript" src="https://rumnraisin.github.io/vglscripts/nnd.js">');
$('head').append('<script type="text/javascript" src="https://rumnraisin.github.io/vglscripts/ts.js">');
//$('head').append('<script type="text/javascript" src="https://implyingrigged.info/cytube/anon.js">');
$('head').append('<script type="text/javascript" src="https://rumnraisin.github.io/vglscripts/em.js">');
TimeSetting = getOrDefault(CHANNEL.name + "_SCHEDULE_TIME", "UTC");
//test
$( document ).ready(function() {
	/* Navbar */ { 
		//Options/Account
		$('.dropdown-toggle').each(function(){
			if ($(this).text() == 'Account'){
				var name = $('#welcome').text().replace('Welcome, ', '');
				$('#welcome').text('Welcome, ');
				$('#welcome').append('<a class="dropdown-toggle" href="#" data-toggle="dropdown">' + name + ' <b class="caret"></b></a>'); 
				$('#welcome').addClass('dropdown');
				$(this).parent().find('.dropdown-menu').detach().appendTo('#welcome');
				$(this).parent().remove();
			} else if ($(this).text() == 'Layout'){ 
				$(this).html($(this).html().replace('Layout','<b>⚙</b>'));
				$(this).parent().attr('ID','settingsMenu');
				$('li a').each(function(){
					if($(this).text() == 'Options'){
						$(this).text('User Settings').detach().appendTo('#settingsMenu .dropdown-menu').wrap('<li></li>');
					}
				});
				$('#showchansettings').detach().appendTo('#settingsMenu .dropdown-menu').wrap('<li></li>');
			}
		});
		
		//Team select style toggle
		var teamToggleButton = $('<button id="toggleTeamSelStyle" class="btn" data-toggle="button" aria-pressed="false">Team Selector: <span class="glyphicon glyphicon-list"></span><span class="glyphicon glyphicon-th"></span><span> List</span><span> Grid</span></button>')
			.appendTo('#settingsMenu .dropdown-menu')
			.wrap('<li></li>')
			.click(function(event){
				event.stopPropagation();
				$(this).button('toggle');
				var gridMode = $(this).hasClass('active');
				setOpt(CHANNEL.name + "_SELECTTEAM_GRID", gridMode);
				if(gridMode)
					$('#selectteam').addClass('grid');
				else
					$('#selectteam').removeClass('grid');
			});
		//Bigger Emotes
		$('<button id="btn_emoteSize" class="btn">Emote Size: <span>Small</span><span>Big</span></button>')
			.appendTo('#settingsMenu .dropdown-menu')
			.wrap('<li></li>')
			.click(function(event){
				event.stopPropagation();
				$(this).button('toggle');
				var bigEmotes = $(this).hasClass('active');
				setOpt(CHANNEL.name + "_BIG_EMOTES", bigEmotes);
				if(bigEmotes)
					$('#messagebuffer').addClass('bigEmotes');
				else
					$('#messagebuffer').removeClass('bigEmotes');
			});
		if(getOrDefault(CHANNEL.name + "_BIG_EMOTES", false))
			$('#btn_emoteSize').click();
	
		//Match Schedule
		$('#nav-collapsible ul:first-child').append("<li class='dropdown'><a class='dropdown-toggle' href='#' data-toggle='dropdown' aria-expanded='false'>Match Schedule<b class='caret'></b></a><ul class='dropdown-menu' id='matchSchedule'>Time Setting: </ul></li>");
		let btnGrp = $('<div class="btn-group" data-toggle="buttons"></div>').appendTo('#matchSchedule');
		['UTC', 'Local 24h', 'Local 12h', /*'Countdown'*/].forEach(val => //TODO: make Countdown actually work, move label and td CSS to external
			btnGrp.append(`<label class="btn btn-primary${val == TimeSetting ? ' active' : ''}" data-val="${val}" style="padding: 3px 7px;"><input type="radio" name="scheduleTime" autocomplete="off"${val == TimeSetting ? ' checked' : ''}>${val}</label>`));
		
		btnGrp.on("click", "label", function(event) { 
			event.stopPropagation();
			$(this).button('toggle');
			setOpt(CHANNEL.name + "_SCHEDULE_TIME", TimeSetting = this.dataset.val);
			$('#matchSchedule th[data-UTC]').html(function() { return TimeToStr(this.dataset.utc); });
		})
		
		//Other shit
		$('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://implyingrigged.info/vglgametips/'>Submit a Gametip</a></li>");
		$('#nav-collapsible ul:first-child').append('<li><a href="https://www.youtube.com/channel/UCMZYZp8eULxC5v097fswHcA?sub_confirmation=1" target="_blank">Get notifications when LIV</a></li>');
		$('#nav-collapsible ul:first-child').append('<li><a href="https://www.youtube.com/channel/UCMZYZp8eULxC5v097fswHcA" target="_blank"><img src="https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico"/></a></li>');
		$('#nav-collapsible ul:first-child').append('<li><a href="https://boards.4channel.org/vg/catalog#s=vglg" target="_blank"><img src="https://s.4cdn.org/image/favicon.ico"/></a></li>');
		$('#nav-collapsible ul:first-child').append('<li><a href="https://www.twitch.tv/vglvods" target="_blank"><img src="https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png" width=16 /></a></li>');
	}
	
	/* Tabs */ {
		var tabContainer = $('<div id="MainTabContainer"></div>').appendTo('#videowrap');
		var tabList = $('<ul class="nav nav-tabs" role="tablist"></ul>').appendTo(tabContainer);
		var tabContent = $('<div class="tab-content"></div>').appendTo(tabContainer);
		
		//Playlist Tab
		$('<div role="tabpanel" class="tab-pane active" id="playlistTab"></div>').appendTo(tabContent).append($('#rightcontrols').detach()).append($('#playlistrow').detach().removeClass('row'));
		var playlistButton = $('<li class="active" role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#playlistTab">Playlist</a></li>').appendTo(tabList);
		
		//whoever wants their fucking playlist dropdown back, go into your dev console and type `setOpt(CHANNEL.name + "_I_Am_A_Large_Faggot", true)` then refresh
		if(getOrDefault(CHANNEL.name + "_I_Am_A_Large_Faggot", false)) {
			$('body').append('<span id="pnl_options" style="position:absolute;display:none;left:0;top:30px;padding-top:10px;width:100%;background:rgba(0,0,0,0.5);z-index:2;"></span>');
			$('<li><a id="btn_playList" class="pointer">Playlist</a></li>').insertAfter('#settingsMenu')
				.click(function(){
					if ($('#pnl_options').css('display')=='none'){
						$('#rightcontrols').detach().appendTo('#pnl_options');
						$('#playlistrow').detach().appendTo('#pnl_options');
						$('#pnl_options').slideDown();
					} else {
						$('#pnl_options').slideUp();
					}
				});
			playlistButton.on('mousedown', function(){
				$('#rightcontrols').detach().appendTo('#playlistTab');
				$('#playlistrow').detach().appendTo('#playlistTab');
			});
		}
		
		//Polls Tab
		$('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#pollsTab">Polls <span id="pollsbadge" class="badge" style="background-color:#FFF;color:#000;"></span></a></li>')
			.appendTo(tabList).click(function(){ $('#pollsbadge').text(''); });
		$('<div role="tabpanel" class="tab-pane" id="pollsTab"><div class="col-lg-12 col-md-12" id="pollhistory"></div></div>').appendTo(tabContent).prepend($('#newpollbtn').detach());
	
		//Slightly edit the poll functions to make the "active poll" element above the tabs
		var redoPollwrap = function(){
			$('#pollwrap').detach().insertBefore('#MainTabContainer');
			$('#pollwrap .well span.label.pull-right').detach().insertBefore('#pollwrap .well h3'); 
			$('#pollwrap button.close').off("click").click(function(){ 
				$('#pollwrap').detach().insertBefore('#pollhistory'); 
				if($('#pollsTab').hasClass('active') == false) {
					var badgeTxt = $('#pollsbadge').text();
					$('#pollsbadge').text((badgeTxt ? parseInt(badgeTxt) : 0) + 1);
				}
			});
		};
		
		base_newPoll = Callbacks.newPoll;
		Callbacks.newPoll = function(data){
			base_newPoll(data);
			if($('#pollsTab').hasClass('active') == false && $('#MainTabContainer #pollwrap').length === 0){
				var badgeTxt = $('#pollsbadge').text();
				var pollCnt = $('#pollwrap .well.muted').length + (badgeTxt ? parseInt(badgeTxt) : 0);
				$('#pollsbadge').text(pollCnt);
			}
			
			$('#pollwrap .well.muted').detach().prependTo('#pollhistory');
			redoPollwrap();
		};
		redoPollwrap();
		
		//Vertical polls
		$('<input class="cs-checkbox" type="checkbox" id="verticalPollsCheckbox" style="float:right;">').prependTo('#pollsTab')
			.click(function(){ setOpt(CHANNEL.name + "_VERTICAL_POLLS", this.checked); });
		$('<label for="verticalPollsCheckbox" style="float:right;padding:1px 8px;">Vertical Polls</label>').prependTo('#pollsTab');
		$('#verticalPollsCheckbox').prop('checked', getOrDefault(CHANNEL.name + "_VERTICAL_POLLS", false));
		
		//Calendar Tab
		$('<div role="tabpanel" class="tab-pane" id="calendarTab"><iframe width="100%" height="600" frameborder="0" scrolling="no"></iframe></div>').appendTo(tabContent);
		$('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#calendarTab">Calendar</a></li>').appendTo(tabList);
		var baseCalendarUrl = '//calendar.google.com/calendar/embed?';
		var calendars = getOrDefault(CHANNEL.name + '_CALENDARS', null);
		if(!Array.isArray(calendars)) setOpt(CHANNEL.name + '_CALENDARS', calendars = [{ src:'c9af7ed654d1d794ce989fc7ffee20bb64cde29dd43d5860b3a6e4f6d2c9a22e%40group.calendar.google.com&ctz=UTC', color:'232952A3' } ]); //set the default calendar if not already
		AddCalendar = function(src, color){ setOpt(CHANNEL.name + '_CALENDARS', getOrDefault(CHANNEL.name + '_CALENDARS', []).concat([{src:src,color:color}])); }
		//command to add the comfy calendar: AddCalendar('d426h89oqa3krrq8cj00kbasgo%40group.calendar.google.com', 'AB8B00')
		var calendarArgs = calendars.map(function(cal){ return 'src='+cal.src+'&color=%23'+cal.color; }).join('&');
		$('#calendarTab iframe').attr('src', baseCalendarUrl+calendarArgs+'&');
		
		$('#leftpane').remove();
	}
	
	//Moving controls around
	$('#videowrap').append("<span id='vidchatcontrols' style='float:right'>");
	$('#emotelistbtn').detach().insertBefore('#chatwrap>form').wrap('<div id="emotebtndiv"></div>').text(':^)').attr('title', 'Emote List');
	$('#leftcontrols').remove();
		
	
	
	var previousMessage = "";
	
	//Overwriting the chat functions
	$('#chatline').off();
	$("#chatline").keydown(function(e) {
		if (13 != e.keyCode) {
			if (9 == e.keyCode) {
				try {
					chatTabComplete(e.target)
				} catch (e) {
					console.error(e)
				}
				return e.preventDefault(),
				!1
			}
			return 38 == e.keyCode ? (CHATHISTIDX == CHATHIST.length && CHATHIST.push($("#chatline").val()),
			0 < CHATHISTIDX && (CHATHISTIDX--,
			$("#chatline").val(CHATHIST[CHATHISTIDX])),
			e.preventDefault(),
			!1) : 40 == e.keyCode ? (CHATHISTIDX < CHATHIST.length - 1 && (CHATHISTIDX++,
			$("#chatline").val(CHATHIST[CHATHISTIDX])),
			e.preventDefault(),
			!1) : void 0
		}
		if (!CHATTHROTTLE) {
			var t = $("#chatline").val();
			if (t.trim() && $('#chatline').val().trim() != previousMessage) {
				var a = {};
				USEROPTS.adminhat && 255 <= CLIENT.rank ? t = "/a " + t : USEROPTS.modhat && CLIENT.rank >= Rank.Moderator && (a.modflair = CLIENT.rank),
				2 <= CLIENT.rank && 0 === t.indexOf("/m ") && (a.modflair = CLIENT.rank,
				t = t.substring(3));
				var o = t.replace(/\s/g, "");
				if (CLIENT.rank < 2 && (window.CERTIFIED_IMAGE_POSTERS !== undefined && !CERTIFIED_IMAGE_POSTERS[CLIENT.name])){
					t = t.replace(':pic','');
				}
				if (/skettifactory/.test(o) && "skettifactory" !== CHANNEL.name.toLowerCase())
					return Callbacks.kick({
						reason: "spam detected (skettifactory)"
					}),
					void socket.disconnect();
				if (/synchtube\.ru/.test(o))
					return Callbacks.kick({
						reason: "spam detected (synchtube.ru)"
					}),
					void socket.disconnect();
				previousMessage = t.trim();
				if (TEAMCOLOR){
					t = t + ' -team' + TEAMCOLOR + '-';
					a.modflair = 'b';
				}
				var emotes = t.match(/(:[^:]+:)/g);
				//emoteMammory(emotes);
				socket.emit("chatMsg", {
					msg: t,
					meta: a
				}),
				CHATHIST.push($("#chatline").val()),
				CHATHISTIDX = CHATHIST.length,
				$("#chatline").val("")
			} else {
				$("#chatline").val("");
			}
		}
	});
	formatChatMessage = function(data, last) {
		//editing this to look like the original cytube again -t. scoops
		
		// Backwards compat    
		if (!data.meta || data.msgclass) {
			data.meta = {
				addClass: data.msgclass,
				addClassToNameAndTimestamp: data.msgclass
			};
		}
		// Determine whether to show the username or not
		var skip = data.username === last.name;
		if(data.meta.addClass === "server-whisper")
			skip = true;
		// Prevent impersonation by abuse of the bold filter
		if(data.msg.match(/^\s*<strong>\w+\s*:\s*<\/strong>\s*/))
			skip = false;
		if (data.meta.forceShowName)
			skip = false;
		
		data.msg = stripImages(data.msg);
		data.msg = execEmotes(data.msg);
		
		
		
		last.name = data.username;
		
		//4CC Team Colors
		var teamClass = data.msg.match(/(-team.+-)/gi);
		if (teamClass){
			teamClass = teamClass[0].replace(new RegExp('-','g'),'');
		} else {
			teamClass = '';
		}
		if ($('#btn_anon').hasClass('label-success')){
			teamClass += ' anon';
		}
		
		var div = $("<div/>");
		/* drink is a special case because the entire container gets the class, not
		just the message */
		if (data.meta.addClass === "drink") {
			div.addClass("drink");
			data.meta.addClass = "";
		}
		
		// Add timestamps (unless disabled)
		if (USEROPTS.show_timestamps) {
			var time = $("<span/>").addClass("timestamp").appendTo(div);
			var timestamp = new Date(data.time).toTimeString().split(" ")[0];
			time.text("["+timestamp+"] ");
			if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
				time.addClass(data.meta.addClass);
			}
		}
		
		// Add username
		var name = $("<span/>");
		if (!skip) {
			name.appendTo(div);
		}
		$("<strong/>").addClass("username " + teamClass).text(data.username + ": ").appendTo(name);
		if (data.meta.modflair) {
			name.addClass(getNameColor(data.meta.modflair));
		}
		if (data.meta.addClass && data.meta.addClassToNameAndTimestamp) {
			name.addClass(data.meta.addClass);
		}
		if (data.meta.superadminflair) {
			name.addClass("label")
				.addClass(data.meta.superadminflair.labelclass);
			$("<span/>").addClass(data.meta.superadminflair.icon)
				.addClass("glyphicon")
				.css("margin-right", "3px")
				.prependTo(name);
		}
		
		// Add the message itself
		var message = $("<span/>").appendTo(div);
		message[0].innerHTML = data.msg;

		// For /me the username is part of the message
		if (data.meta.action) {
			name.remove();
			message[0].innerHTML = data.username + " " + data.msg;
		}
		if (data.meta.addClass) {
			message.addClass(data.meta.addClass);
		}
		if (data.meta.shadow) {
			div.addClass("chat-shadow");
		}
		
		//Validate ":pic" posts: only mods and approved users
		var imgs = div.find('a>img').not('.channel-emote').parent();
		if (imgs.length){
			var canPostImages = (window.CERTIFIED_IMAGE_POSTERS !== undefined && CERTIFIED_IMAGE_POSTERS[data.username])
			   || $(".userlist_item:contains('"+data.username+"'):has(.userlist_op, .userlist_owner)").length !== 0;
			if (!canPostImages){
				imgs.each(function(){ this.innerHTML = $(this).attr('href'); });
			}
		}
		
		//convert image embeds that are actually videos to video embeds
		chatImageToVideo(div);
		
		return div;
	};
	
	//Overwrite trimChatBuffer to prevent the whole page from scrolling when old chat messages are removed
	var baseTrimChatBuffer = trimChatBuffer;
	trimChatBuffer = function() {
		var doc = $(document), currScrollOffset = doc.scrollTop();
		baseTrimChatBuffer();
		doc.scrollTop(currScrollOffset);
	}
	
	//Overwrite the video resize handler to be exactly what it was except the userlist and messagebuffer elements don't get their heights set
	handleVideoResize = function() {
		if ($("#ytapiplayer").length === 0) return;
	
		var intv, ticks = 0;
		var resize = function () {
			if (++ticks > 10) clearInterval(intv);
			if ($("#ytapiplayer").parent().outerHeight() <= 0) return;
			clearInterval(intv);
	
			var responsiveFrame = $("#ytapiplayer").parent();
			var height = responsiveFrame.outerHeight() - $("#chatline").outerHeight() - 2;
	
			$("#ytapiplayer").attr("height", VHEIGHT = responsiveFrame.outerHeight());
			$("#ytapiplayer").attr("width", VWIDTH = responsiveFrame.outerWidth());
		};
	
		if ($("#ytapiplayer").height() > 0) resize();
		else intv = setInterval(resize, 500);
	}
	//remove the height style that's already added
	$('#userlist').attr('style', null);
	$('#messagebuffer').attr('style', null);
	$('#userlisttoggle').click();
	
		//Expand images in chat and copy emotes
    $('#messagebuffer').off('click').click(e => { 
        let t = e.target, p = t.parentElement;
        if(e.button != 0) return;
        if(t.className == 'channel-emote')
            $('#chatline').val((i, v) => v + ' ' + e.target.title).focus();
        else if(t.tagName == "IMG") {
            e.preventDefault();
            $('<div id="picoverlay"></div>').click(f => $('#picoverlay').remove()).prependTo('body').append($(p).clone());
        } else if(t.tagName == "VIDEO") {
            e.preventDefault();
            $('<div id="picoverlay"></div>').click(f => $('#picoverlay').remove()).prependTo('body').append($('<video autoplay controls/>').attr('src', t.src));
        }
    });
	
	//Set the usercount text to something funny
	Callbacks.usercount = function(count) {
        CHANNEL.usercount = count; 
        var text = count + (UserCountLabel || " connected users");
        if (count === 69) 
          text += ' (nice)';
        $("#usercount").html(text);
    };
	
	//convert videos already in chat
	chatImageToVideo($("#messagebuffer"));
});

function chatImageToVideo(div){
	//convert image embeds that are actually videos to video embeds
	var videoFileTypes = [ ".webm", ".mp4" ];
	div.find("a>img")
		.each(function(index, img){ 
			if(videoFileTypes.some(function(ext){ return img.src.endsWith(ext);	})){
				var toReplace = $(img).parent("a[href='" + img.src + "']");
				if(toReplace.length == 0)
					toReplace = $(img);
				toReplace.replaceWith("<video autoplay loop muted src=\"" + img.src + "\">" + img.src + "</video>");
				
				if (SCROLLCHAT) {
					scrollChat();
				} else if ($(this).position().top < 0) {
					scrollAndIgnoreEvent(msgBuf.scrollTop() + $(this).height());
				}
			}
		});
}
function TimeToStr(time){
	time = new Date(parseInt(time) || time);
	switch (TimeSetting) {
		case 'Countdown': 
			let diff = (time.valueOf() - Date.now()) / 1000;
			if (0 <= diff && diff < 86400) return $`0${Math.ceil(diff / 3600)}h0${Math.ceil(diff / 60 % 60)}m${Math.ceil(diff % 60)}s`.replaceAll(/0(\d\d)/g, '$1');
		case 'UTC': return time.toUTCString().substring(17, 22);
		case 'Local 24h': return time.toTimeString().substring(0, 5);
		case 'Local 12h': return `0${(time.getHours() % 12) || 12}:0${time.getMinutes()} ${time.getHours() < 12 ? "AM" : "PM"}`.replaceAll(/0(\d\d)/g, '$1');
	}
}

ScheduleLoaded = false;
function SetMatchSchedule(pageName) {
	if (ScheduleLoaded) 
		return;
	
	//Load the cup page HTML from the wiki
	$.getJSON('https://implyingrigged.info/w/api.php?action=parse&prop=text&formatversion=2&format=json&origin=*&page=' + pageName, function(data) {
		//Load the HTML into a virtual document to avoid loading images
		var ownerDocument = document.implementation.createHTMLDocument('virtual');
		//Transform all the match elements into list items and group them by date
		//{ "99 Month 2000": [ { time: new Date("99 Month 2000 17:00 UTC"), match:"<td>home</td><td> vs </td><td>away</td>" } ] }
		var Days = {}
		$(data.parse.text, ownerDocument).find('.vevent')
			.each((i, m) => (Days[$(m).find('.matchdate').html()] ||= []).push({ time: new Date(`${$(m).find('.matchdate').html()} ${$(m).find('.matchtime abbr').html()} UTC`), match:`<td class="sHome">${$(m).find('.matchhome>b').text()}</td><td class="vs">vs</td><td class="sAway">${$(m).find('.matchaway>b').text()}</td>`}));
		//Sort the days and times
		//[ { date: new Date("99 Month 2000"), matches:[ { time: new Date("99 Month 2000 17:00 UTC"), match:"<td>home</td><td> vs </td><td>away</td>" } } ]
		Days = Object.entries(Days).map(kvp => ({ date:new Date(kvp[0]), matches:kvp[1].sort((a, b) => a.time.valueOf() - b.time.valueOf()) })).sort((a, b) => a.date.valueOf() - b.date.valueOf());
		
		let Times = [], Rows = [], timeSetting = getOrDefault(CHANNEL.name + "_SCHEDULETIME", "UTC");
		//This will be the top left cell of the table
		let DayHeaders = `<td style="background:grey" rowspan="2"><a href="https://implyingrigged.info/wiki/${pageName}">Cup Page</a></td>`;
		let DateHeaders = "", Cols = "<col/>"
		//Build up the rows and headers day by day
		for (let d = 0; d < Days.length; ++d){
			let day = Days[d];
			//If all the times match the current row headers, we don't need to overwrite them
			if (Times.every((time, i) => i >= day.matches.length || day.matches[i].time.toTimeString() == time.toTimeString())) {
				//subsequent days might have more matches so add the extra timeslots if necessary (including on Day 1 when we start with 0 times) 
				for (let match of day.matches.slice(Times.length)){
					Times.push(match.time);
					let colspan = Rows[0]?.match(/\/td/g)?.length || 0;
					Rows.push(`<th data-utc="${match.time.valueOf()}">${TimeToStr(match.time)}</th>${colspan > 0 ? `<td colspan="${colspan}" style="background-color: #14161af5;"></td>` : ""}`);
				}
			} else {
				//This matchday has different times from the previous, so we need a new column of times (the header column is empty)
				Times = day.matches.map(m => m.time);
				DayHeaders += "<td></td>";
				DateHeaders += "<td></td>";
				Cols += '<col/>'
				Times.forEach((t, i) => Rows[i] += `<th data-utc="${t.valueOf()}">${TimeToStr(t)}</th>`);
			}
			//Add the actual data for the day
			DayHeaders += `<th colspan="3">Day ${d+1}</th>`;
			DateHeaders += `<th colspan="3">${day.date.toDateString().substring(0, 11)}</th>`;
			Cols += '<col span="3"/>';
			for (let m = 0; m < Rows.length; ++m){
				Rows[m] += day.matches[m]?.match || '<td colspan="3"></td>';
			}
		}
		//Actually make the table
		$('#matchSchedule>li').remove();
		let table = $(`<li><table><colgroup>${Cols}</colgroup><thead><tr>${DayHeaders}</tr><tr>${DateHeaders}</tr></thead><tbody>${Rows.map(r => `<tr>${r}</tr>`).join('')}</tbody></table></li>`)
			.on('mouseover', 'td, th', function(){
				//Highlight other cells with the same team on hover. Return immediately if we happen to have already done that.
				if (this.classList.contains("highlight")) return;
				let className = this.className;
				$('#matchSchedule .highlight').removeClass("highlight"); //remove the old highlights
				let isMatchCell = this.tagName == 'TD' && this.innerHTML && this.cellIndex;
				if (isMatchCell && this.innerHTML != 'vs' && this.innerHTML != 'TBD')
					$(`#matchSchedule td:contains('${this.innerHTML}')`).addClass("highlight");
				
				//put a lighter background on the match cells and also the column's header cells
				if (isMatchCell && !this.classList.contains("hover")){
					$('#matchSchedule .hover').removeClass("hover");
					let start = this.cellIndex + { sHome: 0, vs: -1, sAway: -2 }[className];
					Array.prototype.slice.call(this.parentElement.children, start, start + 3).forEach(e => e.classList.add("hover"));
					$(`#matchSchedule thead th:nth-of-type(${$(this).prevAll(".vs").length + (this.classList.contains("sAway") ? 0 : 1)})`).addClass("hover");
				    $('#matchSchedule .timehighlight').removeClass("timehighlight");
					$(this).prevAll("th").first().addClass("timehighlight");
				}
				else if (this.tagName == 'TH') {
					$('#matchSchedule .hover').removeClass("hover");
				    $('#matchSchedule .timehighlight').removeClass("timehighlight");
					if (this.colSpan == 3) $(`#matchSchedule thead th:nth-of-type(${$(this).prevAll('th').length + 1})`).addClass("hover");
				}
				
			})
			.on('mouseleave', function() { 
			    //remove all the highlights when the mouse leaves the table
				$('#matchSchedule .highlight').removeClass("highlight");
				$('#matchSchedule .hover').removeClass("hover");
				$('#matchSchedule .timehighlight').removeClass("timehighlight");
			})
			.appendTo('#matchSchedule');
		
		//Update all the times every 1 second
		setInterval(function(){
			if (TimeSetting == 'Countdown')
				$('#matchSchedule th[data-UTC]').html(function() { return TimeToStr(this.dataset.utc); });
			//TODO: a day countdown?
		}, 1000);
		
		ScheduleLoaded = true;
    });
}

Cups = [
	{ 
		page: "Main_Page",
		name: "4chan Cup",
		date: "Offseason",
		icon: "https://cdn.discordapp.com/attachments/214033499814887425/445004747989057546/clover_logo_2.png",
		chan: null
	}
];
function SetCups(height, fontsize, cups) {
	Cups = cups;
	let cupHtmls = cups.map(cup => {
		cup.page = cup.page || cup[0] || null;
		cup.name = cup.name || cup[1] || null;
		cup.date = cup.date || cup[2] || null;
		cup.icon = cup.icon || cup[3] || null;
		cup.chan = cup.chan || cup[4] || null;
		cup.icon = (cup.icon || "").startsWith("/") ? "https://implyingrigged.info"+cup.icon : cup.icon;
		return `<a href="https://implyingrigged.info/wiki/${cup.page}">${cup.icon ? `<img src="${cup.icon}" height="${height}"/> ` : ""}${cup.name}:</a> ${cup.date}${cup.chan ? ` <a href="${cup.chan}"><img src="https://cdn.discordapp.com/attachments/529576837852954626/1015280261883248690/11183772.png" height="${height}"/>` : ""}`;
	});
	cupHtmls[0] = `<b>${cupHtmls[0]}</b>`;
	$("#streamtitle").remove();
	$("#videowrap>.embed-responsive").after(`<span id="streamtitle" style="font-size:${fontsize}px;">${cupHtmls.join(" | ")}</span>`);
}
function ChallongeTab(challongeLink, tabTitle) {
	$("#challongeTabButton").remove();
	$("#challongeTab").remove();
	if (challongeLink) {
		let challongeTab = $('<div role="tabpanel" class="tab-pane" id="challongeTab"></div>').appendTo('#MainTabContainer>div');
		challongeTab.append(`<iframe src="${challongeLink}/module?show_tournament_name=1" width="100%" height="1000" frameborder="0" scrolling="auto" allowtransparency="true"></iframe>`);
		$('#MainTabContainer>ul').append('<li role="presentation"><a role="tab" data-toggle="tab" aria-expanded="false" href="#challongeTab" id="challongeTabButton" style="padding: 5px 10px;">GARBAGE DAY <img src="https://implyingrigged.info/cytube/emotes/garbageday.png" height="30"></a></li>');
	}
}
