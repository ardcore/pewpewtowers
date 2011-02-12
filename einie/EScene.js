
/*
 * Einie Scene
 * @package core
 * @abstract class
 */
 
function EScene() {
	
	this.objects;
	this.resources;
 	
}

EScene.prototype.init = function() {

	this.objects = [];
	this.resources = [];

	return this;
	
}

EScene.prototype.update = function(dt) {
	
}

EScene.prototype.render = function() {
	
}

EScene.prototype.onUnload = function() {
	// called before scene is going to get switched with another scene
}
