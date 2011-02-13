function Arrow() {
	this.pos = {};
	this.angle;
	this.r;
	this.size = {};
	this.followed;
	this.should_die;
	this.indicator;
}

Arrow.prototype.init = function(objToFollow) {
	this.size = {
		width: 2,
		height: 15
	};
	this.followed = objToFollow;
	this.pos.x = objToFollow.pos.x;
	this.pos.y = 0;
	this.should_die = false;
	this.indicator = 0;
	return this;
}


Arrow.prototype.update = function(dt) {
	var screen = EViewController.shared().size;

	this.pos.x = this.followed.pos.x;
	this.indicator = this.pos.y - this.followed.pos.y;
	console.log(this.indicator);
	if (this.followed.pos.y > 0) {
		this.should_die = true;
	}
}

Arrow.prototype.render = function() {

	var center = { 
		x: this.pos.x,
		y: this.pos.y - this.size.height / 2 + 3
	};


	var ctx = EViewController.shared().context;
	ctx.fillStyle = "#ff1213";
	ctx.save();
	ctx.translate(center.x, center.y);
	ctx.rotate(this.angle);
	ctx.beginPath();
	ctx.fillStyle = "orange";
	ctx.textBaseline = "top";
    ctx.font = "normal 10pt Arial";
    ctx.fillStyle = "#333";
	ctx.fillRect(0, 0, this.size.width, this.size.height);
	ctx.fillText(this.indicator|0, 10, 2, 150);
	ctx.lineTo(0-this.size.width/2, this.size.height/3);
	ctx.moveTo(0,0);
	ctx.lineTo(0+this.size.width/2, this.size.height/3);
	ctx.fill();
	ctx.restore();

}
