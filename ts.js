var TeamLists = {};
var AllTeams = {};
var CurrentTeamList = null; 
var CurrentTeamListName;
var defaultIconSrc = "https://implyingrigged.info/w/images/d/df/Vglg_icon.png";
var scrollingToTeam = false;

function setTeamList(teamList){
	var teamListName = "";
	if(typeof(teamList) === 'string'){
		teamListName = teamList;
		teamList = TeamLists[teamList];
	}
	
	if(teamListName != "" && teamListName === CurrentTeamListName)
		return;
	
	if(typeof(UserCustomTeamList) !== 'undefined')
		teamList = teamList.concat(UserCustomTeamList);
	
	var tmpTeamsCssLines = [ '<style type="text/css" id="iconcss_tmp">' ];
	$("#messagebuffer").removeClass("teamlist_" + CurrentTeamListName);
	$("#messagebuffer").addClass("teamlist_" + teamListName);
	
	var newSelector = $("#selectteam ul");
	newSelector.html('<li tabindex="0" data-val=""><img src="' + defaultIconSrc + '"></li>');
	
	var selectedColorInList = false;
	var addOption = function(teamObj){
		if(!teamObj.ExclusiveTo || teamObj.ExclusiveTo == CLIENT.name){
			newSelector.append('<li tabindex="0" data-val="' + teamObj.id + '"><img src="' + teamObj.icon + '"><p>' + teamObj.name + '</p></li>');
			
			selectedColorInList = selectedColorInList || teamObj.id === TEAMCOLOR;
		}
	};
	teamList.forEach(function(team){
		if(typeof(team) === 'string' && AllTeams.hasOwnProperty(team)){
			addOption(AllTeams[team]);
		}
		else if(typeof(team) === 'object'){
			if(!AllTeams.hasOwnProperty(team.id) || teamListName == ""){
				InitTeam(team);
				tmpTeamsCssLines.push(team.css);
			}
			addOption(team);
		}
		 
	});
	
	if (tmpTeamsCssLines.length > 1){
		tmpTeamsCssLines.push('</style>');
		$('#iconcss_tmp').remove();
		$(document.head).append(tmpTeamsCssLines.join('\n'));
	}
	
	if(selectedColorInList){
		$("#selectteam li[data-val='"+TEAMCOLOR+"']").click();
	}
	else{
		$("#selectteam li:first").click();
	}
	
	CurrentTeamList = teamList;
	CurrentTeamListName = teamListName;
};

