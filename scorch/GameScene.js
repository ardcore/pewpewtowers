GameScene.prototype = new EScene().init();
GameScene.prototype.constructor = GameScene;

function GameScene() {
	this.map;
	this.gravity;
	this.players = [];
	this.activePlayer;
	this.explosions = [];
	this.bullets = [];
}

GameScene.prototype.init = function(players_count) {

	var that = this;
	
	if(!players_count) players_count = 5;
	var screen = EViewController.shared().size,
		canvas = EViewController.shared().canvas;
		
	// create new map
	this.map = new Map().init(screen.width, screen.height);
	
	// set worl gravity
	this.gravity = { x: 0, y: 20 };
	
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
	
	// SUPER HACKY MOUSE SUPPORT
	
	var is_moving,
		self = this,
		mouseDownTimeStamp;
		
	function mousePosToCanvasCoords(e) {
		
		var canvas = EViewController.shared().canvas;
		return {
			x: e.pageX - canvas.offsetLeft,
			y: e.pageY - canvas.offsetTop
		}
	};
	
	canvas.addEventListener("mousemove", function(e) {
		var mousePos = mousePosToCanvasCoords(e);
		self.activePlayer.updateRifleAngle(mousePos);
	}, false);

	document.body.addEventListener("mouseup", function(e) {
		if (!self.activePlayer.did_shot) {
			is_moving = false;
			self.activePlayer.isCharging = false;
			// shot bullet
			self.bullets.push(self.activePlayer.shot());
		}
		
	}, false);
	canvas.addEventListener("mousedown", function(e) {
		if (!self.activePlayer.did_shot) {
			is_moving = true;
			self.activePlayer.isCharging = true;
			self.activePlayer.chargedFor = 0;
			self.activePlayer.chargeStart = +new Date();
		}
	}, false);
	
	return this;
	
}

GameScene.prototype.update = function(dt) {

	if (this.activePlayer && this.activePlayer.isCharging) {
		var chargeTime = +new Date() - this.activePlayer.chargeStart;
		this.activePlayer.setChargedFor( chargeTime );
	}

	if (this.activePlayer && !this.activePlayer.did_shot && this.activePlayer.readyToShoot) {
		this.bullets.push(this.activePlayer.shot());
		this.activePlayer.readyToShoot = false;
		this.chargedFor = 0;		
	}

	for (var i = 0; i < this.players.length; i++) {
		this.players[i].update(dt);
	}
	
	for (var i = 0, bullet; i < this.bullets.length; i++) {
		bullet = this.bullets[i];
		bullet.update(dt);
		if(this.map.collidesWith(bullet)) {
			this.explosions.push(new Explosion().init(bullet.pos, bullet.r, 1.5));
			this.bullets.splice(i--, 1);
		} else if(bullet.boundsCheck()) {
			this.bullets.splice(i--, 1);
		}
	}
	
	for (var i = 0; i < this.explosions.length; i++) {
		var explosion = this.explosions[i];
		if (explosion.update(dt)) {
			this.map.addDestruction(explosion.pos, explosion.radius);
			this.explosions.splice(i--, 1);
		} 
	}
}

GameScene.prototype.render = function() {
	
	// render the map
	this.map.render();

	for (var i = 0; i < this.players.length; i++) {
		this.players[i].render();
	}
	
	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].render();
	}
	
	for (var i = 0, n = this.explosions.length; i < n; i++) {
		this.explosions[i].render();
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