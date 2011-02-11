
/*
 * Einie 
 * @package core
 */
 
function Einie() {
	
	// @public
	this.game_controller;
	
	this.timer;
	this.prev_time;
	this.current_time;
	
	this.frames;
	this.fps;
	this.interval;
}

// @class
Einie.shared = function() {
	
	if (Einie.singleton) {
		
		return Einie.singleton;
		
	} else {
		
		return Einie.singleton = new Einie().init();	
		
	}
	
}

// @public
Einie.prototype.init = function() {
	
	this.fps = 0;
	this.frames = 0;
	this.interval = 0;
	
	return this;
	
}

Einie.prototype.startApp = function() {
	
	this.start();
	this.game_controller = EGameController.shared();
	log.console = document.getElementById('debug-console');
	
	return this;
	
}

Einie.prototype.stop = function() {
	
	clearInterval(this.timer);
	
}

Einie.prototype.start = function() {
	
	var self = this;
	
	this.current_time = this.prev_time = +new Date();
	
	this.stop();
	
	this.timer = setInterval(function() {
		
		self.fpsTick();
		
	}, 1); 
	
}

Einie.prototype.tick = function() {

	this.current_time = +new Date();
	
	var dt = (this.current_time - this.prev_time) / 1000;
	
	this.game_controller.updateCurrentScene(dt);
	this.game_controller.renderCurrentScene(dt);
	
	this.prev_time = this.current_time;
	
}

Einie.prototype.fpsTick = function() {
	
	this.current_time = +new Date();
	
	var dt = (this.current_time - this.prev_time) / 1000;
	
	this.game_controller.updateCurrentScene(dt);
	this.game_controller.renderCurrentScene(dt);
	
	this.interval += dt;
	this.frames++;
	
	if (this.interval > 1) {
		this.fps = this.frames / this.interval;
		this.interval = 0;
		this.frames = 0;
		logFPS(~~(this.fps + 0.5));
	}
	
	this.prev_time = this.current_time;
	
}
