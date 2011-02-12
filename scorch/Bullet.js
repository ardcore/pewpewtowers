/*
 * Bullet
 * 
 * v in px/s
 */

function Bullet() {
	this.pos;
	this.angle;
	this.v = {};
	this.ag;
	this.r;
}

Bullet.prototype.init = function(pos, angle, v, r) {
	
	this.pos = pos;
	this.angle = angle;
	this.v.x = -Math.cos(angle) * v;
	this.v.y = -Math.sin(angle) * v;
	this.ag = EGameController.shared().current_scene.gravity;
	this.r = r;
	
	return this;
}

Bullet.prototype.update = function(dt) {
	var screen = EViewController.shared().size;
	this.v.x = this.v.x + this.ag.x * dt;
	this.v.y = this.v.y + this.ag.y * dt;
	this.pos.x += this.v.x * dt;
	this.pos.y += this.v.y * dt;
	
	if (this.pos.x > screen.width) {
		this.pos.x -= screen.width;
	} else if (this.pos.x < 0) {
		this.pos.x += screen.width;
	}
}

Bullet.prototype.render = function() {
	var ctx = EViewController.shared().context;
	
	ctx.fillStyle = "#ae4523";
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI * 2);
	ctx.fill();
	
}
