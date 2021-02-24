function setup() { //Setup Function
	createCanvas(window.innerWidth, window.innerHeight - 20);
};

class Piece{
	constructor(pieceType){
		this.state = 1;
		if (pieceType == 1){
			this.pieceType = 1;
			this.blocks = [[2,2],[2,1],[2,3],[1,2]]; //first block should be point to rotate around
		};
	}
};

Piece.prototype.draw = function(){
	for (var x = 0; x < this.blocks.length; x++){
		var location = this.blocks[x];
		rect(tetrisWindow.xOffset + location[0] * block.length, tetrisWindow.yOffset + location[1] * block.length, tetrisWindow.width / 10, tetrisWindow.height / 24);
	}
}

Piece.prototype.move = function(direction) {
	var index = null;
	var modifier = null;
	switch(direction){
		case("up"):
			index = 1;
			modifier = -1;
			console.log("up");
			break;
		case("down"):
			index = 1;
			modifier = 1;
			console.log("down");
			break;
		case("left"):
			index = 0;
			modifier = -1;
			console.log("left");
			break;
		case("right"):
			index = 0;
			modifier = 1;
			console.log("right");
			break;
	}
	if (index != null && modifier != null){
		for (var x = 0; x < this.blocks.length; x++){
			this.blocks[x][index] += modifier;
		}
	}				
}

Piece.prototype.rotate = function(){

	if (this.pieceType == 1){//change to switches one day
		switch (this.state){ //This code needs to be simplified and it should be that bad, just need xMod, yMod vars and a for loop after cases
			case(1):
				this.blocks[1] = [this.blocks[0][0], this.blocks[0][1] - 1] //block one above origin
				this.blocks[2] = [this.blocks[0][0], this.blocks[0][1] + 1] //block one below origin
				this.blocks[3] = [this.blocks[0][0] - 1, this.blocks[0][1]] //One to the left
				this.state = 2
				break;
			case(2):
				console.log(1);
				this.blocks[1] = [this.blocks[0][0], this.blocks[0][1] - 1] //block one above origin
				this.blocks[2] = [this.blocks[0][0] + 1, this.blocks[0][1]] //One to the right
				this.blocks[3] = [this.blocks[0][0] - 1, this.blocks[0][1]] //One to the left
				this.state = 3;
				break;
			case(3):
				this.blocks[1] = [this.blocks[0][0], this.blocks[0][1] - 1] //block one above origin
				this.blocks[2] = [this.blocks[0][0], this.blocks[0][1] + 1] //block one below origin
				this.blocks[3] = [this.blocks[0][0] + 1, this.blocks[0][1]] //One to the right
				this.state = 4;
				break;
			case(4):
				console.log(2);
				this.blocks[1] = [this.blocks[0][0], this.blocks[0][1] + 1] //block one below origin
				this.blocks[2] = [this.blocks[0][0] + 1, this.blocks[0][1]] //One to the right
				this.blocks[3] = [this.blocks[0][0] - 1, this.blocks[0][1]] //One to the left
				this.state = 1;
				break;
		}
	}

}

piece1 = new Piece(1);


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
	piece1.draw()

};

function keyPressed(){ //Function to detect key presses 
	console.log(keyCode);
	if (keyCode == 87){
		piece1.move("up");
		block.location[1] -= 1;
	}
	else if (keyCode == 83){
		block.location[1] += 1;
		piece1.move("down");
	}
	else if (keyCode == 65){
		block.location[0] -= 1;
		piece1.move("left");

	}
	else if (keyCode == 68){
		block.location[0] += 1;
		piece1.move("right");
	}
	else if (keyCode == 82){
		piece1.rotate();
	}
}