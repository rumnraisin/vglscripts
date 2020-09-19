$('<link id="chanfavicon" href="https://implyingrigged.info/w/images/d/df/Vglg_icon.png" type="image/x-icon" rel="shortcut icon" />').appendTo("head");
$('.navbar-brand').attr('href','https://implyingrigged.info/wiki/Main_Page').text(' /vg/ League').css('padding', '0 10px 0 0').prepend('<img src="https://implyingrigged.info/w/images/d/df/Vglg_icon.png" style="display: inline;" height="20"/>');
$('head').append('<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/rumnraisin/vglscripts/nnd.js">');
$('head').append('<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/rumnraisin/vglscripts/ts.js">');
//$('head').append('<script type="text/javascript" src="https://implyingrigged.info/cytube/anon.js">');
$('head').append('<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/rumnraisin/vglscripts/em.js">');
//keep track of all the users that ever enter chat
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
		$('#nav-collapsible ul:first-child').append("<li class='dropdown'><a class='dropdown-toggle' href='#' data-toggle='dropdown' aria-expanded='false'>Match Schedule<b class='caret'></b></a><ul class='dropdown-menu' id='matchSchedule'><li>Times in UTC</li></ul></li>");
		for(var i = 1; i <= 24; i++){
			if (i == 1){
				$('#matchSchedule').append('<li id="day1"></li>');
			} else if (i == 9) {
				$('#matchSchedule').append('<li id="day2"></li>');
			} else if (i == 17){
				$('#matchSchedule').append('<li id="day3"></li>');
			}
			$('#matchSchedule').append('<li id="match' + i + '"></li>');
		}
		$('#matchSchedule').append("<li><a style='background:grey' href='https://implyingrigged.info/wiki/2019_4chan_Winter_Cup'>Cup Page</a></li>");
		//Other shit
		$('#nav-collapsible ul:first-child').append("<li class='dropdown'><a target='_blank' href='https://implyingrigged.info/gametips/'>Submit a Gametip</a></li>");
		$('#nav-collapsible ul:first-child').append('<li><a href="https://www.youtube.com/c/The4chanCup?sub_confirmation=1" target="_blank">Get notifications when LIV</a></li>');
		$('#nav-collapsible ul:first-child').append('<li><a href="https://www.youtube.com/c/The4chanCup" target="_blank"><img src="https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico"/></a></li>');
		$('#nav-collapsible ul:first-child').append('<li><a href="https://boards.4channel.org/vg/catalog#s=4ccg" target="_blank"><img src="https://s.4cdn.org/image/favicon.ico"/></a></li>');
		$('#nav-collapsible ul:first-child').append('<li><a href="https://www.twitch.tv/fourchannelcup" target="_blank"><img src="https://assets.help.twitch.tv/favicon.ico" width=16 /></a></li>');
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
		var baseCalendarUrl = '//www.google.com/calendar/embed?showTitle=0&showNav=1&showDate=1&showTabs=1&showCalendars=1&showTz=1&wkst=1&showPrint=0&hl=en&';
		var calendars = getOrDefault(CHANNEL.name + '_CALENDARS', null);
		if(!Array.isArray(calendars)) setOpt(CHANNEL.name + '_CALENDARS', calendars = [{ src:'d09uh6gjr0t943thp341ldlo6c%40group.calendar.google.com', color:'2952A3' } ]); //set the default calendar if not already
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
