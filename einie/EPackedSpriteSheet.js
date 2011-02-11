
/*
 * Einie Packed Sprite Sheet class
 * @package core
 */
 
function EPackedSpriteSheet() {
	
	this.texture_name;
	this.texture;
	this.coords;
	
}

EPackedSpriteSheet.prototype.init = function(texture_name, coords_name) {
	
	this.texture_name = texture_name;
	this.texture = ETexturesManager.shared().textures[texture_name];
	this.coords = COORDS[coords_name];
	
	return this;
	
}

EPackedSpriteSheet.prototype.getSpriteSheetNamed = function(spritesheet_name, frame_width, frame_height) {
	
	var frame = this.coords.frames[spritesheet_name]; 
		
	return new ESpriteSheet().initFromPackedSpriteSheet(this.texture_name, frame_width, frame_height, frame.size.width, frame.size.height, frame.pos.x, frame.pos.y);
	
}

EPackedSpriteSheet.prototype.getImageNamed = function(image_name) {
	
	var frame = this.coords.frames[image_name];
	
	return new EImage().init(this.texture_name, frame.size.width, frame.size.height, frame.pos.x, frame.pos.y);
	
}