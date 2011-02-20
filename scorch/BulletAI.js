/**
 * wildcard / 2011-02-20 16:53:38
 */

function BulletAI() {
	this.pos;
	this.angle;
	this.v = {};
	this.ag;
	this.r;
	this.power;
	this.degradation;
	this.isFollowed;
	this.life_time;
	this.size;
	this.trail;
}

BulletAI.prototype = new Bullet();

BulletAI.prototype.init = function(pos, angle, v, r) {

	this.simAngle = angle;
	this.simV = v;
	this.hitTargets = {};
	this.radius = r;
	this.active = true;

	this.pos = pos;
	this.angle = angle;
	this.v.x = -Math.cos(angle) * v;
	this.v.y = -Math.sin(angle) * v;
	this.ag = EGameController.shared().current_scene.gravity;
	this.r = r;
	this.power = 1;
	this.degradation = .99999;
	this.isFollowed = false;
	this.life_time = 0;
	this.size = {
		width: 2,
		height: 2
	}

	return this;

}