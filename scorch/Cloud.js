function Cloud() {
	this.components = [];
	this.pos = {}
	this.v;
}

Cloud.prototype.init = function() {
	
	var v_mod;
	
	this.pos = {
		x: 1, //~~(Math.random() * 1 + 0.5),
		y: ~~(Math.random() * 70 + 0.5) + 30
	}  
	
	if (this.pos.x == 1) {
		this.pos.x = -100;
		v_mod = 1; 
	} else {
		this.pos.x = EViewController.shared().size.width + 100;
		v_mod = -1; 
	}
	
	this.v = (Math.random() * 50 + 50) * v_mod;
	
	var compontents_count = ~~(Math.random() * 7 + 0.5) + 5;
	
	for (var i = 0; i < compontents_count; i++) {
		this.components.push({ 
			pos: { x: ~~(Math.random() * 80 + 0.5) - 40, y: ~~(Math.random() * 50 + 0.5) - 25 },
			r: ~~(Math.random() * 15 + 0.5) + 10,
			alpha: (Math.random() * 0.1 + 0.85)
		});
	}
	
	return this;
}


Cloud.prototype.boundsCheck = function(pos, angle, v, r) {
	return (this.pos.x + 100 < 0 && this.v < 0) || (this.pos.x - 100 > EViewController.shared().size.width && this.v > 0);
}

Cloud.prototype.update = function(dt) {
	this.pos.x += this.v * dt;
}

Cloud.prototype.render = function() {
	var ctx = EViewController.shared().context;
	
	ctx.save();
	ctx.fillStyle = "#ffffff"; 
	for (var i = 0, n = this.components.length; i < n; i++) {
		var comp = this.components[i];
		ctx.globalAlpha = comp.alpha;
		ctx.beginPath();
		ctx.arc(this.pos.x + comp.pos.x, this.pos.y + comp.pos.y, comp.r, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
	
}