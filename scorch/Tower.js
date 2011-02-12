/*
 * TOWER
 */

function Tower() {
	this.index;
	this.isActive;
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
	
	this.bullet = {
		v: 100, // px/s
		r: 75
	}
}

Tower.prototype.init = function(pos, index) {

	this.pos = pos;
	this.index = index;
	return this;
	
}

Tower.prototype.shot = function() {
	var pos = {};
	pos.x = this.pos.x + -Math.cos(this.rifle.angle) * this.rifle.width;
	pos.y = this.pos.y - this.size.height / 2 + 3 + -Math.sin(this.rifle.angle) * this.rifle.width;
	return new Bullet().init(pos, this.rifle.angle, this.bullet.v, this.bullet.r);
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

Tower.prototype.update = function(dt) {

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
		ctx.beginPath();
		ctx.arc(center.x, center.y, 20, 0, Math.PI*2);
		ctx.stroke();
	}
}