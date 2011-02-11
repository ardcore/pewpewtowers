
/*
 * Einie Scene Loader Scene;
 * @package example
 */

ESceneLoader.prototype = new EScene().init();
ESceneLoader.prototype.constructor = ESceneLoader;

function ESceneLoader() {
	
	this.resources_to_load;
	this.resources_loaded;
	
}

ESceneLoader.prototype.initWithResources = function(resources) {
	
	this.resources_to_load = resources;
	this.resources_loaded = 0;
	
	var ctx = EViewController.shared().context;
	ctx.font = "bold 24pt Arial";
	ctx.textAlign = "center";
	
	return this;
}

ESceneLoader.prototype.update = function(dt) {
	
	if (this.resources_loaded == this.resources_to_load.length) {
		EGameController.shared().sceneLoaded();
	}
	
}

ESceneLoader.prototype.render = function() {

	var ctx = EViewController.shared().context,
		screen_size = EViewController.shared().size;

	ctx.fillText(this.resources_loaded + ' / ' + this.resources_to_load.length + ' resources loaded, please wait.', screen_size.width / 2, screen_size.height / 2);

}