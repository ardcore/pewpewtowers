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
		width: 15,
		height: 2,
		color: "black"
	}
}

Tower.prototype.init = function(pos, index) {

	this.pos = pos;
	this.index = index;
	return this;
	
}

Tower.prototype.update = function(dt) {

}

Tower.prototype.render = function() {
	var ctx = EViewController.shared().context;
	ctx.fillStyle = this.color;
	ctx.fillRect(this.pos.x - this.size.width/2, this.pos.y - this.size.height*0.9, this.size.width, this.size.height )

	ctx.fillStyle = this.rifle.color;
	ctx.fillRect( this.pos.x - this.rifle.width,
				  this.pos.y - this.size.height/2,
				  this.rifle.width, this.rifle.height );
	if (this.isActive) {
		ctx.beginPath();
		ctx.arc(this.pos.x - this.size.width/5,this.pos.y - this.size.height/5,20,0,Math.PI*2,true);
		ctx.stroke();
	}
}