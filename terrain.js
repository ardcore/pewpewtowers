function Terrain() {
	this.width;
	this.height;
	this.map = [];
}

Terrain.prototype.init = function(width, height) {
	this.width = width;
	this.height = height;
	this.generateMap();

	return this;
}

Terrain.prototype.generateMap = function() {

	var map_peeks = ~~(Math.random() * 10 + 0.5) + 5,
		peeks_step = this.width / map_peeks;

	this.map.push({ x: 0, y: ~~(Math.random() * this.height * 0.6 + 0.5) + this.height * 0.2 });


	for(var i = 1, n = map_peeks; i < n - 1; i++) {
		this.map.push({ x: peeks_step * i + ~~(Math.random() * peeks_step / 2) - peeks_step / 4, y: ~~(Math.random() * this.height * 0.6 + 0.5) + this.height * 0.2 });
	}

	this.map.push({x: this.width, y: ~~(Math.random() * this.height * 0.6 + 0.5) + this.height * 0.2 });

}

Terrain.prototype.render = function() {
	var ctx = EViewController.shared().context,
		screen = EViewController.shared().size;

	ctx.fillStyle = "#4da633";

	ctx.beginPath();
	ctx.moveTo(this.map[0].x, this.map[0].y);

	for (var i = 1, n = this.map.length; i < n; i++) {
		ctx.lineTo(this.map[i].x, this.map[i].y);
	}

	ctx.lineTo(screen.width, screen.height);
	ctx.lineTo(0, screen.height);
	ctx.fill();
}