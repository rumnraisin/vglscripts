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
		{id:"idolmaster",        color:"#F20972",icon:"/w/images/thumb/7/7a/%40_icon.png/38px-%40_icon.png"},
		{id:"2hug",	color:"#7FAC75",icon:"/w/images/thumb/3/34/2hug_icon.png/25px-2hug_icon.png"},
		{id:"acg",	color:"#206000",icon:"/w/images/thumb/3/31/Acg_icon.png/25px-Acg_icon.png"},
		{id:"aceg",	color:"#CE5200",icon:"/w/images/thumb/e/e5/Aceg_icon.png/25px-Aceg_icon.png"},
		{id:"akg",	color:"#171727",icon:"/w/images/thumb/0/07/Akg_icon.png/38px-Akg_icon.png"},
		{id:"assg",	color:"#C62B29",icon:"/w/images/5/55/Assg_icon.png"},
		{id:"dbg",	color:"#E08328",icon:"/w/images/thumb/f/ff/Dbg_icon.png/25px-Dbg_icon.png"},
		{id:"ddlc",	color:"#a9888b",icon:"/w/images/thumb/1/1c/Ddlc_icon.png/25px-Ddlc_icon.png"},
		{id:"digi",	color:"#FF9933",icon:"/w/images/thumb/4/42/Digi_icon.png/25px-Digi_icon.png"},
		{id:"dlg",	color:"#000175",icon:"/w/images/2/29/Dlg_icon.png"},
		{id:"dng",	color:"#FF6600",icon:"/w/images/thumb/c/cf/Dng_icon.png/38px-Dng_icon.png"},
		{id:"domg",	color:"#8A0707",icon:"/w/images/thumb/a/a6/Domg_icon.png/25px-Domg_icon.png"},
		{id:"drag",	color:"#008fb3",icon:"/w/images/thumb/6/6d/Drag_icon.png/38px-Drag_icon.png"},
		{id:"drg",	color:"#FFFFFF",icon:"/w/images/thumb/c/c6/Drg_icon.png/38px-Drg_icon.png"},
		{id:"eftg",     color:"#404040",icon:"/w/images/thumb/2/2c/Eftg_icon.png/38px-Eftg_icon.png"},
		{id:"egg",	color:"#C11200",icon:"/w/images/thumb/e/ef/Egg_icon.png/38px-Egg_icon.png"},
		{id:"feg",	color:"#0d426e",icon:"/w/images/thumb/3/3b/Feg_icon.png/25px-Feg_icon.png"},
		{id:"fg",	color:"#54C2F0",icon:"/w/images/thumb/d/da/Fg_icon.png/38px-Fg_icon.png"},
		{id:"fgoalter",	color:"#0b3d8e",icon:"/w/images/thumb/d/da/Fgoalter_icon.png/25px-Fgoalter_icon.png"},
		{id:"fgog",	color:"#900A1B",icon:"/w/images/thumb/7/75/Fgog_icon.png/25px-Fgog_icon.png"},
		{id:"gbfg",	color:"#4561BA",icon:"/w/images/thumb/4/4f/Gbfg_icon.png/25px-Gbfg_icon.png"},
		{id:"gbpen",	color:"#E50050",icon:"/w/images/thumb/5/55/Gbpen_icon.png/38px-Gbpen_icon.png"},
		{id:"gfg",	color:"#ffaa00",icon:"/w/images/thumb/1/12/Gfg_icon.png/38px-Gfg_icon.png"},
		{id:"gig",	color:"#822b18",icon:"/w/images/thumb/a/ab/Gig_icon.png/25px-Gig_icon.png"},
		{id:"hanny",	color:"#E11212",icon:"/w/images/thumb/8/80/Hanny_icon.png/25px-Hanny_icon.png"},
		{id:"hgg2d",    color:"#5DADEC",icon:"/w/images/thumb/7/7a/Hgg2d_icon.png/38px-Hgg2d_icon.png"},
		{id:"indie",	color:"#471f10",icon:"/w/images/thumb/9/93/Indie_icon.png/25px-Indie_icon.png"},
		{id:"ink",	color:"#FE902F",icon:"/w/images/thumb/f/f0/Ink_icon.png/38px-Ink_icon.png"},
		{id:"kfg",	color:"#F8C166",icon:"/w/images/thumb/e/ee/Kfg_icon.png/38px-Kfg_icon.png"},
		{id:"llsifg",	color:"#E7147E",icon:"/w/images/thumb/1/14/Llsifg_icon.png/25px-Llsifg_icon.png"},
		{id:"lolg",	color:"#003366",icon:"/w/images/thumb/e/ef/Lolg_icon.png/38px-Lolg_icon.png"},
		{id:"mbg",	color:"#A10000",icon:"/w/images/thumb/3/32/Mbg_icon.png/25px-Mbg_icon.png"},
		{id:"mjg",	color:"#2956B9",icon:"/w/images/thumb/e/e7/Mjg_icon.png/38px-Mjg_icon.png"},
		{id:"mmg",	color:"#083D8C",icon:"/w/images/thumb/9/9b/Mmg_icon.png/38px-Mmg_icon.png"},
		{id:"nepgen",	color:"#4E3483",icon:"/w/images/thumb/4/43/Nepgen_icon.png/25px-Nepgen_icon.png"},
		{id:"PMMM",	color:"#F7D2E9",icon:"/w/images/thumb/1/14/Pmmm_icon.png/25px-Pmmm_icon.png"},
		{id:"r6g",	color:"#000000",icon:"/w/images/thumb/f/f2/R6g_icon.png/38px-R6g_icon.png"},
		{id:"revue",	color:"#FF0000",icon:"/w/images/thumb/7/73/Revue_icon.png/38px-Revue_icon.png"},
		{id:"sgg",	color:"#3979DD",icon:"/w/images/thumb/d/d4/Sgg_icon.png/38px-Sgg_icon.png"},
		{id:"skg",	color:"#E44F4B",icon:"/w/images/thumb/d/d8/Skg_icon.png/25px-Skg_icon.png"},
		{id:"ssbg",	color:"#630090",icon:"/w/images/thumb/6/62/Ssbg_icon.png/38px-Ssbg_icon.png"},
		{id:"tf2g",	color:"#BD3B3B",icon:"/w/images/thumb/2/24/Tf2g_icon.png/25px-Tf2g_icon.png"},
		{id:"tnm",	color:"#E46520",icon:"/w/images/thumb/e/e7/Tnm_icon.png/38px-Tnm_icon.png"},
		{id:"twg",	color:"#990000",icon:"/w/images/thumb/b/b2/Twg_icon.png/38px-Twg_icon.png"},
		{id:"vitagen",	color:"#000000",icon:"/w/images/thumb/4/47/Vitagen_icon.png/25px-Vitagen_icon.png"},
		{id:"vn",	color:"#FFFFFF",icon:"/w/images/thumb/f/fb/Vn_icon.png/25px-Vn_icon.png"},
		{id:"vrg",	color:"#34c7cf",icon:"/w/images/thumb/d/d6/Vrg_icon.png/25px-Vrg_icon.png"},
		{id:"wtg",	color:"#DE0000",icon:"/w/images/thumb/4/4f/Wtg_icon.png/25px-Wtg_icon.png"},
		{id:"きらら",	color:"#ff678f",icon:"/w/images/thumb/9/9a/%E3%81%8D%E3%82%89%E3%82%89_icon.png/25px-%E3%81%8D%E3%82%89%E3%82%89_icon.png"},
	],
	"meme":[
		{id:"a",	color:"#FF0099",icon:"/w/images/thumb/3/3a/A_icon.png/25px-A_icon.png"},
		{id:"sp",	color:"#990000",icon:"/w/images/thumb/8/83/Sp_icon.png/25px-Sp_icon.png"},
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
