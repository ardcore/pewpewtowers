var LABEL_ACTION = {
	REMOVE_LABEL: 1
}

function Label() {
	this.pos;
	this.text;
	this.duration;
	this.life_time;
	this.color;
	this.align;
	this.baseline;
	this.font;
}

Label.prototype.init = function(pos, text, time, font, color, align, baseline, deg, move_up) {
	this.pos = pos;
	this.text = text;
	this.duration = ((time && time.duration) ? time.duration : time) || 2;
	this.fade_start = (time && time.fade_start) ? time.fade_start : this.duration * 0.8;
	this.font = font || "bold 10pt Arial";
	this.color = ((color && color.color) ? color.color : color) || "black";
	this.alpha = (color && color.alpha) ? color.alpha : 1;
	this.align = align || "center";
	this.baseline = baseline || "middle";
	this.angle = deg || 0;
	this.move_up = move_up || true;
	this.dir = (Math.random() > 0.5) ? 1 : -1;
	
	this.life_time = 0;
	
	return this;
}

Label.prototype.update = function(dt) {
	this.life_time += dt;
	
	if (this.life_time > this.fade_start) {
		this.alpha = 1 - (this.life_time - this.fade_start) / (this.duration - this.fade_start);
	}
	
	if (this.life_time > this.duration) {
		return LABEL_ACTION.REMOVE_LABEL;
	}
	
	if (this.move_up) {
		this.pos.y -= dt * 20;
		this.pos.x += this.dir * Math.pow(dt * 25, 2);
	}
	
}

Label.prototype.render = function() {
	
	var ctx = EViewController.shared().context;
	
	ctx.save();
	ctx.translate(this.pos.x + 20, this.pos.y);
	ctx.rotate(this.angle * Math.PI / 180);
	ctx.globalAlpha = this.alpha;
	ctx.fillStyle = this.color;
	ctx.textAlign = this.align;
	ctx.textBaseline = this.baseline;
	ctx.font = this.font;
	ctx.fillText(this.text, 0, 0);
	ctx.restore();
	
}
