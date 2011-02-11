GameScene.prototype = new EScene().init();
GameScene.prototype.constructor = GameScene;

function GameScene() {
	this.map;
	this.players = [];
}

GameScene.prototype.init = function(players_count) {
	
	if(!players_count) players_count = 2;
	
	var screen = EViewController.shared().size;
		
	this.map = new Map().init(screen.width, screen.height);
	
	player_pos_step = screen.width / players_count;
	
	for (var i = 0; i < players_count; i++) {
		this.players.push(new Tower().init({ x: i * player_pos_step + ~~(Math.random() * player_pos_step / 2) + player_pos_step / 4 , y: 0 }));
	}
	
	return this;
	
}

GameScene.prototype.update = function() {}

GameScene.prototype.render = function() {
	
	this.map.render();
	
}