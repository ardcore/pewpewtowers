function ScorchScene() {
	this.terrain;
	this.players = [];
};

ScorchScene.prototype = new EScene().init();
ScorchScene.prototype.constructor = ExampleScene6;

ScorchScene.prototype.init = function(player_count) {
	
	if(!player_count) player_count = 3;
	var screen = EViewController.shared().size;
	this.terrain = new Terrain().init(screen.width, screen.height);
	player_pos_step = screen.width / player_count;

	for (var i = 0; i < player_count; i++) {
		this.players.push(new Tower().init({ x: i * player_pos_step + ~~(Math.random() * player_pos_step / 2) + player_pos_step / 4 , y: 0 }));
	}

	return this;

};

ScorchScene.prototype.update = function() {

};

ScorchScene.prototype.render = function() {
	this.terrain.render();
};