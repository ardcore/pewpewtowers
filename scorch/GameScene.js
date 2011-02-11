GameScene.prototype = new EScene().init();
GameScene.prototype.constructor = GameScene;

function GameScene() {
	this.map;
	this.players = [];
}

GameScene.prototype.init = function(player_count) {
	
	if(!player_count) player_count = 3;
	
	var screen = EViewController.shared().size;
		
	this.map = new Map().init(screen.width, screen.height);
	
	player_pos_step = screen.width / player_count;
	
	for (var i = 0; i < player_count; i++) {
		
		this.players.push(new Tower().init({ x: i * player_pos_step + ~~(Math.random() * player_pos_step / 2) + player_pos_step / 4 , y: 0 }));
	}
	
	return this;
	
}

GameScene.prototype.update = function() {}

GameScene.prototype.render = function() {
	this.map.render();
}