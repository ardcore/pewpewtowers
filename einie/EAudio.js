function EAudio() {

	this.name;
	this.audio;
	this.size;

}

EAudio.prototype.init = function(image_name) {

	this.name = image_name;

	return this;

}

EAudio.prototype.load = function() {

	var self = this;
	this.audio = new Audio();
	this.audio.addEventListener('load', function() {
		EGameController.shared().current_scene.resources_loaded++;
	}, false);

	this.audio.src = RESOURCES_PATH + this.name;
	EGameController.shared().current_scene.resources_loaded++; // TOFIX preloader audio

	return this;

}