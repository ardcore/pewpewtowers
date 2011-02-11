/*
 * TOWER
 */

function Tower() {
	this.pos = {};
	this.is_placed;
}

Tower.prototype.init = function(pos) {
	
	var screen = EViewController.shared().size;
	
	this.is_placed = false;
	this.pos = pos;
	
	return this;
	
}

Tower.prototype.update = function() {
	
	if(!this.is_placed) {
		// drop on the ground 
	}
}

Tower.prototype.render = function() {
	
}