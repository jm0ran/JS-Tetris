function setup() { //Setup Function
	createCanvas(window.innerWidth, window.innerHeight - 20);
};

var tetrisWindow = { //Properties for tetris window in object
	width: 200,
	height: 480,
	xOffset: 100,
	yOffset: 50
}

var block = { //Information for blocks, want to make a piece object that lets me move pieces as a group
	length : tetrisWindow.width / 10,
	location : [null, null]
}

block.location = [0, 1] //default block location






function renderRect(location) //function to render perBlock
{
	if (location[0] != null && location[1] != null){
		rect(tetrisWindow.xOffset + location[0] * block.length, tetrisWindow.yOffset + location[1] * block.length, tetrisWindow.width / 10, tetrisWindow.height / 24);
	}
	
};




function draw() { //Main looping draw function
	background(255,255,255);
	rect(tetrisWindow.xOffset, tetrisWindow.yOffset, tetrisWindow.width, tetrisWindow.height);
	renderRect(block.location);

};

function keyPressed(){ //Function to detect key presses 
	console.log(keyCode);
	if (keyCode == 87){
		block.location[1] -= 1;
		console.log("up");
	}
	else if (keyCode == 83){
		block.location[1] += 1;
		console.log("down " + block.location);
	}
	else if (keyCode == 65){
		block.location[0] -= 1;
		console.log("left");
	}
	else if (keyCode == 68){
		block.location[0] += 1;
		console.log("right");
	}
}
