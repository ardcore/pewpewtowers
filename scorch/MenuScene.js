MenuScene.prototype = new EScene().init();
MenuScene.prototype.constructor = MenuScene;

function MenuScene() {
	this.map;
}

MenuScene.prototype.init = function(players_count) {

	if(document.getElementById('pewpewtowers-menu')) {
		document.getElementById('pewpewtowers-menu').style.display = 'block'
		var players_count = document.getElementById('pewpewtowers-count'),
			start_game = document.getElementById('pewpewtowers-start');
		
		players_count.onchange = function() {
			players_count.value = (players_count.value > 8) ? 8 : (players_count.value < 2) ? 2 : players_count.value;
			EGameController.shared().players_count = players_count.value;
		}
		
		start_game.onclick = function() {
			EGameController.shared().changeSceneTo('game_scene');
		}
		
	}
	
	var screen = EViewController.shared().size;
	this.map = new Map().init(screen.width, screen.height);
	return this;
	
}

MenuScene.prototype.update = function(dt) {
}

MenuScene.prototype.render = function() {
	
	var ctx = EViewController.shared().context,
		screen = EViewController.shared().size;
	
	// render the map
	this.map.render();
	
	ctx.save();
	ctx.globalAlpha = 0.6
	ctx.fillStyle = "#ffffff"
	ctx.fillRect(0, 0, screen.width, screen.height);
	ctx.restore();
	
}

MenuScene.prototype.onUnload = function() {
	if(document.getElementById('pewpewtowers-menu')) {
		document.getElementById('pewpewtowers-menu').style.display = 'none'
	}
}
