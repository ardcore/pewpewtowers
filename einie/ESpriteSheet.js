
/*
 * Einie (simple) Sprite Sheet 
 * @package core
 */
 
function ESpriteSheet() {
	
	this.texture;
	this.texture_size;
	this.texture_offset;
	this.frame_size;
	this.margin;
	this.spacing;
	
	this.cols;
	this.rows;
	
}

ESpriteSheet.prototype.initWithImageNameAndSize = function(image_name, frame_width, frame_height) {

	return this.init(image_name, frame_width, frame_height, 0, 0, null, null, null, null);
	
}

ESpriteSheet.prototype.initFromPackedSpriteSheet = function(image_name, frame_width, frame_height, texture_width, texture_height, texture_offset_x, texture_offset_y) {
	
	return this.init(image_name, frame_width, frame_height, 0, 0, texture_width, texture_height, texture_offset_x, texture_offset_y);
	
}

ESpriteSheet.prototype.init = function(image_name, frame_width, frame_height, margin, spacing, texture_width, texture_height, texture_offset_x, texture_offset_y) {
	
	this.texture = ETexturesManager.shared().textures[image_name];
	
	if (!texture_width || !texture_height) {
		this.texture_size  = new ESize().init(this.texture.size.width, this.texture.size.height);
	} else {
		this.texture_size = new ESize().init(texture_width, texture_height);
	}
	
	if (texture_offset_x && texture_offset_y) {
		this.texture_offset = new EPoint().init(texture_offset_x, texture_offset_y);
	}
	
	this.frame_size = new ESize().init(frame_width, frame_height);
	this.margin = margin;
	this.spacing = spacing;
	
	this.cols  = (this.texture_size.width - this.margin * 2 - this.spacing) / (this.frame_size.width + this.spacing);
	this.rows = (this.texture_size.height - this.margin * 2 - this.spacing) / (this.frame_size.height + this.spacing);
	
	return this;
}

// 0 based index

ESpriteSheet.prototype.getImageAtIndex = function(index) {
	
	var row = parseInt(index / this.cols),
		col = index - row * this.cols; 
	
	return this.getImageAtCoords(col, row);
	
}

ESpriteSheet.prototype.getImageAtCoords = function(col, row) {
	
	var image = new EImage(),
		x = this.margin + col * (this.spacing + this.frame_size.width),
		y = this.margin + row * (this.spacing + this.frame_size.height);
		
	if (this.texture_offset) {
		x += this.texture_offset.x;
		y += this.texture_offset.y;
	} 
		
	return image.init(this.texture.name, this.frame_size.width, this.frame_size.height, x, y);
	
}