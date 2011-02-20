
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

ECollisions = {
	pointsDistance: function(pointA, pointB) {
		return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
	},
	circleRectCollision: function(circle, rect) { // simplified 
		return (this.rectPointCollision(rect, circle.pos) // rect contains the circle center
			 || (this.circlePointCollision(circle, { x: rect.pos.x, y: rect.pos.y }))  // circle contains top left corner of rect
			  || (this.circlePointCollision(circle, { x: rect.pos.x + rect.size.width, y: rect.pos.y}))  // circle contains the top right corner
			   || (this.circlePointCollision(circle, { x: rect.pos.x, y: rect.pos.y + rect.size.height}))  // c contains the bottom left corner
			    || (this.circlePointCollision(circle, { x: rect.pos.x + rect.size.width, y: rect.pos.y + rect.size.height }))); // c ontains the bottom right corner
			
	},
	circlePointCollision: function(circle, point) {
		return this.pointsDistance(circle.pos, point) <= circle.radius;
	},
	circleCircleCollision: function(circleA, circleB) {
		return this.pointsDistance(cricleA.pos, circleB.pos) <= circleA.radius + circleB.radius;
	},
	rectPointCollision: function(rect, point) {
		return ((point.x >= rect.pos.x && point.x <= rect.pos.x + rect.size.width) 
		        && (point.y >= rect.pos.y && point.y <= rect.pos.y + rect.size.height));
	}
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
