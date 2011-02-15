var EXPLOSION_ACTION = {
	EXPLOSION_ANIMATION_ENDED: 1
}

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

Explosion.prototype.hitTower = function(obj) {
	var tower = {
		pos: {
			x: obj.pos.x - obj.size.width / 2,
			y: obj.pos.y - obj.size.height
		},
		size: obj.size
	};
	// add damage calculation based on distance from center of explosion
	return (ECollisions.circleRectCollision(this, tower)) ? 10 : 0;
}

Explosion.prototype.update = function(dt) {
	this.life += dt;
	if(this.life > this.anim_length) {
		return EXPLOSION_ACTION.EXPLOSION_ANIMATION_ENDED;
	}   
}

Explosion.prototype.render = function() {
	var ctx = EViewController.shared().context;
	ctx.save();
	ctx.globalAlpha = .75;
	ctx.beginPath();
	ctx.fillStyle = "#6a6a6a";
	ctx.arc(this.pos.x, this.pos.y, this.radius * this.life / this.anim_length, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
	
}