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
}

Tower.prototype.init = function(pos, index) {

	this.pos = pos;
	this.index = index;
	return this;
	
}

Tower.prototype.updateRifleAngle = function(mouse_pos) {
	
	var angle = Math.atan2((this.pos.y - mouse_pos.y), (this.pos.x - mouse_pos.x))
	this.rifle.angle = angle;
	
}

Tower.prototype.update = function(dt) {

}

Tower.prototype.render = function() {
	var ctx = EViewController.shared().context;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x - this.size.width/2, this.pos.y - this.size.height, this.size.width, this.size.height )

	ctx.save();
	ctx.translate(this.pos.x, this.pos.y - this.size.height / 2);
	ctx.rotate(this.rifle.angle);
	ctx.fillStyle = this.rifle.color;
	ctx.fillRect(0 + this.rifle.height / 2,
				  0 + this.rifle.height / 2,
				  -this.rifle.width, -this.rifle.height);
	ctx.restore();
	if (this.isActive) {
		ctx.beginPath();
		ctx.arc(this.pos.x,this.pos.y - this.size.height/2,20,0,Math.PI*2,true);
		ctx.stroke();
	}
}