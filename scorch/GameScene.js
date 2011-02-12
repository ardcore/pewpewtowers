GameScene.prototype = new EScene().init();
GameScene.prototype.constructor = GameScene;

function GameScene() {
	this.map;
	this.players = [];
}

GameScene.prototype.init = function(players_count) {
	
	if(!players_count) players_count = 2;
	var screen = EViewController.shared().size;
		
	// create new map
	this.map = new Map().init(screen.width, screen.height);
	
	// calculate horizontal placing area of player's tower
	player_pos_step = screen.width / players_count;
	
	// place players on the map in random positions
	for (var i = 0; i < players_count; i++) {
		// create new player at randomized position inside it's placing area 
		var player = new Tower().init({ x: i * player_pos_step + ~~(Math.random() * player_pos_step / 2) + player_pos_step / 4 , y: 0 });
		player.pos.y = this.map.findYPosition(player);
		this.players.push(player);
	}
	
	return this;
	
}

GameScene.prototype.update = function() {}

GameScene.prototype.render = function() {
	
	// render the map
	this.map.render();
	
}