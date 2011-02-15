var LABELS = {
		TOWER_HIT: ["Ouch!", "That hurt!", "Don't do that!", "Why me?", "Noooo...", "Not again..."],
		PLAYER_WON: ["Balls of steel!", "Easy as pie.", "I accept that.", "I'm unimpressed."],
		PLAYER_IDLE: ["Boring...", "Knock, knock?", "Sleeping?", "I'm waiting...", "What was it?", "*taps his foot*", "*whistles*", "*yawns*"]
	},
	FLAG = {
		ACTIVE_DIED: true
	},
	IDLE_TIME = 10;



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
	this.labels = [];

	this.idle_timer;

	this.resources = ['cityscape.mp3','final.wav','shot.wav','explosion.wav',
	'drown.wav','damage.wav'];

	var wl = document.getElementById("i-love-walking-along-the-sea-shore");
	this.waterLevel	=  EViewController.shared().size.height - (wl.offsetHeight/2);

}

GameScene.prototype.playSound = function(name, loop) {
	ETexturesManager.shared().sounds[name].audio.loop = loop;
	ETexturesManager.shared().sounds[name].audio.play();
}

GameScene.prototype.setSndVolume = function(val, name) {

	if (name) {
		ETexturesManager.shared().sounds[name].audio.volume = val;
	} else {
		// change overall volume, to-check if it's possible without
		// iterating over all Audio.
		// we should keep original volumes as hashmap and keep these
		// proportions.
	}
}


