function Explosion() {
	this.pos;
	this.radius;
	this.life;
	this.anim_length;
}

Explosion.prototype.init = function(pos, radius, anim_length) {
	this.radius = radius;
	this.pos = pos;
	this.life = 0;
	this.anim_length = anim_length || 2;
	
	return this;
}

Explosion.prototype.update = function(dt) {
	this.life += dt;
	
	return this.life > this.anim_length  
}

Explosion.prototype.render = function() {
	var ctx = EViewController.shared().context;
	
	ctx.fillStyle = "#6a6a6a";
	ctx.beginPath();
	ctx.arc(this.pos.x, this.pos.y, this.radius * this.life / this.anim_length, 0, Math.PI * 2);
	ctx.fill();
	
}
