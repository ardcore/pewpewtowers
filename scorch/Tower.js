/*
 * TOWER
 */

function Tower() {
	this.pos = {};
	this.is_placed;
}

Tower.prototype.init = function(pos) {
	
	var screen = EViewController.shared().size;
	this.pos = pos;
	
	return this;
	
}

Tower.prototype.update = function(dt) {
	
}

Tower.prototype.render = function() {
	
}