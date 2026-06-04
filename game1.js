/*******************************************************/
// P5.play: project
// Written by 23146ps
/*******************************************************/

/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	console.log("setup: ");
	cnv = new Canvas(1100, 900);

	/*******************************************************/
	// player sprite, gun sprite, bullet group, score
	/*******************************************************/
	playerSprite = new Sprite(width / 2, height - 100, 40, 'd');
	playerSprite.color = 'blue'

	targetLoad();

	gunSprite = new Sprite(playerSprite.x, playerSprite.y, 20, 20, 'n');
	gunSprite.color = 'green'

	//bulletSprite = new Sprite(playerSprite.x, playerSprite.y, 10, 'n')
	//bulletSprite.color = 'red'

	bulletGroup = new Group();
	//let roomType = 0

	/*******************************************************/
	// walls
	/*******************************************************/
	//roomType = 1

	wallGroup = new Group();

	wallLeft = new Sprite(0, height / 2, 8, height, 's');
	wallLeft.color = 'black';

	wallGroup.add(wallLeft);

	wallRight = new Sprite(width, height / 2, 8, height, 's');
	wallRight.color = 'black';

	wallGroup.add(wallRight);

	wallTop = new Sprite(width / 2, 0, width, 8, 's');
	wallTop.color = 'black';

	wallGroup.add(wallTop);

	wallBottom = new Sprite(width / 2, height, width, 8, 's');
	wallBottom.color = 'black';

	wallGroup.add(wallBottom);

	/*
		//room 1
		wallCenter = new Sprite(width / 2, height / 2, 400, 50, 'n');
		wallCenter.visible = false
		wallGroup.add(wallCenter);
	
		//room 2
		wallMidLeft = new Sprite(0, height / 2, 600, 50, 'n');
		wallMidLeft.visible = false
		wallGroup.add(wallMidLeft);
		wallMidRight = new Sprite(width, height / 2, 600, 50, 'n');
		wallMidRight.visible = false
		wallGroup.add(wallMidRight);
	
	
		//room 3
		wallCenter1 = new Sprite(width / 2, 300, 200, 50, 'n');
		wallCenter1.visible = false
		wallGroup.add(wallCenter1);
		wallCenter2 = new Sprite(width / 2, 600, 200, 50, 'n');
		wallCenter2.visible = false
		wallGroup.add(wallCenter2);
	*/

	/*******************************************************/
	// exit
	/*******************************************************/
	exitDoor = new Sprite(width / 2, 0, 100, 30, 'n');
	exitDoor.color = 'orange'

	wallGroup.add(exitDoor);
}
roomScore = 0

function scoreUp() {
	roomScore += 1
	console.log("room cleared!!");
}

function targetLoad() {
	targets = [];
	targetGroup = new Group();
	for (let i = 0; i < 40 + roomScore; i++) {
		targets[i] = new Sprite(random(width), random(200), 40, 40);
		targetGroup.add(targets[i]);
	}
}

function playerDies() {
	background('red');
	text("you died! you cleared " + roomScore + " rooms! press 'r' or reload the page to restart!!", width / 2, height / 2)
	targetGroup.visible = false
	playerSprite.visible = false
	gunSprite.visible = false
	bulletSprite.visible = false
	wallGroup.visible = false

	noLoop();
}

bulletAngle = 0

playerHealth = 3


