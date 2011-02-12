var Timer = function(canvasId, timeMax, refreshRate, timeoutCallback, strokeColor, fillColor) {
	var canvas = document.getElementById(canvasId),
		ctx = canvas.getContext("2d"),
		cwidth = canvas.width,
		cheight = canvas.height,
		timeMax = timeMax,
		timeLeft = timeMax,
		refreshRate = refreshRate,
		middleX = cwidth / 2,
		middleY = cheight / 2,
		maxRadius = cwidth / 2,
		strokeColor = strokeColor || "#000",
		fillColor = fillColor || "red",
		radianStart = Math.PI - 0.5,
		radianMax = Math.PI * 2,
		arcNorth = Math.PI * -0.5,
		stepTimer = null;

	var redrawInitials = function() {
		// lazy def
		ctx.strokeStyle = strokeColor;
		ctx.fillStyle = fillColor;
		ctx.lineWidth = .2;
		redrawInitials = function() {
			ctx.clearRect(0, 0, cwidth, cheight);
			ctx.beginPath();
			ctx.arc(middleX, middleY, maxRadius, 0, radianMax, false);
			ctx.stroke();
		};
		redrawInitials();
		return redrawInitials;
	}

	var proceed = function() {
		var newTimeLeft = timeLeft - refreshRate;
		timerObj.setTimeLeft(newTimeLeft) && drawTimestep();
		if (newTimeLeft < 0) {
			timerObj.stop();
			if (timeoutCallback) {
				timeoutCallback.call(null, newTimeLeft);
			}
		}
	}

	var drawTimestep = function() {
		var timeUsedPercent = (timeMax - timeLeft) / timeMax;
		var rmax = radianMax * timeUsedPercent;
		ctx.beginPath();
		ctx.moveTo(middleX, middleY);
		ctx.arc(middleX, middleY, maxRadius, arcNorth, arcNorth + rmax, false);
		ctx.fill();
	}

	var timerObj = {
		setTimeLeft: function(time) {
			if (time > timeMax) {
				return false;
			} else if (time > timeLeft) redrawInitials();
			timeLeft = time;
			return true;
		},

		start: function() {
			stepTimer = setInterval(proceed, refreshRate);
		},

		stop: function() {
			clearInterval(stepTimer);
		}
	};

	var init = (function() {
		redrawInitials();
		timerObj.setTimeLeft(timeMax);
	})()

	return timerObj;
};
