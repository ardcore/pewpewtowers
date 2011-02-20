TowerAI.prototype = new Tower();

function TowerAI() {
	this.human = false;
	this.index;
	this.isActive;
	this.simbullets;
	this.hitbullets;
	this.isCharging = false;
	this.chargeStart = 0;
	this.chargedFor = 0;
	this.readyToShoot = false;
	this.did_shot = false;
	this.is_drowning = false;

	this.pos = {};
	this.size = {
		width:15,
		height:15,
		shield_radius: 22,
		controls_radius: 40
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


TowerAI.prototype.beginTurn = function() {
	this.simbullets = [];
	this.hitbullets = [];

	this.isActive = true;
	this.isCharging = false;
	this.chargeStart = 0;
	this.chargedFor = 0;
	this.readyToShoot = false;
	this.did_shot = false;
	this.fireSimulation();
}

TowerAI.prototype.updateRifleAngle = function(angle) {

	this.rifle.angle = angle;

}

TowerAI.prototype.fireSimulation = function() {
	this.simbullets = [];
	for (var angle = 0; angle < 3.14; angle = angle + .1) {
		this.updateRifleAngle(angle);
		for (var p = 0; p < this.powerbar.maxCharge; p = p + 5) {
			var bullet = this.simulateShot(p);
			this.simbullets.push(bullet);
		}
	}
}

TowerAI.prototype.shotAI = function() {

	this.hitbullets.sort( function(a,b) {
		return a.hitTargets.targets < b.hitTargets.targets;
	});

	var bestHit = this.hitbullets[0];
	this.updateRifleAngle(bestHit.simAngle);
	this.chargedFor = bestHit.simV*10;
	var bullet = this.shot();
	return bullet;
}

TowerAI.prototype.simulateShot = function(power) {
	var vel = power / 10;
	var pos = {};
	pos.x = this.pos.x + -Math.cos(this.rifle.angle) * this.rifle.width;
	pos.y = this.pos.y - this.size.height / 2 + 3 + -Math.sin(this.rifle.angle) * this.rifle.width;
	return new BulletAI().init(pos, this.rifle.angle, vel, this.bullet.r);
}