/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background('ccc');

	text("rooms cleared: " + roomScore, 50, 50)
	text("targets left: " + targetGroup.length, 50, 75)
	text("health: " + playerHealth, 50, 100)

	/*******************************************************/
	// restart game
	/*******************************************************/
	if (kb.pressed('r')) {
		location.reload();
	}

	/*******************************************************/
	// player movement
	/*******************************************************/
	if (kb.pressing('a')) {
		playerSprite.vel.x = -4;
	} else if (kb.pressing('d')) {
		playerSprite.vel.x = 4;
	} else {
		playerSprite.vel.x = 0;
	}

	if (kb.pressing('w')) {
		playerSprite.vel.y = -4;
	} else if (kb.pressing('s')) {
		playerSprite.vel.y = 4;
	} else {
		playerSprite.vel.y = 0;
	}


	/*******************************************************/
	// shooting and killing
	/*******************************************************/
	gunSprite.moveTowards(playerSprite.x, playerSprite.y, 1);
	//gunSprite.moveTowards(mouseX, mouseY, 60);

	if (kb.pressed('space')) {

		bulletSprite = new Sprite(gunSprite.x, gunSprite.y, 10, 'n');

		bulletSprite.direction = playerSprite.angleTo(mouseX, mouseY)

		bulletSprite.speed = 15;

		bulletGroup.add(bulletSprite);

	}
	//bulletSprite.moveTowards(playerSprite.x, playerSprite.y, 1);
	if (bulletGroup.overlaps(wallGroup, bulletWallColide)) { }
	if (bulletGroup.overlaps(targetGroup, murder)) { }

	function bulletWallColide(bulletSprite, wallGroup) {
		console.log("bullet colided")
		bulletSprite.remove();
	}

	function murder(bulletSprite, targetSprite) {
		console.log("kill")
		bulletSprite.remove()
		targetSprite.remove()
	}

	/*******************************************************/
	// player health and death
	/*******************************************************/
	if (playerSprite.collides(targetGroup, damagePlayer)) { }

	function damagePlayer(playerSprite, targetSprite) {
		playerHealth -= 1
		targetSprite.remove()
	}

	if (playerHealth < 1) {
		playerDies()
	}


	/*******************************************************/
	// enemy movement
	/*******************************************************/
	for (let i = 0; i < 40 + roomScore; i++) {
		targets[i].moveTo(playerSprite.x, playerSprite.y, 1);
	}

	/*******************************************************/
	// levelchange
	/*******************************************************/
	if (playerSprite.overlaps(exitDoor) && targetGroup.length < 1) {
		playerSprite.physicsType = 'n'
		playerSprite.moveTo(550, 850, 10000);
		playerSprite.physicsType = 'd'
		scoreUp();
		targetLoad();



		//targetGroup.visible = false
		//targetGroup.physicsType = none

		/*
		if (roomType = 1) {
			background('ccc');
			roomOne();
			roomType = random(2, 3)
			console.log("room 1")
		} else if (roomType = 2) {
			background('ccc');
			roomTwo();
			roomType = random(1 || 3)
			console.log("room 2")
		} else if (roomType = 3) {
			background('ccc');
			roomThree();
			roomType = random(1, 2)
		}

		function roomOne() {
			wallMidLeft.visible = false
			wallMidLeft.physicsType = 'n'
			wallMidRight.visible = false
			wallMidRight.physicsType = 'n'
			wallCenter1.visible = false
			wallCenter1.physicsType = 'n'
			wallCenter2.visible = false
			wallCenter2.physicsType = 'n'

			wallCenter.visible = true
			wallCenter.physicsType = 's'
		}

		function roomTwo() {
			wallCenter.visible = false
			wallCenter.physicsType = 'n'
			wallCenter1.visible = false
			wallCenter1.physicsType = 'n'
			wallCenter2.visible = false
			wallCenter2.physicsType = 'n'

			wallMidLeft.visible = true
			wallMidLeft.physicsType = 's'
			wallMidRight.visible = true
			wallMidRight.physicsType = 's'
		}

		function roomThree() {
			wallMidLeft.visible = false
			wallMidLeft.physicsType = 'n'
			wallMidRight.visible = false
			wallMidRight.physicsType = 'n'
			wallCenter.visible = false
			wallCenter.physicsType = 'n'

			wallCenter1.visible = true
			wallCenter1.physicsType = 's'
			wallCenter2.visible = true
			wallCenter2.physicsType = 's'
		}
			*/

		setTimeout(1000);
	} else if (playerSprite.overlapping(exitDoor) && targetGroup.length > 0) {

		text("oops! you need to destroy all the targets before progressing!", width / 2, height / 2);
	}
}
/*******************************************************/
//  END OF APP
/*******************************************************/