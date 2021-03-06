/*
 * Map
 */

function Map() {
	this.width;
	this.height;
	this.map = [];
	this.destroyed_areas = [];
	this.buffer;
}

Map.prototype.init = function(width, height) {
	
	var view_controller = EViewController.shared();
	
	this.width = width;
	this.height = height;
	
	this.generateMap();
	// store image data for pixel collision detection
	view_controller.clear();
	this.render();
	
	// setup buffer for collision alpha map
	this.buffer = view_controller.canvas.cloneNode(false);
	this.buffer.id = "_buffer";
	this.buffer = this.buffer.getContext('2d');
	
	this.collision_alpha_map = view_controller.context.getImageData(0, 0, view_controller.size.width, view_controller.size.height);
	this.buffer.putImageData(this.collision_alpha_map, 0, 0);
	
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

Map.prototype.addDestruction = function(pos, r) {
	
	var size = EViewController.shared().size,
		ctx = this.buffer;
	
	ctx.save();
	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = "#000000";
	ctx.beginPath();
	ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
	
	this.destroyed_areas.push({ x: pos.x, y: pos.y, r: r});
	
	this.collision_alpha_map = ctx.getImageData(0, 0, size.width, size.height)	
}

Map.prototype.collidesWith = function(object) {
	
	var screen = EViewController.shared().size,
		x = Math.round(object.pos.x),
		y = Math.round(object.pos.y);
		
	return (this.collision_alpha_map.data[x * 4 + 3 + y * screen.width * 4] > 0) ? true : false;
	
}

Map.prototype.findYPosition = function(object) {
	
	var screen = EViewController.shared().size,
		x = object.pos.x;	

	for (var i = 0, n = screen.height - 1; i < n; i++) {
		var pixel_alpha = this.collision_alpha_map.data[x * 4 + 3 + i * screen.width * 4];
		if(pixel_alpha == 0) continue;
		return i;
	}
	
	return false;
	
}

Map.prototype.render = function() {
	var ctx = EViewController.shared().context,
		screen = EViewController.shared().size;		
	
	ctx.save();
	
	// draw collidable terrain
	ctx.fillStyle = "#94d281";
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
		ctx.arc(destruction.x, destruction.y, destruction.r, 0, Math.PI * 2, false);
		ctx.fill();
	}
	
	if (this.update_collision_map) {
		//this.map_image_data = ctx.getImageData(this.update_collision_map_area.x, this.update_collision_map_area.y, this.update_collision_map_area.w, this.update_collision_map_area.h);
	}
	
	ctx.restore();

	if (this.update_collision_map) {
		this.update_collision_map = false;
		//ctx.putImageData(this.map_image_data, this.update_collision_map_area.x, this.update_collision_map_area.y);
	}
}


Map.prototype.renderBackgroundMap = function() {
	var ctx = EViewController.shared().context,
		screen = EViewController.shared().size;		

	ctx.save();
	// draw background terrain
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = "#31564d";
	ctx.beginPath();
	ctx.moveTo(this.map[0].x, this.map[0].y + 20);
	
	for (var i = 1, n = this.map.length; i < n; i++) {
		ctx.lineTo(this.map[i].x, this.map[i].y + 20);
	}
	
	ctx.lineTo(screen.width, screen.height);
	ctx.lineTo(0, screen.height);
	ctx.fill();
	ctx.restore();
		
}
