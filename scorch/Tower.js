/*
 * TOWER
 */

var PLAYER_ACTION = {
	FALLING: 1,
	OUT_OF_BOUNDS: 2
}

function Tower() {
	this.index;
	this.isActive;
	this.isCharging = false;
	this.chargeStart = 0;
	this.chargedFor = 0;
	this.readyToShoot = false;
	this.did_shot = false;
	this.is_burning = false;
	this.burnEffect = null;

	this.pos = {};
	this.size = {
		width:10,
		height:10
	};
	this.color = "orange";

	this.rifle = {
		angle: 0,
		width: 15,
		height: 4,
		color: "black"
	}

	this.powerbar = {
		width: 2,
		color: "red",
		height: 0,
		maxCharge: 2200
	}

	this.bullet = {
		v: 100, // px/s
		r: 75
	}

	this.timer = null;

}

Tower.prototype.init = function(pos, index) {
	this.pos = pos;
	this.index = index;
	this.v = { x: 0, y: 0 };
	this.timer = new Timer("timer", 20000, 50, function() {  }, "blue", "pink");
	this.timer.setTimeLeft(20000);
	return this;
}

Tower.prototype.beginTurn = function() {
	this.isActive = true;
	this.isCharging = false;
	this.chargeStart = 0;
	this.chargedFor = 0;
	this.readyToShoot = false;
	this.did_shot = false;
	this.timer.stop();
	this.timer.setTimeLeft(20000);
	this.timer.start();
}

Tower.prototype.setChargedFor = function(time) {
	if (time <= this.powerbar.maxCharge) {
		this.chargedFor = time;
	} else {
		this.readyToShoot = true;
	}
}

Tower.prototype.shot = function() {
	var vel = this.chargedFor / 10;
	var pos = {};
	pos.x = this.pos.x + -Math.cos(this.rifle.angle) * this.rifle.width;
	pos.y = this.pos.y - this.size.height / 2 + 3 + -Math.sin(this.rifle.angle) * this.rifle.width;
	this.chargedFor = 0;
	this.powerbar.height = 0;
	this.did_shot = true;
	this.timer.stop();
	return new Bullet().init(pos, this.rifle.angle, vel, this.bullet.r);
}

Tower.prototype.updateRifleAngle = function(mouse_pos) {
	
	var angle = Math.atan2((this.pos.y - mouse_pos.y), (this.pos.x - mouse_pos.x));
	
	if (angle <= -Math.PI / 2) {
		angle = Math.PI;
	} else if (angle > -Math.PI / 2 && angle < 0) {
		angle = 0;
	}
	
	this.rifle.angle = angle;
	
}

Tower.prototype.gotHit = function(damage) {
	this.is_falling = true;
	console.log(this, 'got hit');

	if (this.is_burning) {
		this.burnEffect.count = this.burnEffect.count*1.2;
	} else {
		var burnEffect = effie.createEffect(effie.effects.scorchfire, null, this);
		burnEffect.startEffect();
		this.burnEffect = burnEffect;
	}

	// react to being hit
}

Tower.prototype.stoppedFalling = function(y_pos) {
	this.pos.y = y_pos;
	this.v.y = 0;
	this.is_falling = false;
}

Tower.prototype.update = function(dt) {
	
	if(this.is_falling) {
		var gravity = EGameController.shared().current_scene.gravity,
			screen = EViewController.shared().size;
		
		this.v.y += gravity.y * dt;
		this.pos.y += this.v.y * dt;
		
		if(this.pos.y - this.size.height + 3 > screen.height) {	
			return PLAYER_ACTION.OUT_OF_BOUNDS;
		}
		
		return PLAYER_ACTION.IS_FALLING;
	}
}

Tower.prototype.render = function() {
	var ctx = EViewController.shared().context,
		center = { 
			x: this.pos.x,
			y: this.pos.y - this.size.height / 2 + 3 
		};
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x - this.size.width/2, 
				  this.pos.y - this.size.height + 3, 
				   this.size.width, this.size.height )

	ctx.save();
	ctx.translate(center.x, center.y);
	ctx.rotate(this.rifle.angle);
	ctx.fillStyle = this.rifle.color;
	ctx.fillRect(0 + this.rifle.height / 2,
				  0 + this.rifle.height / 2,
				  -this.rifle.width, -this.rifle.height);
	ctx.restore();
	if (this.isActive) {

		this.powerbar.height = this.chargedFor/50;

		ctx.fillStyle = this.powerbar.color;
		ctx.fillRect(this.pos.x + this.size.width*1.2, this.pos.y - this.powerbar.height,
					 this.powerbar.width, this.powerbar.height);
		ctx.beginPath();
		ctx.arc(center.x, center.y, 20, 0, Math.PI*2);
		ctx.stroke();
	}
}