
/*
 * Einie Texture Manager class
 * @package core
 */
 
function ETexturesManager() {
	
	this.textures;
	
}

ETexturesManager.shared = function() {
	
	if (ETexturesManager.singleton) {
		
		return ETexturesManager.singleton;
		
	} else {
		
		return ETexturesManager.singleton = new ETexturesManager().init();
			
	}
	
}

ETexturesManager.prototype.init = function() {
	
	this.textures = {};
	this.sounds = {};
	
	return this;
	
}

ETexturesManager.prototype.loadTextures = function(resources) {
	
	for (var i = 0, n = resources.length; i < n; i++) {
		if (resources[i].match(/(\.mp3|\.ogg|\.wav)$/)) {
			this.addAudio(resources[i]);
		} else {
			this.addTexture(resources[i]);
		}
	}
	
}

ETexturesManager.prototype.addTexture = function(texture_name) {
	if (this.textures[texture_name]) {
		EGameController.shared().current_scene.resources_loaded++;
		return;
	} else {
		this.textures[texture_name] = new ETexture().init(texture_name).load();
	}
}

ETexturesManager.prototype.addAudio = function(texture_name) {
	if (this.sounds[texture_name]) {
		EGameController.shared().current_scene.resources_loaded++;
		return;
	} else {
		this.sounds[texture_name] = new EAudio().init(texture_name).load();
	}
}
