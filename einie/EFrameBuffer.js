
/*
 * Einie Frame Buffer class
 * @package experimental
 * @info
 * 		adds large overhead - not worth using unless required for some special effects
 */
 
function EFrameBuffer() {
	
	this.canvas;
	this.size;
	
	this.context;
	this.drawing_context;
	
	this.data;
	
}

EFrameBuffer.prototype.init = function(drawing_context, size) {
	
	this.canvas = document.createElement('canvas');
	this.size = new ESize().init(size.width, size.height);
	this.canvas.width = this.size.width;
	this.canvas.height = this.size.height;
	this.context = this.canvas.getContext('2d');
	this.drawing_context = drawing_context;
	
	return this;
	
}

EFrameBuffer.prototype.render = function() {
	
	this.drawing_context.putImageData(this.context.getImageData(0, 0, this.size.width, this.size.height), 0, 0);
	this.context.clearRect(0, 0, this.size.width, this.size.height);
}

EFrameBuffer.prototype.clear = function() {
	
	this.context.clearRect(0, 0, this.size.width, this.size.height);
	
}

EFrameBuffer.prototype.getImageData = function() {
	
	return this.context.getImageData(0, 0, this.size.width, this.size.height);
	
}