function InitTeamLists(){
	var cssLines = [
		'<style type="text/css" id="iconcss">'
	];
	Object.keys(TeamLists).forEach(function(key){
		var list = TeamLists[key];
		cssLines.push("\n/* " + key + " */");
		list.forEach(function(team){
			if(typeof(team) === 'object'){
				InitTeam(team);
				cssLines.push(team.css);
			}
		});
	});
	cssLines.push('</style>');
	
	var css = cssLines.join('\n');
	
	$("#iconcss").remove();
	$(document.head).append(css);
	
	$("#selectteam").remove();
	$("#chatline2").remove();
	$('<textarea class="form-control" id="chatline2" rows="1"></textarea>').insertAfter('#chatline');
	var dropup = $('<span class="dropup"></span>');
	var selectteam = $('<div id="selectteam"></div>').insertBefore('#chatwrap>form').append(dropup);
	dropup.append('<img class="dropdown-toggle" data-toggle="dropdown" title="Team Icon">');
	dropup.on('shown.bs.dropdown', function(){
		var elm = $('#selectteam li[data-val="'+TEAMCOLOR+'"]');
		if(elm && elm[0]){
			elm[0].parentNode.scrollTop = elm[0].offsetTop;
			elm[0].focus({preventScroll:true});
		}
	});
	var iconsPerRow = 11;
	$('<ul class="dropdown-menu"></ul>').appendTo(dropup)
		.on("click", "li", function(){
			TEAMCOLOR = this.dataset.val;
			setOpt(CHANNEL.name + "_TEAMCOLOR", TEAMCOLOR);
			if(TEAMCOLOR)
				$("#selectteam>span>img").attr("src", AllTeams[TEAMCOLOR].icon);
			else
				$("#selectteam>span>img").attr("src", defaultIconSrc);
		}).on("mouseover", "li", function(){
			if(!scrollingToTeam)
				this.focus({preventScroll:true});
			scrollingToTeam = false;
		}).on("keydown", function(event){
			var selected = $(document.activeElement);
			var elm = null;
			switch (event.key){
				case 'ArrowUp': case 'Up':
					if(selectteam.hasClass('grid')) {
						var length = selected.siblings().length;
						var iconsInLastRow = length % iconsPerRow;
						var indexAbove = selected.index() - iconsPerRow;
						if(iconsInLastRow != 0 && selected.index() >= (Math.floor(length / iconsPerRow) * iconsPerRow))
							indexAbove += Math.floor((iconsPerRow - iconsInLastRow) / 2);
						if(indexAbove >= 0)
							elm = $(selected.parent().children()[indexAbove]);
					} else
						elm = selected.prev();
					break;
				case 'ArrowDown': case 'Down':
					if(selectteam.hasClass('grid')) {
						var length = selected.siblings().length;
						var iconsInLastRow = length % iconsPerRow;
						var indexBelow = selected.index() + iconsPerRow;
						if(iconsInLastRow != 0 && indexBelow >= (Math.floor(length / iconsPerRow) * iconsPerRow)) {
							var lastRowAdjustment = Math.floor((iconsPerRow - iconsInLastRow) / 2);
							var indexInLastRow = indexBelow % iconsPerRow;
							if(indexInLastRow >= lastRowAdjustment)
								elm = $(selected.parent().children()[indexBelow - lastRowAdjustment]);
						} else if(indexBelow < selected.siblings().length)
							elm = $(selected.parent().children()[indexBelow]);
					} else
						elm = selected.next();
					break;
				case 'ArrowLeft': case 'Left':
					if(selectteam.hasClass('grid') && selected.index() % iconsPerRow != 0)
						elm = selected.prev();
					break;
				case 'ArrowRight': case 'Right':
					if(selectteam.hasClass('grid') && (selected.index()+1) % iconsPerRow != 0)
						elm = selected.next();
					break;
				case 'Tab':
					elm = event.shiftKey ? selected.prev() : selected.next();
					break;
				case 'Backspace': case 'Delete':
				    elm = $('#selectteam li:first-child');
					break;
				case 'Enter':
					event.stopPropagation();
					if(selected.parentsUntil('#selectteam').length)
						selected.click();
					break;
				case 'Escape':
					event.stopPropagation();
					selectteam.children('.dropdown-toggle').click();
					break;
				default: 
					if(event.key.length == 1){
						var itemSel = 'li[data-val^="'+event.key.toLowerCase()+'"]';
						elm = $('#selectteam li:focus~'+itemSel).first();
						if(!elm.length) elm = $('#selectteam '+itemSel).first();
					}
					break;
			}
			if(elm && elm[0]){
				event.stopPropagation();
				event.preventDefault();
				var liRect = elm[0].getBoundingClientRect();
				var ulRect = elm.parent()[0].getBoundingClientRect();
				if(liRect.top < ulRect.top || liRect.bottom > ulRect.bottom){
					scrollingToTeam = true;
					elm[0].parentNode.scrollTop = elm[0].offsetTop;
				}
				elm[0].focus({preventScroll:true});
			}
		});
	
}

function InitTeam(team) {
	if(team.icon.startsWith("/")){
		team.icon = "https://implyingrigged.info" + team.icon;
	}
	if(!team.hasOwnProperty('name')){
		team.name = '/' + team.id + '/';
	}
	
	var cssSel = (team.ExclusiveTo ? ".chat-msg-" + team.ExclusiveTo + " ": "") + ".team" + team.id;
	team.css = cssSel+"{ color:"+team.color+"!important;} "+cssSel+"::before{ background-image:url('"+team.icon+"')!important;}";
	
	if(!AllTeams.hasOwnProperty(team.id))
		AllTeams[team.id] = team;
}

