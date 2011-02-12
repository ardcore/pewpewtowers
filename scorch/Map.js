/*
 * Map
 */

function Map() {
	this.width;
	this.height;
	this.map = [];
	this.destroyed_areas = [];
}

Map.prototype.init = function(width, height) {
	
	var view_controller = EViewController.shared();
	this.update_collision_map = false;
	
	this.width = width;
	this.height = height;
	
	this.generateMap();
	// dummy data
	this.destroyed_areas = [{x: 120, y: 120, r: 50 }, {x: 290, y: 190, r: 50 }, { x: 490, y: 310, r: 50}, { x: 720, y: 250, r: 50 }];
	// store image data for pixel collision detection
	view_controller.clear();
	this.render();
	this.map_image_data = view_controller.context.getImageData(0, 0, view_controller.size.width, view_controller.size.height);
	// create empty pixeldata for terrain destruction and damage alpha maps
	this.destruction_alpha_map = view_controller.context.createImageData(view_controller.size.width, view_controller.size.height);
	this.terrain_damage_alpha_map = view_controller.context.createImageData(view_controller.size.width, view_controller.size.height);
	
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

Map.prototype.collidesWith = function(object) {
	
	var screen = EViewController.shared().size,
		x = object.pos.x,
		y = object.pos.y;
		
	return (this.map_image_data.data[x * 4 + 3 + y * screen.width * 4] > 0) ? true : false;
	
}

Map.prototype.findYPosition = function(object) {
	
	var screen = EViewController.shared().size,
		x = object.pos.x;	

	for (var i = 0, n = screen.height - 1; i < n; i++) {
		var pixel_alpha = this.map_image_data.data[x * 4 + 3 + i * screen.width * 4];
		if(pixel_alpha == 0) continue;
		return i;
	}
	
}

Map.prototype.render = function() {
	var ctx = EViewController.shared().context,
		screen = EViewController.shared().size;		
	
	
	// draw collidable terrain
	ctx.fillStyle = "#4da633";
	ctx.beginPath();
	ctx.moveTo(this.map[0].x, this.map[0].y);
	
	for (var i = 1, n = this.map.length; i < n; i++) {
		ctx.lineTo(this.map[i].x, this.map[i].y);
	}
	
	ctx.lineTo(screen.width, screen.height);
	ctx.lineTo(0, screen.height);
	ctx.fill();
	
	ctx.globalCompositeOperation = 'destination-out';
	
	ctx.fillStyle = "#000000";
	for (var i = 0, n = this.destroyed_areas.length; i < n; i++) {
		var destruction = this.destroyed_areas[i];
		ctx.beginPath();
		ctx.arc(destruction.x, destruction.y, destruction.r, 0, Math.PI * 2);
		ctx.fill();
	}
	
	if (this.update_collision_map) {
		this.update_collision_map = false;
		this.map_image_data = view_controller.context.getImageData(0, 0, screen.width, screen.height);
	}
	
	// draw background terrain
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = "#063100";
	ctx.beginPath();
	ctx.moveTo(this.map[0].x, this.map[0].y);
	
	for (var i = 1, n = this.map.length; i < n; i++) {
		ctx.lineTo(this.map[i].x, this.map[i].y);
	}
	
	ctx.lineTo(screen.width, screen.height);
	ctx.lineTo(0, screen.height);
	ctx.fill();
	
	ctx.globalCompositeOperation = 'source-over';

}
