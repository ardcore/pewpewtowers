function Bullet() {
	this.pos;
	this.vel; // actual speed
}

Bullet.prototype.init = function(pos, angle, v, r) {
	this.pos = pos;
	this.angle = angle;
	this.init_v = v; // initial speed
	this.r = r;
	
	return this;
}

Bullet.prototype.update = function(dt) {
	
}

Bullet.prototype.render = function() {
	var ctx = EViewController.shared().context;
	
	ctx.fillStyle = "#ae4523";
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, 2, 0, Math.PI * 2);
	ctx.fill();
	
}
