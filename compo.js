/**
 * wildcard / 2011-02-11 21:22:02
 */


var scorch = (function(global, undefined) {

	var canvas = document.getElementById("game");

	return {

		data: {
			canvas: canvas,
			ctx: canvas.getContext("2d"),
			cwidth: canvas.width,
			cheight: canvas.height,
			offset: {x:null, y:null}
		},

		utils: {
			rangeRand: function(min, max) {
				return (Math.random() * (max - min) + +min);
			},

			DOMOffset: function(el) {
				var curleft, curtop;
				curleft = curtop = 0;
				if (el.offsetParent) {
					do {
						curleft += el.offsetLeft;
						curtop += el.offsetTop;
					} while (el = el.offsetParent);
				}
				return [curleft,curtop];
			},

			posInCanvas: function(pos) {
				return {
					x: pos.x - scorch.data.offset.x,
					y: pos.y - scorch.data.offset.y
				}
			}

		}
	}

	var init = (function() {
		this.data.ctx.fillStyle = "black";
		var updater = new __.Updater().init(__.Scheduler.shared(), 10);
	})();

})(this);


/*
 scheduler.scheduleUpdate(object_B);
 scheduler.schedulePeriodicUpdate(object_C, 0.25);
 scheduler.schedulePeriodicUpdate(object_D, 1);
 scheduler.schedulePeriodicUpdate([object_B, 'aiUpdate'], 0.75);*/