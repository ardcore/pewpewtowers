function rangeRand(min, max) {
	return (Math.random() * (max - min) + +min);
}

function arrayRand(arr) {
	return arr[(Math.random()*arr.length)|0];
}