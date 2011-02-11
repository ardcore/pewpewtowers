
/*
 * Einie Image
 * @package core
 */
 
function EImage() {
	
	this.texture;
	this.image;
	this.size;
	this.pos; // center of the texture;
	this.texture_offset;
	
	this.scale;
	this.rotation;	
	this.transformation_point;
	this.flip_horizontally;
	this.flip_vertically;
	
	this.alpha;
	
	this.ready;
	
}

EImage.prototype.initWithTextureName = function(texture_name) {
	return this.init(texture_name, null, null, null, null);	
}

EImage.prototype.init = function(texture_name, image_width, image_height, texture_offset_x, texture_offset_y) {
	
	this.texture = ETexturesManager.shared().textures[texture_name];
	this.image = this.texture.image;
	
	if (!image_width && !image_height) {
		this.size = new ESize().init(this.texture.size.width, this.texture.size.height);
	} else {
		this.size = new ESize().init(image_width, image_height);
	}
	
	if (texture_offset_x === undefined && texture_offset_y === undefined) {
		this.texture_offset = null;
	} else {
		this.texture_offset = new EPoint().init(texture_offset_x, texture_offset_y);
	}
	
	this.pos = new EPoint().init(0, 0);
	
	this.scale = new EPoint().init(1, 1);
	this.rotation = 0;
	this.transformation_point = new EPoint();
	this.flip_horizontally = false;
	this.flip_vertically = false;
	
	this.alpha = 1;
	
	return this;
	
}

// scale: EPoint {x, y}
EImage.prototype.setScale = function(scale_x, scale_y) { 
	
	this.scale.x = scale_x || 1;
	this.scale.y = scale_y || 1;
	
}

EImage.prototype.setRotationPoint = function(x, y) {
	
	this.transformation_point.x = x;
	this.transformation_point.y = y;
	
}

EImage.prototype.setPosition = function(x, y) {
	
}

EImage.prototype.renderCentered = function(point) {
	
	var temp_pos = new EPoint().init(this.pos.x, this.pos.y);
	
	this.transformation_point = temp_pos;
	
	this.pos.x = this.pos.x - this.size.width / 2;
	this.pos.y = this.pos.y - this.size.height / 2;
	
	this.render();
	
	this.pos.x = temp_pos.x;
	this.pos.y = temp_pos.y;
}

EImage.prototype.render = function() {
	
	var ctx = EViewController.shared().context,
		screen_size = EViewController.shared().size,
		m11 = 1, 
		m12 = 0, 
		m21 = 0, 
		m22 = 1, 
		dx = 0, 
		dy = 0,
		x,
		y;
		
		
		
	x = (this.transformation_point) ? this.transformation_point.x : this.pos.x + this.size.width / 2;
	y = (this.transformation_point) ? this.transformation_point.y : this.pos.y + this.size.height / 2;
	
	ctx.save();
		
	ctx.setTransform(1, 0, 0, 1, x, y);
	
	if (this.rotation) {
		m11 = Math.cos(this.rotation);
		m12 = Math.sin(this.rotation);
		m21 = -Math.sin(this.rotation);
		m22 = Math.cos(this.rotation);
		ctx.transform(m11, m12, m21, m22, dx, dy);
	}
	
	if (this.flip_horizontally) {
		
		m11 = 1;
		m12 = 0;
		m21 = 0;
		m22 = -1;
		dx = 0;
		dy = 0;
		ctx.transform(m11, m12, m21, m22, dx, dy);
	}
	
	if (this.flip_vertically) {
		m11 = -1;
		m12 = 0;
		m21 = 0;
		m22 = 1;
		dx = 0;
		dy = 0;
		ctx.transform(m11, m12, m21, m22, dx, dy);
	}
	
	if (this.scale.x || this.scale.y) {
		m11 = this.scale.x;
		m12 = 0;
		m21 = 0;
		m22 = this.scale.y;
		dx = 0;
		dy = 0;
		ctx.transform(m11, m12, m21, m22, dx, dy);
	}
	
	if (this.alpha !== 1) {
		
		ctx.globalAlpha = this.alpha;
		
	}
	
	if (this.texture_offset) {
		ctx.drawImage(this.image, this.texture_offset.x, this.texture_offset.y, this.size.width, this.size.height, -this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
	} else {
		ctx.drawImage(this.image, -this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
	}
	
	ctx.restore();
}

EImage.prototype.toString = function() {
	return "[EImage " + this.image.src + ", [" + this.pos.x + ", " + this.pos.x + "][" + this.rotation + "][" + this.scale.x + ", " + this.scale.y + "]";
}