GameScene.prototype.init = function(players_count) {

	var that = this;

	// start effie
	var effieTarget = document.getElementById("Einie");
	effie.applyTo(effieTarget).startTimer();

	this.playSound('cityscape.mp3', true);
	this.setSndVolume(.3, 'cityscape.mp3');

	
	if(!players_count) players_count = EGameController.shared().players_count || 2;
	
	var screen = EViewController.shared().size,
		canvas = EViewController.shared().canvas;
		
	// create new map
	this.map = new Map().init(screen.width, screen.height);
	
	// set world gravity
	this.gravity = { x: 0, y: 50 };
	
	// calculate width attributable for each tower placing area
	player_pos_step = screen.width / players_count;
	
	// place players on the map in random positions
	for (var i = 0; i < players_count; i++) {
		// create new player at randomized position inside it's placing area 
		var player = new Tower().init({ x: i * player_pos_step + ~~(Math.random() * player_pos_step / 2) + player_pos_step / 4 , y: 0 }, i);
		player.pos.y = this.map.findYPosition(player);
		this.players.push(player);
		// add label
		this.labels.push(new Label().init(
			{x : player.pos.x - player.size.width, y: player.pos.y - player.size.height * 3 }, 
			 "Player " + (i + 1), 1, "bold 8pt retro", 
			   null, "center", "middle", null
			));
	}

	// randomize starting player
	this.setActivePlayer( this.getRandomPlayer() );

	this.idle_timer = 0;

	// SUPER HACKY MOUSE SUPPORT
	
	var is_moving,
		self = this;
		
	function mousePosToCanvasCoords(e) {
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
			var bullet = self.activePlayer.shot();
			self.bullets.push(bullet);
			effie.createEffect(effie.effects.wzium, null, bullet).startEffect();
			self.nextPlayer();
			self.playSound('shot.wav', false);
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

	if(this.bullets.length == 0) {
		this.idle_timer += dt;
	}

	if (this.players.length == 1) {
		this.gameFinished(this.activePlayer);

		// stop everything but let the labels to fade out
		for (var i = 0; i < this.labels.length; i++) {
			var label = this.labels[i];
			if(label.update(dt) == LABEL_ACTION.REMOVE_LABEL) {
				this.labels.splice(i--, 1);	
			}
		}
		return;
	}

	// 0.5% chance to generate a cloud every frame with max of 3 clouds at the same time
	if (Math.random() * 100 > 99.5 && this.clouds.length < 4) {
		this.clouds.push(new Cloud().init());
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
		
		if(this.idle_timer > IDLE_TIME && this.bullets.length == 0) {
			
			var label_id = Math.round(Math.random() * (LABELS.PLAYER_IDLE.length - 1));
			this.labels.push(new Label().init(
				{x : player.pos.x - player.size.width, y: player.pos.y - player.size.height * 3 }, 
				 LABELS.PLAYER_IDLE[label_id], 1, "bold 8pt retro", 
				   null, "center", "middle", null
				));
			
		}
		
		if(!player) break;
		switch(player.update(dt)) {

			case PLAYER_ACTION.IS_DEAD:
				this.players.splice(i--, 1);
				if(player == this.activePlayer) {
					this.nextPlayer(FLAG.ACTIVE_DIED);
				}			
				break;
			case PLAYER_ACTION.IS_FALLING:
				var target_pos = this.map.findYPosition(player)
				if(target_pos === false) {
					// player will sink
				} else if (player.pos.y >= target_pos) {
					player.stoppedFalling(target_pos);
				} 
				break;
			case PLAYER_ACTION.OUT_OF_BOUNDS:
				this.playSound('drown.wav');
				this.players.splice(i--, 1);
				
				this.labels.push(new Label().init(
					{x : player.pos.x - player.size.width, y: player.pos.y - player.size.height * 3 }, 
					 "Bubble.. Bubble... Bubble..", 2.5, "bold 8pt retro", 
					   null, "center", "middle", null
					));
					
				if(player == this.activePlayer) {
					this.nextPlayer(FLAG.ACTIVE_DIED);
				}			
				break;
		}
	}
	
	for (var i = 0, bullet; i < this.bullets.length; i++) {
		bullet = this.bullets[i];
		bullet.update(dt);
		if(this.map.collidesWith(bullet)) {
			this.bullets.splice(i--, 1);
			this.explosions.push(new Explosion().init(bullet.pos, bullet.r, 1.5));
			var miniex = effie.createEffect(effie.effects.boom, [bullet.pos.x, bullet.pos.y]).startEffect();
			this.playSound('explosion.wav');
		} else if(bullet.boundsCheck()) {
			this.bullets.splice(i--, 1);
		} else if(!bullet.isFollowed && bullet.isAboveScreen()) {
			bullet.isFollowed = true;
			this.arrows.push(new Arrow().init(bullet));
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
		if (explosion.update(dt) == EXPLOSION_ACTION.EXPLOSION_ANIMATION_ENDED) {
			this.explosions.splice(i--, 1);
			for (var j = 0, n = this.players.length; j < n; j++) {
				var player = this.players[j],
					damage;
					
				// if there was collision and damage reported					
				if (damage = explosion.hitTower(player)) {
					player.gotHit(damage);
					
					var label_id = Math.round(Math.random() * (LABELS.TOWER_HIT.length - 1));
					
					this.labels.push(new Label().init(
						{x : player.pos.x - player.size.width, y: player.pos.y - player.size.height * 3 }, 
						 LABELS.TOWER_HIT[label_id], 1, "bold 8pt retro", 
						   null, "center", "middle", null
						));
					this.playSound('damage.wav');
					// handle after hit action - create smoke etc
				}
			}
			this.map.addDestruction(explosion.pos, explosion.radius);
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
	
	for (var i = 0; i < this.labels.length; i++) {
		var label = this.labels[i];
		if(label.update(dt) == LABEL_ACTION.REMOVE_LABEL) {
			this.labels.splice(i--, 1);	
		}
	}
	
	
	if (this.idle_timer > IDLE_TIME) {
		this.idle_timer = 0;
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
	
	for (var i = 0; i < this.labels.length; i++) {
		this.labels[i].render();
	}
	
}

// returns random player
GameScene.prototype.getRandomPlayer = function() {
	return this.players.sort(function() {return 0.5 - Math.random()})[0];
}

// loops through players collection getting next one

GameScene.prototype.nextPlayer = function(active_died) {
	var next_player;

	this.idle_timer = 0;

	if(!active_died) {
		this.activePlayer.isActive = false;
		if(this.players.length) {
			this.players.push(this.players.shift())
			next_player = this.players[0];
		}
	} else {
		next_player = this.players[0];
	}
	
	this.setActivePlayer(next_player);
	
	this.labels.push(new Label().init(
		{x : next_player.pos.x - next_player.size.width, y: next_player.pos.y - next_player.size.height * 3 }, 
		 "Player " + (next_player.index + 1) + " go!", 1, "bold 8pt retro", 
		   null, "center", "middle", null
		));

}

GameScene.prototype.setActivePlayer = function(player) {
	this.activePlayer = player;
	player.isActive = true;
	player.beginTurn();	
}

GameScene.prototype.gameFinished = function(player) {
	if(this.game_ended) return;
	this.game_ended = true;
	
	this.playSound('final.wav');
	
	var label_id = Math.round(Math.random() * (LABELS.PLAYER_WON.length - 1));
	
	this.labels.push(new Label().init(
		{x : player.pos.x, y: player.pos.y - player.size.height * 3 }, 
		 LABELS.PLAYER_WON[label_id], 2, "bold 8pt retro", 
		   null, "center", "middle", null
		));
		
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
