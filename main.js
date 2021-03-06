function setup() { //Setup Function
	const canvas = createCanvas(document.getElementById("gameContainer").offsetWidth, document.getElementById("gameContainer").offsetHeight);
	canvas.parent("gameWindow"); //Canvas creation
};

var miliTarget = 200; //Mili Target for repeated down moves
const dropSpeed = 200; //Speed between drops
var autoDrop = true; //If autodrop is enabled
const deadzone = new Array; //Creates empty variable for deadzone pieces
var allowChange = true; //Boolean to allow change
var allowControl = true; //Boolean to allow control
var held; //Creates empty variable for held piece
var ghostBlocks = new Array; //Creates empty array for ghostBlocks
var isFalling = true; //Boolean to determine if piece is falling

//Color Codes stored in variables
const color_red = [254, 0, 0];
const color_orange = [255, 100, 0];
const color_yellow = [255, 255, 0];
const color_pink = [255, 153, 203];
const color_green = [0, 128, 0];
const color_purple = [129, 0, 127];
const color_blue = [0, 0, 255];

var tetrisWindow = { //Properties for tetris window in object
	width: 10 * Math.floor(document.getElementById("gameContainer").offsetHeight / 25),
	height: 24 * Math.floor(document.getElementById("gameContainer").offsetHeight / 25),
	xOffset: 15 + 5 * Math.floor(document.getElementById("gameContainer").offsetHeight / 25),
	yOffset: 10,
	blockLength : (10 * Math.floor(document.getElementById("gameContainer").offsetHeight / 25)) / 10
}

//Function for returning control to user after timeout
function controlTimeout(){
	allowControl = true;
};


function checkExistanceArray(locations){ //This function checks if locations passed in are occupied by pieces that have been written to the board
	for(var x = 0; x < locations.length; x++){
			var destination = mainBoard.boardArray[locations[x][0]][locations[x][1]];
			if(destination != null){
				return true;
				break;
			}
	}
	return false;
}

function inArray(original, toCheck){ //Check whether a single item of the passed in toCheck array exists in the original array
	var sOriginal = JSON.stringify(original);
	var sToCheck = new Array;
	var includes = false;
	for (var x = 0; x < toCheck.length; x++){
		if (sOriginal.includes(JSON.stringify(toCheck[x]))){
			includes = true;
			break;
		}
	}
	return includes;
};

function hold(passedPiece){ //Function to hold a piece in the game
	isFalling = false;
	ghostBlocks = [];
	if(held.pieceType == null){
		held.pieceType = passedPiece.pieceType;
		inPlay = new Piece(upcoming1.pieceType);
		upcoming1 = new External(upcoming2.pieceType, 15, 0);
		upcoming2 = new External(Math.floor(Math.random() * 7) + 1, 15, 7)
		upcoming1.update();
		upcoming2.update();
	}
	else{
		var heldTemp = held.pieceType;
		held.pieceType = passedPiece.pieceType;
		inPlay = new Piece(heldTemp);
	}
	held.update();
}

function renderRect(location , color) //function to render each block with location of block passed in plus color
{
	if (location[0] != null && location[1] != null){
		fill(color[0],color[1],color[2]);
		rect(tetrisWindow.xOffset + location[0] * tetrisWindow.blockLength, tetrisWindow.yOffset + location[1] * tetrisWindow.blockLength, tetrisWindow.blockLength, tetrisWindow.blockLength);
	}
};

function renderUI(){ //Function that contains render code for main UI and outlines
	//Main Rect:
	background(255,255,255);
	fill(197,215,189);
	rect(tetrisWindow.xOffset - 1, tetrisWindow.yOffset - 1, tetrisWindow.width + 2, tetrisWindow.height + 2);
	fill(255,255,255);

	//Outer Rects:
	rect(tetrisWindow.xOffset - (tetrisWindow.blockLength * 5) - 1, tetrisWindow.yOffset -1, tetrisWindow.blockLength * 5, tetrisWindow.blockLength * 6);
	rect(tetrisWindow.xOffset + tetrisWindow.width + 1, tetrisWindow.yOffset - 1, tetrisWindow.blockLength * 5, tetrisWindow.blockLength * 6);
	rect(tetrisWindow.xOffset + tetrisWindow.width + 1, tetrisWindow.yOffset + (tetrisWindow.blockLength * 6) - 1, tetrisWindow.blockLength * 5, tetrisWindow.blockLength * 6);

}

