effie.effects = {

	splash: {
		duration: 100, // duration of effect
		count: 20, // particle count
		degradation: .95, // related to velocity
		velX: '-50..50', // random in range
		velY: '-30..30',
		sizeX: 3, // px
		sizeY: 3,
		longevity: '50..100',
		falldown: '0.995..0.999',
		color: "red",
		emitterCoords: [200,200],
		clearMode: "full" // not supported
	},

	scorchfire: {
		name: 'scorchfire',
		shape: 'circle',
		radius: 3,
		count: 40, // particle count
		degradation: .85,
		velX: '-40..40',
		velY: '-130..30',
		sizeX: 3,
		sizeY: 3,
		longevity: '50..100',
		falldown: '0.995..0.999',
		color: "#A1370C",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function(obj) {
			return [obj.pos.x, obj.pos.y];
		},
		clearMode: "full",
		blending: "lighter"
	},

	smallfire: {
		name: 'smallfire',
		duration: 1000, // duration of effect
		count: 50, // particle count
		degradation: .85,
		velX: '-30..30',
		velY: '-100..30',
		sizeX: 3,
		sizeY: 3,
		longevity: '5..15',
		falldown: '0.7..0.999',
		color: "#A1370C",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: [100,200],
		clearMode: "full",
		blending: "lighter"
	},

	bigfire: {
		name: 'bigfire',
		duration: 10000, // duration of effect
		count: 1200, // particle count
		degradation: .85,
		velX: '-40..40',
		velY: '-150..30',
		sizeX: 3,
		sizeY: 3,
		longevity: '70..140',
		falldown: '0.995..0.999',
		color: "#A1370C",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function() {
			return [200 + effie.utils.rangeRand(-30, 30), 200];
		},
		clearMode: "full",
		blending: "lighter"
	},

	explode: {
		name: 'explode',
		duration: 200, // duration of effect
		count: 140, // particle count
		degradation: '0.85..1.005',
		velX: '-30..30',
		velY: '-30..30',
		sizeX: 4,
		sizeY: 4,
		longevity: '50..80',
		falldown: '0.895..0.999',
		color: "#A1370C",
		emitterCoords: [100,200],
		clearMode: "full",
		blending: "lighter"
	},

	snow: {
		name: 'snow',
		duration: 600,		
		count: 200, // particle count
		degradation: .9995,
		velX: '-10..10',
		velXTrans: function(totalTime) {
			return Math.sin(totalTime * 2) + Math.random() * 3 - 2;

		},
		velY: '30..50',
		sizeX: 2,
		sizeY: 2,
		longevity: '300..500',
		falldown: '0.9995..0.9999',
		color: "white",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function() {
			return [effie.utils.rangeRand(0, effie.data.width + effie.data.width / 2), effie.utils.rangeRand(-200, effie.data.halfh / 2)];
		},

		clearMode: "full"
	},


	flood: {
		name: 'flood',
		duration: 3000, // duration of effect
		count: 300, // particle count
		degradation: .997,
		velX: '1..10',
		velXTrans: function(totalTime) {
			return Math.random() * 2 - 1;
		},
		velY: '50..150',
		sizeX: 2,
		sizeY: 2,
		longevity: '50..100',
		falldown: '0.995..0.999',
		color: "white",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function() {
			return [effie.utils.rangeRand(0, effie.data.width + effie.data.width / 2), effie.utils.rangeRand(-200, effie.data.halfh / 2)];
		},
		clearMode: "none"
	},

	swarm: {
		name: 'swarm',
		duration: 1500, // duration of effect
		count: 300, // particle count
		degradation: 1,
		velX: '-5..5',
		velXTrans: function(totalTime) {
			return Math.sin(totalTime) + Math.random() * 4 - 2;
		},
		velY: '-5..5',
		velYTrans: function(totalTime) {
			return Math.sin(totalTime) + Math.random() * 4 - 2;
		},
		sizeX: 2,
		sizeY: 2,
		longevity: '500..1000',
		falldown: 1,
		color: "red",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function() {
			return [effie.utils.rangeRand(effie.data.width / 3, effie.data.width / 3 * 2), effie.utils.rangeRand(effie.data.height / 3, effie.data.height / 3 * 2)];
		},
		clearMode: "full"
	},

	chaos: {
		name: 'chaos',
		duration: 300, // duration of effect
		count: 500, // particle count
		degradation: 1.03,
		velX: '-2..2',
		velXTrans: function(totalTime) {
			return Math.random() - .5;
		},
		velY: '-2..2',
		velYTrans: function(totalTime) {
			return Math.random() - .5;
		},
		sizeX: 4,
		sizeY: 4,
		longevity: '100..150',
		falldown: '0.990..0.998',
		color: "green",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function() {

			var randomAngle = effie.utils.rangeRand(0, 360);
			var randomRadius = effie.utils.rangeRand(1, 50);

			var x = randomRadius * Math.cos(randomAngle) + effie.data.halfw;
			var y = randomRadius * Math.sin(randomAngle) + effie.data.halfh;
			return [x,y];
		},
		clearMode: "full",
		blending: "lighter"
	},

	pink: {
		name: 'pink',
		duration: 200, // duration of effect
		count: 600, // particle count
		degradation: 1.05,
		velX: '-2..2',
		velXTrans: function(totalTime) {
			return Math.random() - .5;
		},
		velY: '-2..2',
		velYTrans: function(totalTime) {
			return Math.random() - .5;
		},
		sizeX: 4,
		sizeY: 4,
		longevity: '400..600',
		falldown: '0.990..0.998',
		color: "violet",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function() {

			var randomAngle = effie.utils.rangeRand(0, 360);
			var randomRadius = effie.utils.rangeRand(70, 100);

			var x = randomRadius * Math.cos(randomAngle) + effie.data.halfw;
			var y = randomRadius * Math.sin(randomAngle) + effie.data.halfh;
			return [x,y];
		},
		clearMode: "full",
		blending: "lighter"
	},

	plasma: {
		name: 'plasma',
		duration: 10000, // duration of effect
		count: 300, // particle count
		degradation: .98,
		velX: '-3..3',
		velXTrans: function(totalTime) {
			return Math.random() - .5;
		},
		velY: '-2..2',
		velYTrans: function(totalTime) {
			return Math.random() - .5;
		},
		sizeX: 3,
		sizeY: 3,
		longevity: '50..320',
		falldown: 1,
		color: "cyan",
		callbackAfterDeath: function(obRef) {
			obRef.addParticle();
		},
		emitterCoords: function() {

			var randomAngle = effie.utils.rangeRand(0, 360);
			var randomRadius = effie.utils.rangeRand(0, 20);

			var x = randomRadius * Math.cos(randomAngle) + effie.data.halfw;
			var y = randomRadius * Math.sin(randomAngle) + effie.data.halfh;
			return [x,y];
		},
		clearMode: "full",
		blending: "lighter"
	},

	mini: { // minimal setup for particle:
		count: 1, // particle count
		color: "red"
	}
};



