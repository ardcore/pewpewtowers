/*
 * Map
 */

function Map() {
	this.width;
	this.height;
	this.map = [];
}

Map.prototype.init = function(width, height) {
	
	var view_controller = EViewController.shared();
	
	this.width = width;
	this.height = height;
	
	this.generateMap();
	
	
	// store image data for pixel collision detection
	view_controller.clear();
	this.render();
	this.map_image_data = view_controller.context.getImageData(0, 0, view_controller.size.width, view_controller.size.height);
	
	return this;
}

Map.prototype.generateMap = function() {
	
	// number of mountain peeks and valley bottoms
	var map_peeks = ~~(Math.random() * 10 + 0.5) + 5,
		peeks_step = this.width / map_peeks;
	
	// place the initial point at the left edge of the map and at random Y position
	this.map.push({ x: 0, y: ~~(Math.random() * this.height * 0.6 + 0.5) + this.height * 0.2 });
	
	// place the rest of the points sans the last one
	for(var i = 1, n = map_peeks; i < n - 1; i++) {
		this.map.push({ x: peeks_step * i + ~~(Math.random() * peeks_step / 2) - peeks_step / 4, y: ~~(Math.random() * this.height * 0.6 + 0.5) + this.height * 0.2 });
	}
	
	// place the last point at the right edge of the map
	this.map.push({x: this.width, y: ~~(Math.random() * this.height * 0.6 + 0.5) + this.height * 0.2 });
	
}

Map.prototype.render = function() {
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