for (var x = 0; x < 24; x++){ //Creates a deadzone to prevent horizontal bound breaking
	deadzone.push([-1, x]);
	deadzone.push([10, x]);
}
for (var x = 0; x < 10; x++){ //Creates a deadzone to prevent vertical bound breaking
	deadzone.push([x, 24]);
	deadzone.push([x, -1]);
}


//---- CLASSES ----\\

class Boards{ //Main class for Board object
	constructor(){
		this.boardArray = new Array;
	}
}

Boards.prototype.initArray = function(){ //Setups up mainboard array
	for(var x = 0; x < 10; x++){
		var arrayToPush = new Array;
		for(var y = 0; y < 24; y++){
			arrayToPush.push(null);
		}
		this.boardArray.push(arrayToPush);
	}
}

Boards.prototype.checkLines = function(){ //Checks lines for matches
	var linesMatched = new Array;
	for (var y = 0; y < 24 ; y++){
		linesMatched.push(y);
		for(var x = 0; x < 10; x++){
			if(mainBoard.boardArray[x][y] == null){
				linesMatched.pop();
				break;
			}
		}
	}
	if (linesMatched.length >= 1){
		this.clearLines(linesMatched);
	} 
}

Boards.prototype.clearLines = function(lines){ //Clear lines that are matched
	for(var y = 0; y < lines.length; y++){
		for(var x = 0; x < 10; x++){
			this.boardArray[x][lines[y]] = null;
		}
		for(var y2 = lines[y]; y2 >= 0; y2--){
			for(var x = 0; x < 10; x++){
				if(this.boardArray[x][y2] != null){
					this.boardArray[x][y2 + 1] = this.boardArray[x][y2];
					this.boardArray[x][y2] = null;
				}
			}
		}
	}
}

class External{ //Class for external pieces such as held piece and upcoming pieces
	constructor(pieceType, xOffset, yOffset){
		this.pieceType = pieceType;
		this.xOffset = xOffset;
		this.yOffset = yOffset;
		this.blocks = null;
		this.color = null;
	}
};

External.prototype.update = function(){ //Updates piece location to organize them on screen
		switch (this.pieceType){
			case 1: //T-Pice
				this.blocks = [[-2.5,2.5],[-2.5,1.5],[-2.5,3.5],[-3.5,2.5]]; //first block should be point to rotate around
				this.color = color_blue;
				break;
			case 2: //left side L
				this.blocks = [[-2.5,1.5],[-2.5,2.5],[-2.5,3.5],[-3.5,3.5]];
				this.color = color_orange;
				break;
			case 3: //Right side L
				this.blocks = [[-3.5,1.5],[-3.5,2.5],[-3.5,3.5],[-2.5,3.5]];
				this.color = color_yellow;
				break;
			case 4: //Straight
				this.blocks = [[-3,1],[-3,2],[-3,3],[-3,4]];
				this.color = color_red;
				break;
			case 5: //Square
				this.blocks = [[-3.5,2],[-3.5,3],[-2.5,2],[-2.5,3]];
				this.color = color_pink;
				break;
			case 6: //Right Z
				this.blocks = [[-2.5,1.5],[-2.5,2.5],[-3.5,2.5],[-3.5,3.5]];
				this.color = color_purple;
				break;
			case 7: //Left Z
				this.blocks = [[-3.5,1.5],[-3.5,2.5],[-2.5,2.5],[-2.5,3.5]];
				this.color = color_green;
				break;
		}
	}

External.prototype.draw = function(){ //Dunction to draw external blocks
	for(const block of this.blocks){
		renderRect([block[0] + this.xOffset,block[1] + this.yOffset], this.color);
	}
	isFalling = true;
}

