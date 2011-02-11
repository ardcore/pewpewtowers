
/*
 * Einie helpers
 * @package core
 */

/*
 * Einie Point
 */

function EPoint() {
	
	this.x;
	this.y;
	
}

EPoint.prototype.init = function(x, y) {
	
	this.x = x;
	this.y = y;
	
	return this;
	
}

/*
 * Einie Size
 */
 
function ESize() {
	
	this.width;
	this.height;
	
}

ESize.prototype.init = function(width, height) {
	
	this.width = width;
	this.height = height;
	
	return this;
	
}


/*
 * log
 */
 
function log(message) {
	
	if (DEBUG && (log.console || (log.console = document.getElementById('debug-console')))) {
		
		log.console.innerHTML = '<p>' + message + '</p>' + log.console.innerHTML;
		
	}
	
}

/*
 * log fps
 */
 
function logFPS(fps) {
	if (FPS || DEBUG) {
		document.getElementById('fps-console').innerHTML = fps + ' fps';
	}
}
