
/*
 * Einie Game Controller
 * @package core
 */
 
function EGameController() {
	
	// @public
	this.view_controller;
	
	this.scenes = {};
	this.current_scene;
	this.loading_scene;
	
}

// @class
EGameController.shared = function() {
	
	if (EGameController.singleton) {
		
		return EGameController.singleton;
		
	} else {
		
		return EGameController.singleton = new EGameController().init();	
		
	}
	
}

// @public
EGameController.prototype.init = function() {
	
	this.view_controller = EViewController.shared();
	
	this.scenes.menu_scene = MenuScene;
	this.scenes.game_scene = GameScene;
	
	this.changeSceneTo('menu_scene');
	
	return this;
	
}

EGameController.prototype.updateCurrentScene = function(dt) {
	
	this.current_scene.update(dt);
	
}

EGameController.prototype.renderCurrentScene = function() {
	
	this.view_controller.clear();
	this.current_scene.render();
	
}


EGameController.prototype.changeSceneTo = function(scene_name) {
	
	if(this.current_scene) {
		this.current_scene.onUnload();
	}
	
	this.current_scene = new this.scenes[scene_name]();
	
	this.view_controller.use_clear = true;
	
	var resources = this.current_scene.resources;
	
	if (resources.length) {
		this.loading_scene = this.current_scene;
		this.current_scene = new ESceneLoader().initWithResources(resources);
		ETexturesManager.shared().loadTextures(resources);
	} else {
		this.current_scene.init();
	}
	
	Einie.shared().start();
	
}

EGameController.prototype.sceneLoaded = function() {
	
	this.current_scene = this.loading_scene.init();
	
}
