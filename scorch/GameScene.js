GameScene.prototype = new EScene().init();
GameScene.prototype.constructor = GameScene;

function GameScene() {
	this.map;
	this.players = [];
	this.activePlayer;
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
		var player = new Tower().init({ x: i * player_pos_step + ~~(Math.random() * player_pos_step / 2) + player_pos_step / 4 , y: 0 }, i);
		player.pos.y = this.map.findYPosition(player);
		this.players.push(player);
	}

	// randomize starting player
	this.setActivePlayer( this.getRandomPlayer() );
	
	return this;
	
}

GameScene.prototype.update = function() {}

GameScene.prototype.render = function() {
	
	// render the map
	this.map.render();

	for (var i = 0; i < this.players.length; i++) {
		this.players[i].update();
		this.players[i].render();

	}
	
}

// returns random player
GameScene.prototype.getRandomPlayer = function() {
	return arrayRand(this.players);
}

// loops through players collection getting next one
GameScene.prototype.nextPlayer = function() {
	var origin = this.getActivePlayer();
	var next = this.players[origin.index + 1] || this.players[0];
	this.activePlayer = next;
	next.isActive = true;
	origin.isActive = false;
}

// returns currently active player
GameScene.prototype.getActivePlayer = function() {
	return this.activePlayer;
}

GameScene.prototype.setActivePlayer = function(player) {
	this.activePlayer = player;
	player.isActive = true;
}