class Piece{ //Class for piece
	constructor(pieceType){
		this.color = color_green;
		this.state = 1; //State of rotation
		this.landed = false; //Is landed, want to exhange any instances of this with land state 
		this.landState = 1; //1: has not touched any blocks, 2: Touched blocks, in cooldown, 3: Ready to be locked in 
		this.pieceType = pieceType;
		switch(pieceType){
			case 1: //T-Pice
				this.blocks = [[2,2],[2,1],[2,3],[1,2]]; //first block should be point to rotate around
				this.color = color_blue;
				break;
			case 2: //left side L
				this.blocks = [[5,1],[5,0],[5,2],[4,2]];
				this.color = color_orange;
				break;
			case 3: //Right side L
				this.blocks = [[5,1],[5,0],[5,2],[6,2]];
				this.color = color_yellow;
				break;
			case 4: //Straight
				this.blocks = [[5,1],[5,0],[5,2],[5,3]];
				this.color = color_red;
				break;
			case 5: //Square
				this.blocks = [[5,1],[5,0],[6,1],[6,0]];
				this.color = color_pink;
				break;
			case 6: //Right Z
				this.blocks = [[5,1],[5,0],[4,1],[4,2]];
				this.color = color_purple;
				break;
			case 7: //Left Z
				this.blocks = [[5,1],[5,0],[6,1],[6,2]];
				this.color = color_green;
				break;
		}
	}
};


Piece.prototype.draw = function(){ //Draws the given piece on the screen
	for (const block of this.blocks){
		const location = block;
		fill(this.color[0],this.color[1],this.color[2]);
		rect(tetrisWindow.xOffset + location[0] * tetrisWindow.blockLength, tetrisWindow.yOffset + location[1] * tetrisWindow.blockLength, tetrisWindow.blockLength);
	}
}

Piece.prototype.move = function(direction) { //Moves the piece in the 4 cardinal directions
	isFalling = true;
	var index = null;
	var modifier = null;
	allowChange = true;
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

	var incomingBlocks = new Array;
	if (direction == "left"){
		for (const block of this.blocks){
			//incomingBlock = [this.blocks[x][0] - 1, this.blocks[x][1]];
			incomingBlocks.push([block[0] - 1, block[1]]);
		}
		if(inArray(deadzone, incomingBlocks) || checkExistanceArray(incomingBlocks)){
			allowChange = false;
		}
	}
	else if (direction == "right"){
		for (const block of this.blocks){
			//incomingBlock = [this.blocks[x][0] + 1, this.blocks[x][1]];
			incomingBlocks.push([block[0] + 1, block[1]]);
		}
		if(inArray(deadzone, incomingBlocks) || checkExistanceArray(incomingBlocks)){
			allowChange = false;
		}
	}

	else if (direction == "down"){
		for (const block of this.blocks){
			incomingBlocks.push([block[0], block[1] + 1]);
		}
		if(inArray(deadzone, incomingBlocks) || checkExistanceArray(incomingBlocks)){
			allowChange = false;
		}
	}

	if (allowChange){ //Makes sure both the index and modifier exist
		for (const block of this.blocks){
			block[index] += modifier;
		}
	}
	if(inPlay.trackFall() == true){ //Checks for where the piece is each time the move function is run, move method is used by both player and autoDrop		
		inPlay.writeBlocks();
		inPlay = new Piece(upcoming1.pieceType);
		upcoming1 = new External(upcoming2.pieceType, 15, 0);
		upcoming2 = new External(Math.floor(Math.random() * 7) + 1, 15, 6)
		upcoming1.update();
		upcoming2.update();
		mainBoard.checkLines();
	}

	this.renderGhost();
}

Piece.prototype.rotate = function(){ //Rotates pieces in a clockwise
	var modifiers = new Array;
	var allowRotate = true;
	
	switch (this.state){ 
			case(1): 
				this.state = 2
				break;
			case(2):
				this.state = 3;
				break;
			case(3):
				this.state = 4;
				break;
			case(4):
				this.state = 1;
				break;
		}

	modifiers = rotationLogic[this.pieceType - 1][this.state - 1];

	var toBeRotated = [
		[this.blocks[0][0] + modifiers[0][0], this.blocks[0][1] + modifiers[0][1]],
		[this.blocks[0][0] + modifiers[1][0], this.blocks[0][1] + modifiers[1][1]],
		[this.blocks[0][0] + modifiers[2][0], this.blocks[0][1] + modifiers[2][1]]
	];

	if (inArray(deadzone, toBeRotated) || checkExistanceArray(toBeRotated)){
		allowRotate = false;
	}


	//modify blocks
	if(allowRotate){
		this.blocks[1] = [this.blocks[0][0] + modifiers[0][0], this.blocks[0][1] + modifiers[0][1]] //block one below origin
		this.blocks[2] = [this.blocks[0][0] + modifiers[1][0], this.blocks[0][1] + modifiers[1][1]]  //One to the right
		this.blocks[3] = [this.blocks[0][0] + modifiers[2][0], this.blocks[0][1] + modifiers[2][1]] //One to the left
	}
	else{
		//need a condition for what to do if rotation is blocked
	}

	this.renderGhost();
}

