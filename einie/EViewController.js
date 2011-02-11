
/*
 * Einie View Controller
 * @package core
 */

function EViewController() {
	
	this.canvas;
	this.context;
	this.size;
	
	this.use_clear;
	
}

// @class
EViewController.shared = function() {
	
	if (EViewController.singleton) {
		
		return EViewController.singleton;
		
	} else {
		
		return EViewController.singleton = new EViewController().initWithCanvasId(CANVAS_ID);
			
	}
	
}

// @public
EViewController.prototype.initWithCanvasId = function(canvas_id) {
	
	this.canvas = document.getElementById(canvas_id);
	this.context = this.canvas.getContext('2d');
	this.size = new ESize().init(this.canvas.width, this.canvas.height);
	
	this.use_clear = true;
	
	return this;
	
}

EViewController.prototype.clear = function(force_clear) {
	
	if (force_clear || this.use_clear) {
	    //this.canvas.width = this.canvas.width;
		this.context.clearRect(0, 0, this.size.width, this.size.height);
	}
	
}
