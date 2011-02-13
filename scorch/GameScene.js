GameScene.prototype = new EScene().init();
GameScene.prototype.constructor = GameScene;

function GameScene() {
	this.map;
	this.gravity;
	this.players = [];
	this.activePlayer;
	this.explosions = [];
	this.bullets = [];
	this.clouds = [];
	this.arrows = [];
}

GameScene.prototype.init = function(players_count) {

	var that = this;

	// start effie
	var effieTarget = document.getElementById("Einie");
	effie.applyTo(effieTarget).startTimer();

	
	if(!players_count) players_count = EGameController.shared().players_count || 2;
	var screen = EViewController.shared().size,
		canvas = EViewController.shared().canvas;
		
	// create new map
	this.map = new Map().init(screen.width, screen.height);
	
	// set worl gravity
	this.gravity = { x: 0, y: 50 };
	
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
	this.activePlayer.beginTurn();	
	this.timer = new Timer("timer", 20000, 50, function() {  }, "blue", "pink");
	this.timer.setTimeLeft(20000);

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
		if(self.activePlayer && !self.game_ended) {
			self.activePlayer.updateRifleAngle(mousePos);
		}
	}, false);

	canvas.addEventListener("mouseup", function(e) {
		if (!self.activePlayer.did_shot && self.activePlayer.isCharging && !self.game_ended) {
			is_moving = false;
			self.activePlayer.isCharging = false;
			// shot bullet
			self.bullets.push(self.activePlayer.shot());
			self.nextPlayer();			
		}
		
	}, false);
	canvas.addEventListener("mousedown", function(e) {
		if (!self.activePlayer.did_shot && !self.game_ended) {
			is_moving = true;
			self.activePlayer.isCharging = true;
			self.activePlayer.chargedFor = 0;
			self.activePlayer.chargeStart = +new Date();
		}
	}, false);
	
	return this;
	
}

GameScene.prototype.update = function(dt) {

	if (Math.random() * 100 > 99.5 && this.clouds.length < 4) {
		this.clouds.push(new Cloud().init());
	}

	if (this.players.length == 1) {
		this.gameFinished(this.activePlayer);
		this.game_ended = true;
		return;
	}

	if (this.activePlayer && this.activePlayer.isCharging) {
		var chargeTime = +new Date() - this.activePlayer.chargeStart;
		this.activePlayer.setChargedFor( chargeTime );
	}

	if (this.activePlayer && !this.activePlayer.did_shot && this.activePlayer.readyToShoot) {
		this.bullets.push(this.activePlayer.shot());
		this.nextPlayer();
		
		this.activePlayer.readyToShoot = false;
		this.chargedFor = 0;		
	}

	for (var i = 0; i < this.players.length; i++) {
		var player = this.players[i];
		if(!player) break;
		switch(player.update(dt)) {

			case PLAYER_ACTION.IS_DEAD:
				this.players.splice(i--, 1);
				if(player == this.activePlayer) {
					this.nextPlayer();
				}			
				break;
			case PLAYER_ACTION.IS_FALLING:
				var target_pos = this.map.findYPosition(player)
				if (player.pos.y >= target_pos) {
					player.stoppedFalling(target_pos);
				} 
				break;
			case PLAYER_ACTION.OUT_OF_BOUNDS:
				console.log(player, 'is dead! sorry :(');
				if(player == this.activePlayer) {
					this.nextPlayer();
				}			
				this.players.splice(i--, 1);
				break;
		}
	}
	
	for (var i = 0, bullet; i < this.bullets.length; i++) {
		bullet = this.bullets[i];
		bullet.update(dt);
		if(this.map.collidesWith(bullet)) {
			this.explosions.push(new Explosion().init(bullet.pos, bullet.r, 1.5));
			this.bullets.splice(i--, 1);
		} else if(bullet.boundsCheck()) {
			this.bullets.splice(i--, 1);
		} else if(!bullet.isFollowed && bullet.isAboveScreen()) {
			console.log("not follow")
			bullet.isFollowed = true;
			var arr = new Arrow();
			arr.init(bullet);
			this.arrows.push(arr);
		}
	}
	
	for (var i = 0; i < this.clouds.length; i++) {
		this.clouds[i].update(dt);
		if(this.clouds[i].boundsCheck()) {
			this.clouds.splice(i--, 1);
		}
	}
	
	for (var i = 0; i < this.explosions.length; i++) {
		var explosion = this.explosions[i];
		if (explosion.update(dt)) {
			for (var j = 0, n = this.players.length; j < n; j++) {
				var player = this.players[j],
					damage;
					
				if (damage = explosion.hitTower(player)) {
					player.gotHit(damage);
					// handle after hit action - create smoke etc
				}
			}
			this.map.addDestruction(explosion.pos, explosion.radius);
			this.explosions.splice(i--, 1);
		} 
	}

	for (var i = 0; i < this.arrows.length; i++) {
		var arrow = this.arrows[i];
		if (arrow.should_die) {
			this.arrows.splice(i--, 1);			
		} else {
			arrow.update(dt);
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
	
	for (var i = 0; i < this.clouds.length; i++) {
		this.clouds[i].render();
	}
	
	for (var i = 0, n = this.explosions.length; i < n; i++) {
		this.explosions[i].render();
	}

	for (var i = 0, n = this.arrows.length; i < n; i++) {
		this.arrows[i].render();
	}
	
}

// returns random player
GameScene.prototype.getRandomPlayer = function() {
	return this.players.sort(function() {return 0.5 - Math.random()})[0];
}

// loops through players collection getting next one

GameScene.prototype.nextPlayer = function(active_died) {
	var next;

	if(!active_died) {
		this.activePlayer.isActive = false;
		if(this.players.length) {
			this.players.push(this.players.shift())
			next = this.players[0];
		}
	} else {
		next = this.players[0];
	}

	// todo handle no more players
	if (!next) {
		this.gameFinished({ index: 666});
	}
	if(this.players.length == 1) {
		this.gameFinished(this.activePlayer);
	}
	this.activePlayer = next;


	next.beginTurn();
}

// returns currently active player
GameScene.prototype.getActivePlayer = function() {
	return this.activePlayer;
}

GameScene.prototype.setActivePlayer = function(player) {
	this.activePlayer = player;
	player.isActive = true;
}

GameScene.prototype.gameFinished = function(player) {
	if(this.game_ended) return false;
	var el;
	if(el = document.getElementById('pewpewtowers-game-won')) {
		el.firstElementChild.innerHTML = "Player " + (this.activePlayer.index + 1) + "<br>be proud!<br>A winner is you!";
		el.style.display = 'block';
		el.onclick = function() {
			EGameController.shared().changeSceneTo('menu_scene');
		}
	}
}

GameScene.prototype.onUnload = function() {
	var el;
	if (el = document.getElementById('pewpewtowers-game-won')) {
		el.style.display = 'none';
	}
	
}
