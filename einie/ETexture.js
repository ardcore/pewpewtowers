
/*
 * Einie Texture class
 * @package core
 */
 
function ETexture() {
	
	this.name;
	this.image;
	this.size;
	
}

ETexture.prototype.init = function(image_name) {
	
	this.name = image_name;
	this.size = new ESize();
	
	return this;
	
}

ETexture.prototype.load = function() {
	
	var self = this;
	
	this.image = new Image();
	this.image.onload = function() {
		self.size.width = self.image.width;
		self.size.height = self.image.height;
		EGameController.shared().current_scene.resources_loaded++;
	};
	this.image.src = RESOURCES_PATH + this.name;
	
	return this;
	
}