Piece.prototype.writeBlocks = function(){ //Write blocks to previously dropped blocks array, I want to check for line clears here
	isFalling = false;
	for (const block of this.blocks){
		var xDest = block[0];
		var yDest = block[1];
		mainBoard.boardArray[xDest][yDest] = this.color; //different colors for different locations at one point
	}
	ghostBlocks = [];
}

Piece.prototype.trackFall = function(){ //Tracks fall and checks for piece placement 
	if (this.landState != null){ //may not be needed, depends on how I continue this code 
		var bottomBlocks = new Array;
		for (const block of this.blocks){
			bottomBlocks.push([block[0], block[1] + 1]);
		}
		if(checkExistanceArray(bottomBlocks) || inArray(deadzone, bottomBlocks)){
			if(this.landState == 1){
				this.landState = 2
				setTimeout(function(){
					inPlay.landState = 3;
				}, 1000);
				return false;
			}
			else if(this.landState == 3){
				this.landState = 1;
				this.writeBlocks();
				return true;
			}
		}
		else{
			return false;
		}
	}
}
 
Piece.prototype.renderGhost = function(){ //renders ghost piece for the corresponding tetris piece
	if (isFalling){
		ghostBlocks = new Array;
		for(const block of this.blocks){
			ghostBlocks.push(block);
		}

		while(!inArray(deadzone, ghostBlocks) && !checkExistanceArray(ghostBlocks)){
			for (var x = 0; x < ghostBlocks.length; x++){
				ghostBlocks[x] = [ghostBlocks[x][0], ghostBlocks[x][1] + 1];
			}
		}

		for(var x = 0; x < ghostBlocks.length; x++){
			ghostBlocks[x] = [ghostBlocks[x][0], ghostBlocks[x][1] - 1];
		}
	}
	


}


var inPlay = new Piece(Math.floor(Math.random() * 7) + 1); //Creates initial piece for game
var held = new External(null, 0, 0); //creates a placeholder held piece
var upcoming1 = new External(Math.floor(Math.random() * 7) + 1, 15, 0); //Creates first upcoming piece
var upcoming2 = new External(Math.floor(Math.random() * 7) + 1, 15, 6); //Creates second upcoming piece
upcoming1.update(); //preps the first upcoming piece
upcoming2.update(); //preps the second upcoming piece
mainBoard = new Boards(); //Creates board
mainBoard.initArray(); //initializes board
inPlay.renderGhost(); //Renders ghost piece


function draw() { //Main looping draw function
	var input = false;
	if (millis() > miliTarget && autoDrop){
		inPlay.move("down");
		miliTarget = millis() + dropSpeed;
	}

	strokeWeight(2);

	renderUI();

	stroke(inPlay.color[0],inPlay.color[1],inPlay.color[2]);

	if(isFalling){
		for(const block of ghostBlocks){
			renderRect(block, [197,215,189]);
		}
	}

	stroke(0,0,0);

	inPlay.draw()
	if (held.pieceType != null){
		held.draw();
	}
	
	upcoming1.draw();
	upcoming2.draw();

	for(var x = 0; x < 10; x++){
		for(var y = 0; y < 24; y++){
			if(mainBoard.boardArray[x][y] != null){
				renderRect([x, y], mainBoard.boardArray[x][y]);
			}
		}
	}

	if (allowControl == true){
		if (keyIsDown(37)){
			inPlay.move('left');
			input = true;
		}
		else if (keyIsDown(39)){
			inPlay.move('right');
			input = true;
		}
		else if (keyIsDown(40)){
			inPlay.move('down');
			input = true;
		}
		if (input){
			setTimeout(controlTimeout ,100);
			allowControl = false;
		}
	}
};	

function keyPressed(){ //Function to detect key presses 
	switch(keyCode){
		case(32):
			isFalling = false;
			inPlay.landState = 3;
			while (inPlay.landState == 3){
				inPlay.move('down');
			}
			break;
		case 67:
			isFalling = false;
			hold(inPlay);
			break;
		case 38:
			inPlay.rotate();
			break;
		case 80:
			autoDrop = false;
			break;
	}
}

