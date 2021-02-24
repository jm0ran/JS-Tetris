var diameter, radius, centerX, centerY;
function setup() {
	createCanvas(window.innerWidth, window.innerHeight);
	diameter = 200;
	radius = diameter / 2;
	centerX = window.innerWidth / 2;
	centerY = window.innerHeight / 2;
}

function draw() {
	ellipse(centerX, centerY, diameter, diameter);
}