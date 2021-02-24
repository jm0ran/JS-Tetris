var miliTarget = 500;
var autoDrop = true;
var pieceType = 4;

function setup() { //Setup Function
	createCanvas(window.innerWidth, window.innerHeight - 20); //Canvas creation
};


class Piece{ //Class for piece
	constructor(pieceType){
		this.state = 2; //State of rotation
		this.landed = false; //Is landed
		this.pieceType = pieceType;
		if (pieceType == 1){ //T-Pice
			this.blocks = [[2,2],[2,1],[2,3],[1,2]]; //first block should be point to rotate around
		}
		else if (pieceType == 2){ //left side L
			this.blocks = [[5,1],[5,0],[5,2],[4,2]];
		}
		else if (pieceType == 3){ //Right side L
			this.blocks = [[5,1],[5,0],[5,2],[6,2]];
		}
		else if (pieceType == 4){
			this.blocks = [[5,1],[5,0],[5,2],[5,3]]
		}
	}
};
Piece.prototype.draw = function(){ //draws the piece on screen
	for (var x = 0; x < this.blocks.length; x++){
		var location = this.blocks[x];
		rect(tetrisWindow.xOffset + location[0] * block.length, tetrisWindow.yOffset + location[1] * block.length, tetrisWindow.width / 10, tetrisWindow.height / 24);
	}
}

Piece.prototype.move = function(direction) { //Moves the piece
	var index = null;
	var modifier = null;
	switch(direction){
		//index 0 is x axis 1 is y, modifier is how much to change by
		case("up"):
			index = 1;
			modifier = -1;
			break;
		case("down"):
			index = 1;
			modifier = 1;
			break;
		case("left"):
			index = 0;
			modifier = -1;
			break;
		case("right"):
			index = 0;
			modifier = 1;
			break;
	}
	if (index != null && modifier != null){ //Makes sure both the index and modifier exist
		for (var x = 0; x < this.blocks.length; x++){
			this.blocks[x][index] += modifier;
		}
	}
	piece1.trackFall(); //Checks for where the piece is each time the move function is run, move method is used by both player and autoDrop		
}
Piece.prototype.rotate = function(){ //Rotating pieces
	var modifiers = new Array;
	if (this.pieceType == 1){//change to switches one day, seperate one for each piece, math is hard... too hard for me to care
		switch (this.state){ //This code needs to be simplified and it should be that bad, just need xMod, yMod vars and a for loop after cases
			//fix side states 
			case(1):
				modifiers = [[0,-1],[0,1],[-1, 0]]; 
				this.state = 2
				break;
			case(2):
				modifiers = [[0,-1],[1,0],[-1,0]];
				this.state = 3;
				break;
			case(3):
				modifiers = [[0,-1],[0,1],[1,0]];
				this.state = 4;
				break;
			case(4):
				modifiers = [[0,1],[1,0],[-1,0]];
				this.state = 1;
				break;
		}
		
	}
	else if (this.pieceType == 2){ //Left L
		switch (this.state){
			case(1):
				modifiers = [[0,-1],[0, 1],[-1, 1]]; 
				this.state = 2
				break;
			case(2):
				modifiers = [[-1,0],[1,0],[-1,-1]];
				this.state = 3;
				break;
			case(3):
				modifiers = [[0,1],[0,-1],[1,-1]];
				this.state = 4;
				break;
			case(4):
				modifiers = [[-1,0],[1,0],[1,1]];
				this.state = 1;
				break;
		}
		
	}
	else if (this.pieceType == 3){ //right L
		switch (this.state){
			case(1):
				modifiers = [[0,-1],[0,1],[1, 1]]; 
				this.state = 2
				break;
			case(2):
				modifiers = [[1,0],[-1,0],[-1,1]];
				this.state = 3;
				break;
			case(3):
				modifiers = [[0,1],[0,-1],[-1,-1]];
				this.state = 4;
				break;
			case(4):
				modifiers = [[-1,0],[1,0],[1,-1]];
				this.state = 1;
				break;
		}
		
	}
		else if (this.pieceType == 4){ //Straight
		switch (this.state){ 
			case(1):
				modifiers = [[0,-1],[0,1],[0, 2]]; 
				this.state = 2
				break;
			case(2):
				modifiers = [[-2,0],[-1,0],[1,0]];
				this.state = 3;
				break;
			case(3):
				modifiers = [[0,1],[0,-1],[0,-2]];
				this.state = 4;
				break;
			case(4):
				modifiers = [[-1,0],[1,0],[2,0]];
				this.state = 1;
				break;
		}
		
	}

	//modify blocks
		this.blocks[1] = [this.blocks[0][0] + modifiers[0][0], this.blocks[0][1] + modifiers[0][1]] //block one below origin
		this.blocks[2] = [this.blocks[0][0] + modifiers[1][0], this.blocks[0][1] + modifiers[1][1]]  //One to the right
		this.blocks[3] = [this.blocks[0][0] + modifiers[2][0], this.blocks[0][1] + modifiers[2][1]] //One to the left

}
Piece.prototype.writeBlocks = function(){ //Write blocks to previously dropped blocks array, I want to check for line clears here
	for (var x = 0; x < this.blocks.length; x++){
		block.backlog.push(this.blocks[x]);
	}
	piece1 = new Piece(pieceType);
}

Piece.prototype.trackFall = function(){ //Tracks fall and checks for piece placement 
	if (!this.landed){
		var sBacklog = JSON.stringify(block.backlog);
		for (var x = 0; x < this.blocks.length; x++){
				var bottomBlock = JSON.stringify([this.blocks[x][0], this.blocks[x][1] + 1]);
				if (sBacklog.includes(bottomBlock)) //detect if piece is directly over another piece
				{
					this.landed=true;
					this.writeBlocks();
				}

				else if (this.blocks[x][1] >= 23){
					this.landed = true;
					this.writeBlocks();
				 
			}
		}
	}	
}


var piece1 = new Piece(pieceType); //This is going to be our initial piece for the game


var tetrisWindow = { //Properties for tetris window in object
	width: 200,
	height: 480,
	xOffset: 100,
	yOffset: 50
}

var block = { //Information for blocks, want to make a piece object that lets me move pieces as a group
	length : tetrisWindow.width / 10,
	location : [null, null],
	backlog : new Array
}

block.location = [0, 1]; //default block location






function renderRect(location) //function to render perBlock
{
	if (location[0] != null && location[1] != null){
		rect(tetrisWindow.xOffset + location[0] * block.length, tetrisWindow.yOffset + location[1] * block.length, tetrisWindow.width / 10, tetrisWindow.height / 24);
	}
	
};




function draw() { //Main looping draw function
	if (millis() > miliTarget && autoDrop){
		piece1.move("down");
		miliTarget += 500;
	}

	background(255,255,255);
	fill(255,255,255);
	rect(tetrisWindow.xOffset, tetrisWindow.yOffset, tetrisWindow.width, tetrisWindow.height);
	fill('rgb(100%,0%,10%)');
	piece1.draw()
	for (var x = 0; x < block.backlog.length; x++){
		renderRect(block.backlog[x]);
	}

};

function keyPressed(){ //Function to detect key presses 
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
	else if (keyCode == 80){
		autoDrop = false;
	}
}