var TeamLists = {
	"4cc":[
		{id:"idolmaster",   color:"#41DCFF",icon:"/w/images/7/7a/%40_icon.png"},
		{id:"2hug",			color:"#7FAC75",icon:"/w/images/3/34/2hug_icon.png"},
		{id:"aceg",			color:"#CE5200",icon:"/w/images/e/e5/Aceg_icon.png"},
		{id:"akg",			color:"#171727",icon:"/w/images/0/07/Akg_icon.png"},
		{id:"alg",			color:"#72E6F5",icon:"/w/images/e/eb/Alg_icon.png"},
		{id:"assg",			color:"#C62B29",icon:"/w/images/5/55/Assg_icon.png"},
		{id:"bag",			color:"#01D2FF",icon:"/w/images/d/dd/Bag_icon.png"},
		{id:"dbg",			color:"#E08328",icon:"/w/images/f/ff/Dbg_icon.png"},
		{id:"ddlc",			color:"#a9888b",icon:"/w/images/1/1c/Ddlc_icon.png"},
		{id:"egg",			color:"#C11200",icon:"/w/images/e/ef/Egg_icon.png"},
		{id:"feg",			color:"#0d426e",icon:"/w/images/3/3b/Feg_icon.png"},
		{id:"fg",			color:"#54C2F0",icon:"/w/images/d/da/Fg_icon.png"},
		{id:"fgoalter",		color:"#0b3d8e",icon:"/w/images/d/da/Fgoalter_icon.png"},
		{id:"fgog",			color:"#900A1B",icon:"/w/images/7/75/Fgog_icon.png"},
		{id:"gbfg",			color:"#4561BA",icon:"/w/images/4/4f/Gbfg_icon.png"},
		{id:"gbpen",		color:"#E50050",icon:"/w/images/5/55/Gbpen_icon.png"},
		{id:"gfg",			color:"#ffaa00",icon:"/w/images/1/12/Gfg_icon.png"},
		{id:"gig",			color:"#822b18",icon:"/w/images/a/ab/Gig_icon.png"},
		{id:"ggg",			color:"#CC0000",icon:"/w/images/4/49/Ggg_icon.png"},
		{id:"hanny",		color:"#E11212",icon:"/w/images/8/80/Hanny_icon.png"},
		{id:"hgg2d",    	color:"#5DADEC",icon:"/w/images/7/7a/Hgg2d_icon.png"},
		{id:"hsrg",			color:"#6a060e",icon:"/w/images/f/f5/Hsrg_icon.png"},
		{id:"indie",		color:"#471f10",icon:"/w/images/9/93/Indie_icon.png"},
		{id:"ink",			color:"#FE902F",icon:"/w/images/f/f0/Ink_icon.png"},
		{id:"kfg",			color:"#F8C166",icon:"/w/images/e/ee/Kfg_icon.png"},
		{id:"lcg",		color:"#7F0000",icon:"/w/images/5/5b/Lcg_icon.png"},
		{id:"llsifg",		color:"#E7147E",icon:"/w/images/1/14/Llsifg_icon.png"},
		{id:"mmg",			color:"#083D8C",icon:"/w/images/9/9b/Mmg_icon.png"},
		{id:"nepgen",		color:"#4E3483",icon:"/w/images/4/43/Nepgen_icon.png"},
		{id:"nikg",		color:"#f7f6ee",icon:"/w/images/8/8b/Nikg_icon.png"},
		{id:"omg",			color:"#62FFFC",icon:"/w/images/8/89/Omg_icon.png"},
		{id:"pcrg",			color:"#FF8600",icon:"/w/images/c/c8/Pcrg_icon.png"},
		{id:"pg",			color:"#14001B",icon:"/w/images/2/20/Pg_icon.png"},
		{id:"PMMM",			color:"#F7D2E9",icon:"/w/images/1/14/Pmmm_icon.png"},
		{id:"psg",			color:"#00CDBA",icon:"/w/images/9/96/Psg_icon.png"},
		{id:"revue",		color:"#FF0000",icon:"/w/images/7/73/Revue_icon.png"},
		{id:"skg",			color:"#E44F4B",icon:"/w/images/d/d8/Skg_icon.png"},
		{id:"smbg",			color:"#B30000",icon:"/w/images/3/3f/Smbg_icon.png"},
		{id:"smtg",     	color:"#FFFF00",icon:"/w/images/8/81/Smtg_icon.png"},
		{id:"ss13g",		color:"#827F7F",icon:"/w/images/2/2f/Ss13g_icon.png"},
		{id:"tf2g",			color:"#BD3B3B",icon:"/w/images/2/24/Tf2g_icon.png"},
		{id:"twg",			color:"#990000",icon:"/w/images/b/b2/Twg_icon.png"},
		{id:"uma",			color:"#796BAA",icon:"/w/images/2/22/Uma_icon.png"},
		{id:"utg",			color:"#67A4E0",icon:"/w/images/d/d1/Utg_icon.png"},
		{id:"vgt",			color:"#BFBFBF",icon:"/w/images/0/0a/Vgt_icon.png"},
		{id:"vitagen",		color:"#000000",icon:"/w/images/4/47/Vitagen_icon.png"},
		{id:"vn",			color:"#FFFFFF",icon:"/w/images/f/fb/Vn_icon.png"},
		{id:"vrg",			color:"#34c7cf",icon:"/w/images/d/d6/Vrg_icon.png"},
		{id:"wtg",		color:"#de0000",icon:"/w/images/4/4f/Wtg_icon.png"},
		{id:"xgg",			color:"#c21133",icon:"/w/images/2/2c/Xgg_icon.png"},
	],
	"meme":[
		{id:"animeswords",	color:"#E31B22",icon:"/w/images/thumb/b/b4/Animeswords_icon.png/25px-Animeswords_icon.png"},
		{id:"aniplex",	color:"#3838A6",icon:"/w/images/thumb/0/0f/Aniplex_icon.png/25px-Aniplex_icon.png"},
		{id:"ccpg",	color:"#DE2910",icon:"/w/images/thumb/f/fd/Ccpg_icon.png/25px-Ccpg_icon.png"},
		{id:"cute",	color:"#EBA39D",icon:"https://implyingrigged.info/w/images/thumb/6/63/Cute_icon.png/25px-Cute_icon.png"},
		{id:"cygames",	color:"#61AFEF",icon:"https://implyingrigged.info/w/images/thumb/f/fb/Cygames_icon.png/25px-Cygames_icon.png"},
		{id:"eroge",	color:"#FFCC4D",icon:"https://implyingrigged.info/w/images/thumb/f/f6/Eroge_icon.png/25px-Eroge_icon.png"},
		{id:"racism",	color:"#FFF219",icon:"https://implyingrigged.info/w/images/thumb/9/9a/Racism_icon.png/25px-Racism_icon.png"},
		{id:"skfc",	color:"#FFFFFF",icon:"https://implyingrigged.info/w/images/thumb/b/bc/Skfc_icon.png/25px-Skfc_icon.png"},
		{id:"tamsoft",	color:"#023894",icon:"https://implyingrigged.info/w/images/thumb/9/9c/Tamsoft_icon.png/25px-Tamsoft_icon.png"},
	]


	/* when somebody makes an invitational and the teams are all in a neat multi-column list on the page,
	   inspect element > right-click > store as global variable > then in the console (edit as needed):
		[].slice.call(temp1.querySelectorAll('li')).map(function(li){ return { id:li.querySelector('b a').innerHTML.replace('/', '').replace('/', ''), color:'#999999', icon:li.querySelector('img').getAttribute('src') }; })
	*/
};

InitTeamLists();

if(getOrDefault(CHANNEL.name + "_SELECTTEAM_GRID", false))
	$('#toggleTeamSelStyle').click();
var TEAMCOLOR = getOrDefault(CHANNEL.name + "_TEAMCOLOR", '');
setTeamList("4cc");
if (TEAMCOLOR){
	$("#selectteam>span>img").attr("src", AllTeams[TEAMCOLOR].icon);
}
else{
	$("#selectteam>span>img").attr("src", defaultIconSrc);
}


//Format messages upon page load because they're handled differently and I can't find the function
$('.teamColorSpan').each(function(){
	var color = $(this).text().replace(new RegExp('-','g'),'');
	$(this).parent().parent().find('.username').addClass(color);
});
$('#messagebuffer div span').each(function(){
	var teamClass = $(this).html().match(/(\|@.+@\|)/gi);
	if (teamClass){
		$(this).html($(this).html().replace(teamClass[0],''));
		teamClass = 'team' + teamClass[0].replace('|@','').replace('@|','');
		console.log(teamClass);
		$(this).parent().find('.username').addClass(teamClass);
	} else {
		teamClass = '';
	}
});
