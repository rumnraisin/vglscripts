var TeamLists = {};
var AllTeams = {};
var CurrentTeamList = null; 
var CurrentTeamListName;
var defaultIconSrc = "https://cdn.discordapp.com/attachments/214033499814887425/445004747989057546/clover_logo_2.png";
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
		{id:"3",	color:"#33CCCC",icon:"/w/images/thumb/4/41/3_icon.png/25px-3_icon.png"},
		{id:"a",	color:"#FF0099",icon:"/w/images/thumb/3/3a/A_icon.png/25px-A_icon.png"},
		{id:"aco",	color:"#FFFFFF",icon:"/w/images/thumb/2/23/Aco_icon.png/25px-Aco_icon.png"},
		{id:"adv",	color:"#A67B5A",icon:"/w/images/thumb/1/1b/Adv_icon.png/25px-Adv_icon.png"},
		{id:"an",	color:"#FF9900",icon:"/w/images/thumb/7/79/An_icon.png/25px-An_icon.png"},
		{id:"asp",	color:"#D21400",icon:"/w/images/thumb/f/f3/Asp_icon.png/25px-Asp_icon.png"},
		{id:"b",	color:"#749755",icon:"/w/images/thumb/9/9f/B_icon.png/25px-B_icon.png"},
		{id:"bant",	color:"#3c65a7",icon:"/w/images/thumb/1/1b/Bant_icon.png/25px-Bant_icon.png"},
		{id:"biz",	color:"#FCC119",icon:"/w/images/thumb/0/04/Biz_icon.png/25px-Biz_icon.png"},
		{id:"c",	color:"#FFC0C0",icon:"/w/images/thumb/1/18/C_icon.png/25px-C_icon.png"},
		{id:"cgl",	color:"#EA00FF",icon:"/w/images/thumb/c/ce/Cgl_icon.png/25px-Cgl_icon.png"},
		{id:"ck",	color:"#FFCC00",icon:"/w/images/thumb/f/f4/Ck_icon.png/25px-Ck_icon.png"},
		{id:"cm",	color:"#33FFFF",icon:"/w/images/thumb/c/c3/Cm_icon.png/25px-Cm_icon.png"},
		{id:"co",	color:"#E10000",icon:"/w/images/thumb/8/8d/Co_icon.png/25px-Co_icon.png"},
		{id:"d",	color:"#513082",icon:"/w/images/thumb/e/e0/D_icon.png/25px-D_icon.png"},
		{id:"diy",	color:"#432a02",icon:"/w/images/thumb/8/8a/Diy_icon.png/25px-Diy_icon.png"},
		{id:"e",	color:"#F6A5AE",icon:"/w/images/thumb/9/96/E_icon.png/25px-E_icon.png"},
		{id:"f",	color:"#009966",icon:"/w/images/thumb/2/2c/F_icon.png/25px-F_icon.png"},
		{id:"fa",	color:"#000000",icon:"/w/images/thumb/5/5e/Fa_icon.png/25px-Fa_icon.png"},
		{id:"fit",	color:"#FFE600",icon:"/w/images/thumb/2/20/Fit_icon.png/25px-Fit_icon.png"},
		{id:"g",	color:"#BBBAFF",icon:"/w/images/thumb/5/53/G_icon.png/25px-G_icon.png"},
		{id:"gd",	color:"slategray",icon:"/w/images/thumb/e/e1/Gd_icon.png/25px-Gd_icon.png"},
		{id:"gif",	color:"#D21400",icon:"/w/images/thumb/6/6c/Gif_icon.png/25px-Gif_icon.png"},
		{id:"h",	color:"#87CEEB",icon:"/w/images/thumb/f/f0/H_icon.png/25px-H_icon.png"},
		{id:"his",	color:"#FCD405",icon:"/w/images/thumb/1/17/His_icon.png/25px-His_icon.png"},
		{id:"i",	color:"#498fcb",icon:"/w/images/thumb/f/f4/I_icon.png/25px-I_icon.png"},
		{id:"int",	color:"#FFFFFF",icon:"/w/images/thumb/0/08/Int_icon.png/25px-Int_icon.png"},
		{id:"jp",	color:"#CC99FF",icon:"/w/images/thumb/8/82/Jp_icon.png/25px-Jp_icon.png"},
		{id:"k",	color:"#669933",icon:"/w/images/thumb/5/54/K_icon.png/25px-K_icon.png"},
		{id:"lgbt",	color:"#4b2f4b",icon:"/w/images/thumb/2/24/Lgbt_icon.png/25px-Lgbt_icon.png"},
		{id:"lit",	color:"#777777",icon:"/w/images/thumb/8/80/Lit_icon.png/25px-Lit_icon.png"},
		{id:"m",	color:"#FF8080",icon:"/w/images/thumb/e/e8/M_icon.png/25px-M_icon.png"},
		{id:"mlp",	color:"#9966FF",icon:"/w/images/thumb/d/d4/Mlp_icon.png/25px-Mlp_icon.png"},
		{id:"mu",	color:"#00CC00",icon:"/w/images/thumb/e/e6/Mu_icon.png/25px-Mu_icon.png"},
		{id:"n",	color:"#336633",icon:"/w/images/thumb/5/55/N_icon.png/25px-N_icon.png"},
		{id:"o",	color:"#EE1B2C",icon:"/w/images/thumb/7/7b/O_icon.png/25px-O_icon.png"},
		{id:"out",	color:"#347235",icon:"/w/images/thumb/f/f4/Out_icon.png/25px-Out_icon.png"},
		{id:"p",	color:"#901719",icon:"/w/images/thumb/2/26/P_icon.png/25px-P_icon.png"},
		{id:"po",	color:"#E4EDED",icon:"/w/images/thumb/4/4c/Po_icon.png/25px-Po_icon.png"},
		{id:"pol",	color:"#dd0000",icon:"/w/images/thumb/0/0c/Pol_icon.png/25px-Pol_icon.png"},
		{id:"r9k",	color:"#480008",icon:"/w/images/thumb/f/f9/R9k_icon.png/25px-R9k_icon.png"},
		{id:"s4s",	color:"#DAA520",icon:"/w/images/thumb/3/31/S4s_icon.png/25px-S4s_icon.png", name:"[s4s]"},
		{id:"sci",	color:"#0047AB",icon:"/w/images/thumb/e/e1/Sci_icon.png/25px-Sci_icon.png"},
		{id:"soc",	color:"#FDB73B",icon:"/w/images/thumb/b/be/Soc_icon.png/25px-Soc_icon.png"},
		{id:"sp",	color:"#990000",icon:"/w/images/thumb/8/83/Sp_icon.png/25px-Sp_icon.png"},
		{id:"t",	color:"#CB2D30",icon:"/w/images/thumb/d/d9/T_icon.png/25px-T_icon.png"},
		{id:"tg",	color:"#0033FF",icon:"/w/images/thumb/5/54/Tg_icon.png/25px-Tg_icon.png"},
		{id:"trv",	color:"#FFB90F",icon:"/w/images/thumb/8/8e/Trv_icon.png/25px-Trv_icon.png"},
		{id:"toy",	color:"#996633",icon:"/w/images/thumb/e/e4/Toy_icon.png/25px-Toy_icon.png"},
		{id:"tv",	color:"#00FF88",icon:"/w/images/thumb/3/3b/Tv_icon.png/25px-Tv_icon.png"},
		{id:"u",	color:"#E35496",icon:"/w/images/thumb/4/4d/U_icon.png/25px-U_icon.png"},
		{id:"v",	color:"#9900FF",icon:"/w/images/thumb/4/44/V_icon.png/25px-V_icon.png"},
		{id:"vg",	color:"#1E36B9",icon:"/w/images/thumb/f/f1/Vg_icon.png/25px-Vg_icon.png"},
		{id:"vr",	color:"#999999",icon:"/w/images/thumb/f/ff/Vr_icon.png/25px-Vr_icon.png"},
		{id:"vp",	color:"#2E62AD",icon:"/w/images/thumb/1/15/Vp_icon.png/25px-Vp_icon.png"},
		{id:"w",	color:"#FF4000",icon:"/w/images/thumb/c/c9/W_icon.png/25px-W_icon.png"},
		{id:"wg",	color:"#3760AE",icon:"/w/images/thumb/0/0a/Wg_icon.png/25px-Wg_icon.png"},
		{id:"wsg",	color:"#ff0a4d",icon:"/w/images/thumb/c/cb/Wsg_icon.png/25px-Wsg_icon.png"},
		{id:"x",	color:"#000000",icon:"/w/images/thumb/4/43/X_icon.png/25px-X_icon.png"},
		{id:"y",	color:"#004529",icon:"/w/images/thumb/2/2f/Y_icon.png/25px-Y_icon.png"},
	],
	"Retardy":[
		//these icons are from https://www.mariowiki.com/Emblem
		{id:"mario",	color:"red",	icon:"https://www.mariowiki.com/images/2/20/MKDSEmblemMario.png"},
		{id:"wario",	color:"yellow",	icon:"https://www.mariowiki.com/images/6/6d/MKDSEmblemWario.png"},
		{id:"luigi",	color:"green",	icon:"https://www.mariowiki.com/images/4/4e/MP8_Luigi_Icon.png"},
		{id:"waluigi",	color:"purple",	icon:"https://www.mariowiki.com/images/8/84/MP8_Waluigi_Icon.png"},
		{id:"peach",	color:"pink",	icon:"https://www.mariowiki.com/images/2/29/PrincessPeachEmblem.png"},
		{id:"daisy",	color:"orange",	icon:"https://www.mariowiki.com/images/e/ee/DaisyEmblem.png"},
		{id:"yoshi",	color:"green",	icon:"https://www.mariowiki.com/images/b/b7/MP8_Yoshi_Icon.png"},
		{id:"toad",		color:"red",	icon:"https://www.mariowiki.com/images/1/15/Toademblem.png"},
		{id:"dk",		color:"brown",	icon:"https://www.mariowiki.com/images/8/8d/MKDSEmblemDK.png"},
		{id:"bobby",	color:"orange",	icon:"https://www.mariowiki.com/images/5/57/MK8D_Bowser_Jr_Emblem.png"},
		{id:"boo",		color:"white",	icon:"https://www.mariowiki.com/images/thumb/9/96/Booemblem.png/120px-Booemblem.png"},
		{id:"toadette",	color:"pink",	icon:"https://www.mariowiki.com/images/f/f2/Toadetteemblem.png"},
		{id:"birdo",	color:"pink",	icon:"https://www.mariowiki.com/images/2/27/Birdobow.png"},
		{id:"drybones",	color:"gray",	icon:"https://www.mariowiki.com/images/c/c0/Dryemblem.png"},
	],
	"Smish":[
		{id:"banjoandkazooie",	color:"#FCDD76",icon:"/w/images/0/02/Banjo_25px.png"},
		{id:"bayonetta",		color:"#A5A1E0",icon:"/w/images/d/da/Bayonetta_25px.png"},
		{id:"bowser",			color:"#44745E",icon:"/w/images/f/f7/Bowser_25px.png"},
		{id:"bowserjr",			color:"#59BF38",icon:"/w/images/c/cf/Bowserjr_25px.png"},
		{id:"iggy",				color:"#59BF38",icon:"/w/images/c/cf/Iggy_25px.png"},
		{id:"larry",			color:"#59BF38",icon:"/w/images/5/5b/Larry_25px.png"},
		{id:"lemmy",			color:"#59BF38",icon:"/w/images/c/cc/Lemmy_25px.png"},
		{id:"ludwig",			color:"#59BF38",icon:"/w/images/0/05/Ludwig_25px.png"},
		{id:"morton",			color:"#59BF38",icon:"/w/images/1/11/Morton_25px.png"},
		{id:"roykoopa",			color:"#59BF38",icon:"/w/images/a/a9/Royk_25px.png"},
		{id:"wendy",			color:"#59BF38",icon:"/w/images/3/3b/Wendy_25px.png"},
		{id:"byleth",			color:"#CEE0D4",icon:"/w/images/3/38/Byleth_25px.png"},
		{id:"bylethfemale",		color:"#CEE0D4",icon:"/w/images/a/ae/Bylethfemale_25px.png"},
		{id:"captainfalcon",	color:"#8E8ADC",icon:"/w/images/0/0d/Captainfalcon_25px.png"},
		{id:"chrom",			color:"#B4B4CF",icon:"/w/images/1/18/Chrom_25px.png"},
		{id:"cloud",			color:"#419384",icon:"/w/images/6/6c/Cloud_25px.png"},
		{id:"corrin",			color:"#63A7C0",icon:"/w/images/b/b8/Corrin_25px.png"},
		{id:"corrinfemale",		color:"#63A7C0",icon:"/w/images/7/7c/Corrinfemale_25px.png"},
		{id:"daisysmash",		color:"#F0BB2C",icon:"/w/images/9/99/Daisy_smash_25px.png",name:"/daisy/"},
		{id:"darkpit",			color:"#875CBE",icon:"/w/images/e/e9/Darkpit_25px.png"},
		{id:"darksamus",		color:"#3D395E",icon:"/w/images/1/13/Darksamus_25px.png"},
		{id:"diddykong",		color:"#E05A52",icon:"/w/images/5/5d/Diddykong_25px.png"},
		{id:"doctormario",		color:"#E86C6D",icon:"/w/images/d/d2/Doctormario_25px.png"},
		{id:"donkeykongsmash",	color:"#F9DA4A",icon:"/w/images/1/14/Donkeykong_25px.png",name:"/donkeykong/"},
		{id:"duckhunt",			color:"#8C5D3A",icon:"/w/images/0/07/Duckhunt_25px.png"},
		{id:"falco",			color:"#69B0DE",icon:"/w/images/a/ab/Falco_25px.png"},
		{id:"fox",				color:"#307CDF",icon:"/w/images/1/1e/Fox_25px.png"},
		{id:"ganondorf",		color:"#7974A4",icon:"/w/images/5/55/Ganondorf_25px.png"},
		{id:"greninja",			color:"#5673A5",icon:"/w/images/c/c4/Greninja_25px.png"},
		{id:"hero",				color:"#CCB3F4",icon:"/w/images/1/14/Hero_25px.png"},
		{id:"heroerdrick",		color:"#CCB3F4",icon:"/w/images/d/d6/Herodq3_25px.png"},
		{id:"herosolo",			color:"#CCB3F4",icon:"/w/images/9/96/Herodq4_25px.png"},
		{id:"heroeight",		color:"#CCB3F4",icon:"/w/images/0/04/Herodq8_25px.png"},
		{id:"iceclimbers",		color:"#A0CAFE",icon:"/w/images/5/5d/Icies_25px.png"},
		{id:"ike",				color:"#B64F3E",icon:"/w/images/1/12/Ike_25px.png"},
		{id:"incineroar",		color:"#FFD902",icon:"/w/images/e/ef/Incineroar.png"},
		{id:"inkling",			color:"#F02D7D",icon:"/w/images/8/8e/Inkling.png"},
		{id:"inklingblue",		color:"#F02D7D",icon:"/w/images/4/48/Inklingblue_25px.png"},
		{id:"inklingcyan",		color:"#F02D7D",icon:"/w/images/8/8c/Inklingcyan_25px.png"},
		{id:"inklinggreen",		color:"#F02D7D",icon:"/w/images/7/7d/Inklinggreen_25px.png"},
		{id:"inklingindigo",	color:"#F02D7D",icon:"/w/images/6/6b/Inklingindigo_25px.png"},
		{id:"inklingpink",		color:"#F02D7D",icon:"/w/images/f/f4/Inklingpink_25px.png"},
		{id:"inklingpurple",	color:"#F02D7D",icon:"/w/images/e/e6/Inklingpurple_25px.png"},
		{id:"inklingyellow",	color:"#F02D7D",icon:"/w/images/1/1a/Inklingyellow_25px.png"},
		{id:"isabelle",			color:"#C4D37E",icon:"/w/images/2/20/Isabelle_25px.png"},
		{id:"jigglypuff",		color:"#F29BF6",icon:"/w/images/0/08/Jiggly_25px.png"},
		{id:"joker",			color:"#B41201",icon:"/w/images/e/ef/Joker.png"},
		{id:"ken",				color:"#CDD7DC",icon:"/w/images/8/80/Ken_25px.png"},
		{id:"kingdedede",		color:"#FCE87B",icon:"/w/images/c/c6/Kingdedede_25px.png"},
		{id:"kingkrool",		color:"#65873B",icon:"/w/images/1/10/Kingkrool_25px.png"},
		{id:"kirby",			color:"#FED6E3",icon:"/w/images/7/7b/Kirb_25px.png"},
		{id:"link",				color:"#1C94C3",icon:"/w/images/9/94/Link_25px.png"},
		{id:"littlemac",		color:"#5D8F72",icon:"/w/images/7/78/Littlemac_25px.png"},
		{id:"lucario",			color:"#B8E3FC",icon:"/w/images/b/bc/Lucario_25px.png"},
		{id:"lucas",			color:"#E06833",icon:"/w/images/f/fc/Lucas_25px.png"},
		{id:"lucina",			color:"#7EA6C7",icon:"/w/images/8/8b/Lucina_25px.png"},
		{id:"luigismash",		color:"#5EA444",icon:"/w/images/1/1a/Luigi_smash_25px.png",name:"/luigi/"},
		{id:"mariosmash",		color:"#FF4026",icon:"/w/images/1/14/Mario_smash_25px.png",name:"/mario/"},
		{id:"marth",			color:"#5DA8C8",icon:"/w/images/3/34/Marth_25px.png"},
		{id:"megaman",			color:"#86C1E0",icon:"/w/images/4/43/Megaman_25px.png"},
		{id:"metaknight",		color:"#5367B0",icon:"/w/images/a/a6/Metaknight_25px.png"},
		{id:"mewtwo",			color:"#927BC5",icon:"/w/images/c/c0/Mewtwo_25px.png"},
		{id:"minmin",           color:"#FFFF5A",icon:"/w/images/1/15/Minmin_25px.png"},
		{id:"miibrawler",		color:"#5DC1E6",icon:"/w/images/1/1b/Miibrawler.png"},
		{id:"miifighter",		color:"#5DC1E6",icon:"/w/images/b/bd/Miifighter.png "},
		{id:"miigunner",		color:"#5DC1E6",icon:"/w/images/b/b6/Miigunner.png"},
		{id:"miiswordfighter",	color:"#5DC1E6",icon:"/w/images/2/2b/Miiswordfighter.png"},
		{id:"mistergameandwatch",color:"#A4A190",icon:"/w/images/1/17/Mrgameandwatch_25px.png"},
		{id:"ness",				color:"#DE413D",icon:"/w/images/5/5c/Ness_25px.png"},
		{id:"olimar",			color:"#CCEFB0",icon:"/w/images/7/79/Olimar_25px.png"},
		{id:"alph",				color:"#CCEFB0",icon:"/w/images/d/d4/Alph_25px.png"},
		{id:"pacman",			color:"#FCB541",icon:"/w/images/b/b2/Pacman_25px.png"},
		{id:"palutena",			color:"#91E5C1",icon:"/w/images/2/2c/Palutena_25px.png"},
		{id:"peachsmash",		color:"#F5C9F0",icon:"/w/images/c/cc/Peach_smash_25px.png",name:"/peach/"},
		{id:"pichu",			color:"#DEDC1F",icon:"/w/images/a/a3/Pichu_25px.png"},
		{id:"pikachu",			color:"#FFB912",icon:"/w/images/0/03/Pikachu_25px.png"},
		{id:"pit",				color:"#ACDAFA",icon:"/w/images/5/52/Pit_25px.png"},
		{id:"piranhaplant",		color:"#00AA82",icon:"/w/images/1/1f/Piranhaplant_25px.png"},
		{id:"pokemontrainer",   color:"#FFC004",icon:"/w/images/4/4e/Pokemontrainer_25px.png"},
		{id:"pokemontrainerfemale",color:"#FFC004",icon:"/w/images/0/06/Pkmntrainerfemale_25px.png"},
		{id:"richter",			color:"#2A6DB0",icon:"/w/images/b/b1/Richter_25px.png"},
		{id:"ridley",			color:"#71456F",icon:"/w/images/e/e1/Ridley_25px.png"},
		{id:"rob",				color:"#B2B8BD",icon:"/w/images/9/9d/Rob_25px.png"},
		{id:"robin",			color:"#C387D9",icon:"/w/images/7/7b/Robin_25px.png"},
		{id:"robinfemale",		color:"#C387D9",icon:"/w/images/9/9f/Robinfemale_25px.png"},
		{id:"rosalina",			color:"#98D5CD",icon:"/w/images/0/0a/Rosalina_25px.png"},
		{id:"roy",				color:"#74B65B",icon:"/w/images/d/d1/Roy_25px.png"},
		{id:"ryu",				color:"#D0504D",icon:"/w/images/9/91/Ryu_25px.png"},
		{id:"samus",			color:"#353F56",icon:"/w/images/2/2b/Samus_25px.png"},
		{id:"sheik",			color:"#756FD0",icon:"/w/images/f/fb/Sheik_25px.png"},
		{id:"shulk",			color:"#D5647A",icon:"/w/images/5/5a/Shulk_25px.png"},
		{id:"simon",			color:"#76150E",icon:"/w/images/c/c6/Simon_25px.png"},
		{id:"snake",			color:"#658198",icon:"/w/images/8/8d/Snake_25px.png"},
		{id:"sonic",			color:"#659DEB",icon:"/w/images/f/f7/Sonic_25px.png"},
		{id:"terry",			color:"#6EB5FF",icon:"/w/images/3/30/Terry_25px.png"},
		{id:"toonlink",			color:"#8CE689",icon:"/w/images/d/dc/Toonlink_25px.png"},
		{id:"villager",			color:"#83A88E",icon:"/w/images/1/14/Villager_25px.png"},
		{id:"villagerblue",		color:"#83A88E",icon:"/w/images/9/9c/Villagerblue_25px.png"},
		{id:"villagerchartreuse",color:"#83A88E",icon:"/w/images/7/77/Villagerchartreuse_25px.png"},
		{id:"villagercyan",		color:"#83A88E",icon:"/w/images/0/07/Villagercyan_25px.png"},
		{id:"villagergreen",	color:"#83A88E",icon:"/w/images/d/dd/Villagergreen_25px.png"},
		{id:"villagerpink",		color:"#83A88E",icon:"/w/images/f/ff/Villagerpink_25px.png"},
		{id:"villagerpurple",	color:"#83A88E",icon:"/w/images/8/85/Villagerpurple_25px.png"},
		{id:"villageryellow",	color:"#83A88E",icon:"/w/images/0/09/Villageryellow_25px.png"},
		{id:"wariosmash",		color:"#FEE71F",icon:"/w/images/c/ce/Wario_smash_25px.png",name:"/wario/"},
		{id:"wiifittrainer",	color:"#99D481",icon:"/w/images/5/59/Wiifittrainer_25px.png"},
		{id:"wiifittrainermale",color:"#99D481",icon:"/w/images/b/bf/Wiifittrainermale_25px.png"},
		{id:"wolf",				color:"#CCCCCC",icon:"/w/images/2/29/Wolf_25px.png"},
		{id:"yoshismash",		color:"#83CD65",icon:"/w/images/f/f8/Yoshi_smash_25px.png",name:"/yoshi/"},
		{id:"younglink",		color:"#A5D160",icon:"/w/images/0/00/Younglink_25px.png"},
		{id:"zelda",			color:"#FDEAA4",icon:"/w/images/0/00/Zelda_25px.png"},
		{id:"zerosuitsamus",	color:"#205BA4",icon:"/w/images/2/22/Zerosuitsamus_25px.png"}
	],
	"poleague": [
		{id:"ancap",	color:"#FFFF00",icon:"/w/images/thumb/5/50/Ancap_icon.png/25px-Ancap_icon.png"},
		{id:"balk",		color:"#0000BF",icon:"/w/images/thumb/1/1a/Balk_icon.png/25px-Balk_icon.png"},
		{id:"britpol",	color:"#00247C",icon:"/w/images/thumb/9/9d/Britpol_icon.png/25px-Britpol_icon.png"},
		{id:"cg",		color:"#FFF200",icon:"/w/images/thumb/9/96/Cg_icon.png/25px-Cg_icon.png"},
		{id:"cvg",		color:"#DE2810",icon:"/w/images/thumb/b/b6/Cvg_icon.png/25px-Cvg_icon.png"},
		{id:"italypol",	color:"#B22A23",icon:"/w/images/thumb/4/4f/Italypol_icon.png/25px-Italypol_icon.png"},
		{id:"krautpol",	color:"#3090C7",icon:"/w/images/thumb/f/f9/Krautpol_icon.png/25px-Krautpol_icon.png"},
		{id:"leftypol",	color:"#CD0000",icon:"/w/images/thumb/0/0d/Leftypol_icon.png/25px-Leftypol_icon.png"},
		{id:"mlpol",	color:"#FFFFFF",icon:"/w/images/thumb/2/2d/Mlpol_icon.png/25px-Mlpol_icon.png"},
		{id:"nsg",		color:"#DD0000",icon:"/w/images/thumb/c/cf/Nsg_icon.png/25px-Nsg_icon.png"},
		{id:"pole",		color:"#F50606",icon:"/w/images/thumb/8/80/Pole_icon.png/25px-Pole_icon.png"},
		{id:"ptg",		color:"#3B3B6D",icon:"/w/images/thumb/0/07/Ptg_icon.png/25px-Ptg_icon.png"},
		{id:"sag",		color:"#FF4F00",icon:"/w/images/thumb/0/06/Sag_icon.png/25px-Sag_icon.png"},
		{id:"sg",		color:"#CE1126",icon:"/w/images/thumb/d/d6/Sg_icon.png/25px-Sg_icon.png"},
		{id:"sig",		color:"#8CC642",icon:"/w/images/7/77/Sig_icon.png"},
		{id:"tcr",		color:"#000000",icon:"/w/images/thumb/a/a5/Tcr_icon.png/25px-Tcr_icon.png"}
	],
	"vrleague": [
		{id:"arcade", 	color:"#999999",icon:"/w/images/thumb/9/95/Arcade_icon.png/25px-Arcade_icon.png"},
		{id:"bandicoot",color:"#999999",icon:"/w/images/thumb/6/61/Bandicoot_icon.png/25px-Bandicoot_icon.png"},
		{id:"boot", 	color:"#999999",icon:"/w/images/thumb/5/5d/Boot_icon.png/25px-Boot_icon.png"},
		{id:"capcom", 	color:"#999999",icon:"/w/images/thumb/6/6a/Capcom_icon.png/25px-Capcom_icon.png"},
		{id:"cfo", 		color:"#999999",icon:"/w/images/thumb/5/5a/Cfo_icon.png/25px-Cfo_icon.png"},
		{id:"cvania", 	color:"#999999",icon:"/w/images/thumb/f/f2/Cvania_icon.png/25px-Cvania_icon.png"},
		{id:"dos", 		color:"#999999",icon:"/w/images/thumb/e/e5/Dos_icon.png/25px-Dos_icon.png"},
		{id:"fightan", 	color:"#999999",icon:"/w/images/4/4b/Fightan_icon.png"},
		{id:"fps", 		color:"#999999",icon:"/w/images/thumb/d/dd/Fps_icon.png/25px-Fps_icon.png"},
		{id:"gccx", 	color:"#999999",icon:"/w/images/thumb/1/18/Gccx_icon.png/25px-Gccx_icon.png"},
		{id:"gsrc", 	color:"#999999",icon:"/w/images/thumb/e/e8/Gsrc_icon.png/25px-Gsrc_icon.png"},
		{id:"home", 	color:"#999999",icon:"/w/images/thumb/5/50/Home_icon.png/25px-Home_icon.png"},
		{id:"homm", 	color:"#999999",icon:"/w/images/thumb/d/de/Homm_icon.png/25px-Homm_icon.png"},
		{id:"jpc", 		color:"#999999",icon:"/w/images/thumb/e/ef/Jpc_icon.png/25px-Jpc_icon.png"},
		{id:"kanto", 	color:"#999999",icon:"/w/images/thumb/e/e9/Kanto_icon.png/25px-Kanto_icon.png"},
		{id:"konami", 	color:"#999999",icon:"/w/images/thumb/5/59/Konami_icon.png/25px-Konami_icon.png"},
		{id:"mana", 	color:"#999999",icon:"/w/images/thumb/8/8b/Mana_icon.png/25px-Mana_icon.png"},
		{id:"mega", 	color:"#999999",icon:"/w/images/thumb/9/9c/Mega_icon.png/25px-Mega_icon.png"},
		{id:"mgs", 		color:"#999999",icon:"/w/images/thumb/d/d9/Mgs_icon.png/25px-Mgs_icon.png"},
		{id:"n64", 		color:"#999999",icon:"/w/images/thumb/2/2e/N64_icon.png/25px-N64_icon.png"},
		{id:"nes", 		color:"#999999",icon:"/w/images/thumb/6/69/Nes_icon.png/25px-Nes_icon.png"},
		{id:"rpg", 		color:"#999999",icon:"/w/images/thumb/d/dc/Rpg_icon.png/25px-Rpg_icon.png"},
		{id:"psx", 		color:"#999999",icon:"/w/images/thumb/2/28/Psx_icon.png/25px-Psx_icon.png"},
		{id:"racing", 	color:"#999999",icon:"/w/images/thumb/9/9a/Racing_icon.png/25px-Racing_icon.png"},
		{id:"rare", 	color:"#999999",icon:"/w/images/thumb/6/6b/Rare_icon.png/25px-Rare_icon.png"},
		{id:"rts", 		color:"#999999",icon:"/w/images/thumb/2/2e/Rts_icon.png/25px-Rts_icon.png"},
		{id:"sakutai", 	color:"#999999",icon:"/w/images/thumb/7/76/Sakutai_icon.png/25px-Sakutai_icon.png"},
		{id:"sega",		color:"#999999",icon:"/w/images/f/f7/Sega_icon.png"},
		{id:"sfc", 		color:"#999999",icon:"/w/images/thumb/6/61/Sfc_icon.png/25px-Sfc_icon.png"},
		{id:"ssb", 		color:"#999999",icon:"/w/images/thumb/5/5e/Ssb_icon.png/25px-Ssb_icon.png"},
		{id:"taffer", 	color:"#999999",icon:"/w/images/thumb/7/78/Taffer_icon.png/25px-Taffer_icon.png"},
		{id:"xcom", 	color:"#999999",icon:"/w/images/7/76/Xcom_icon.png"},
	],
	"FAG": [
		{id:"apl",	color:"#FF0000",icon:"/w/images/thumb/8/86/Apl_icon.png/25px-Apl_icon.png"},
		{id:"btq",	color:"#8300FF",icon:"/w/images/thumb/6/6a/Btq_icon.png/25px-Btq_icon.png"},
		{id:"bug",	color:"#07FC0f",icon:"/w/images/thumb/7/79/Bug_icon.png/25px-Bug_icon.png"},
		{id:"cdf",	color:"#475A7E",icon:"/w/images/thumb/1/15/Cdf_icon.png/25px-Cdf_icon.png"},
		{id:"csgu",	color:"#52A7FB",icon:"/w/images/thumb/1/17/Csgu_icon.png/25px-Csgu_icon.png"},
		{id:"eqg",	color:"#E500E5",icon:"/w/images/thumb/6/6c/Eqg_icon.png/25px-Eqg_icon.png"},
		{id:"gay",	color:"#CBF168",icon:"/w/images/thumb/b/b6/Gay_icon.png/25px-Gay_icon.png"},
		{id:"lod",	color:"#FF0000",icon:"/w/images/thumb/e/e1/Lod_icon.png/25px-Lod_icon.png"},
		{id:"luv",	color:"#9B00FF",icon:"/w/images/thumb/5/5e/Luv_icon.png/25px-Luv_icon.png"},
		{id:"mup",	color:"#FFFFFF",icon:"/w/images/thumb/4/41/Mup_icon.png/25px-Mup_icon.png"},
		{id:"oc",	color:"#26D32B",icon:"/w/images/thumb/d/d6/Oc_icon.png/25px-Oc_icon.png"},
		{id:"pnk",	color:"#FFBBF4",icon:"/w/images/thumb/8/84/Pnk_icon.png/25px-Pnk_icon.png"},
		{id:"pow",	color:"#FFBBF4",icon:"/w/images/thumb/5/59/Pow_icon.png/25px-Pow_icon.png"},
		{id:"sdb",	color:"#9F439A",icon:"/w/images/thumb/b/b4/Sdb_icon.png/25px-Sdb_icon.png"},
		{id:"tfh",	color:"#6833D1",icon:"/w/images/thumb/c/c3/Tfh_icon.png/25px-Tfh_icon.png"},
		{id:"wdb",	color:"#65A2E1",icon:"/w/images/thumb/2/22/Wdb_icon.png/25px-Wdb_icon.png"},
	],
	"tvLeague": [
		{id:"bb",    color:"#00FFFF",icon:"/w/images/thumb/1/1c/Bb_icon.png/25px-Bb_icon.png"},
		{id:"chavo", color:"#006341",icon:"/w/images/thumb/b/bb/Chavo_icon.png/25px-Chavo_icon.png"},
		{id:"gate",  color:"#5c6527",icon:"/w/images/thumb/c/c2/Gate_icon.png/25px-Gate_icon.png"},
		{id:"drive", color:"#800080",icon:"/w/images/thumb/f/f6/Drive_icon.png/25px-Drive_icon.png"},
		{id:"got",   color:"#FECF02",icon:"/w/images/thumb/7/7c/Got_icon.png/25px-Got_icon.png"},
		{id:"kob",   color:"#141414",icon:"/w/images/thumb/6/6b/Kob_icon.png/25px-Kob_icon.png"},
		{id:"lynch", color:"#990000",icon:"/w/images/d/d6/Lynch_icon.png"},
		{id:"mash",  color:"#4B5320",icon:"/w/images/thumb/4/41/Mash_icon.png/25px-Mash_icon.png"},
		{id:"mst3k", color:"#1F2E65",icon:"/w/images/4/49/Mst3k_icon.png"},
		{id:"rbmk",  color:"#9A7E1D",icon:"/w/images/thumb/1/1e/RBMK_logo.png/25px-RBMK_logo.png"},
		{id:"rw",    color:"#AAAAAA",icon:"/w/images/thumb/2/2d/Rw_icon.png/25px-Rw_icon.png"},
		{id:"sneed", color:"#FFB81C",icon:"/w/images/thumb/4/47/Sneed_icon.png/25px-Sneed_icon.png"},
		{id:"ssm",   color:"#00AF42",icon:"/w/images/thumb/3/37/Ss%26m_icon.png/25px-Ss%26m_icon.png"},
		{id:"trek",  color:"#FFF500",icon:"/w/images/thumb/2/2c/Trek_icon.png/25px-Trek_icon.png"},
		{id:"tvx",   color:"#000000",icon:"/w/images/thumb/b/b4/Tvx_icon.png/25px-Tvx_icon.png"},
		{id:"yellowsub",color:"#FFDD00",icon:"/w/images/thumb/c/c8/Yellowsub_icon.png/25px-Yellowsub_icon.png"},
		{id:"gk",     color:"#002E48",icon:"/w/images/thumb/a/a9/Gk_icon.png/25px-Gk_icon.png"},
	],
	"Other": [
		{id:"hat",	color:"#49368B",icon:"/ts/cytube/emotes/hat.gif"},
		{id:"veemo",color:"#A7103D",icon:"/ts/Veemo_25px.png"},
		
		/*User exclusive icons for mod abusing assholes*/
		{id:"curly",  color:"#E6EFDA",icon:"/w/images/5/5b/Curly_sprite.png", ExclusiveTo:"Two_Scoops"},
		{id:"suzaka", color:"#85db70",icon:"https://cdn.discordapp.com/attachments/263131337689530368/566787837316431872/Untitled-2.png", ExclusiveTo:"DrDtroit"},
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
