/*
 * TOWER
 */

var PLAYER_ACTION = {
	IS_FALLING: 1,
	OUT_OF_BOUNDS: 2,
	IS_DEAD: 3
}

function Tower() {
	this.index;
	this.isActive;
	this.isCharging = false;
	this.chargeStart = 0;
	this.chargedFor = 0;
	this.readyToShoot = false;
	this.did_shot = false;
	this.is_drowning = false;

	this.pos = {};
	this.size = {
		width:15,
		height:15
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

	this.hp = 30;
	this.max_hp = this.hp;

}

Tower.prototype.init = function(pos, index) {
	this.pos = pos;
	this.index = index;
	this.v = { x: 0, y: 0 };
	return this;
}

Tower.prototype.beginTurn = function() {
	this.isActive = true;
	this.isCharging = false;
	this.chargeStart = 0;
	this.chargedFor = 0;
	this.readyToShoot = false;
	this.did_shot = false;
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
	this.last_charge = this.chargedFor;
	this.last_angle = this.rifle.angle;
	this.chargedFor = 0;
	this.powerbar.height = 0;
	this.did_shot = true;
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
	this.hp -= damage;
	
	var smoke = effie.createEffect(effie.effects.scorchsmoke, null, this);
	smoke.startEffect();
	
	var burnEffect = effie.createEffect(effie.effects.scorchfire, null, this);
	burnEffect.startEffect();
}

Tower.prototype.stoppedFalling = function(y_pos) {
	this.pos.y = y_pos;
	this.v.y = 0;
	this.is_falling = false;
}

Tower.prototype.startDrowning = function() {
	if (!this.is_drowning) {
		this.v.y = this.v.y/2;
		this.is_drowning = true;
	}
}

Tower.prototype.update = function(dt) {
	
	if(this.hp < 1) {
		return PLAYER_ACTION.IS_DEAD;
	}

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
		
	// draw base of the tower
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x - this.size.width / 2, 
				  this.pos.y - this.size.height + 3, 
				   this.size.width, this.size.height )

	// draw rifle
	ctx.save();
	ctx.translate(center.x, center.y);
	ctx.rotate(this.rifle.angle);
	ctx.fillStyle = this.rifle.color;
	ctx.fillRect(0 + this.rifle.height / 2,
				  0 + this.rifle.height / 2,
				  -this.rifle.width, -this.rifle.height);
	ctx.restore();
	
	// draw shield	
	ctx.strokeStyle = "rgba(225, " + (210 * this.hp / this.max_hp) + ", 85, 0.7)";
	ctx.lineWidth = 4 * this.hp / this.max_hp;
	ctx.beginPath();
	ctx.arc(center.x, center.y, 22, 0, Math.PI * 2, false);
	ctx.stroke();
	
	if (this.isActive) {
		
		// draw power bar base ring
		ctx.strokeStyle = "rgba(144, 144, 144, 0.4)";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(center.x, center.y, 25, 0, Math.PI * 2, false);
		ctx.stroke();
		
		if (this.last_charge) {
			// draw last power amount
			ctx.strokeStyle = "rgba(120, 120, 120, 0.7)";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(center.x, center.y, 25, 0, Math.PI * 2 * this.last_charge / this.powerbar.maxCharge, false);
			ctx.stroke();
			
			// mark last shoting angle
			ctx.strokeStyle = "rgba(40, 40, 40, 0.9)";
			ctx.lineWidth = 6;
			ctx.beginPath();
			ctx.arc(center.x, center.y, 25, this.last_angle - 0.1 - Math.PI, this.last_angle + 0.1 - Math.PI, false);
			ctx.stroke();
			
		}
		
		// draw current charge level
		ctx.strokeStyle = "rgba(180, 40, 180, 1.0)";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(center.x, center.y, 25, 0, Math.PI * 2 * this.chargedFor / this.powerbar.maxCharge, false);
		ctx.stroke();
		
		
	}
}