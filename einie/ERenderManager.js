
/*
 * Einie Render Manager
 * @package core
 */
 
function ERenderManager() {
	this.render_queue;
}

//@class
ERenderManager.shared = function() {
	
	if (ERenderManager.singleton) {
		
		return ERenderManager.singleton;
		
	} else {
		
		return ERenderManager.singleton = new ERenderManager().init();	
		
	}
	
}

//@public
ERenderManager.prototype.init = function() {
	
	return this;
	
}

ERenderManager.prototype.addObject = function(object) {
	
	this.render_queue.push(object);
	
}

ERenderManager.prototype.renderObjects = function() {
	
	// TODO
	
}


ERenderManager.prototype.sortRenderZStack = function() {
	
	// TODO
	
}
