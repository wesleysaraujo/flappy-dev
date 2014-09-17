//Inicializa o phaser, e cria define a tela do game
var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gameDiv');

//Cria seu estado principal onde rolará o game

var mainState = {

	preload: function(){

		//Esta função é executada no inicio
		//Enquanto o game carrega os assets

		game.stage.backgroundColor = '#000';

		//Carrega o passaro sprit
		game.load.image('bird', 'img/angularjs.png');
		// Load pipe
		game.load.image('pipe', 'img/pipe.png');
		//Load Audio
		game.load.audio('jump', 'jump.wav');

	},

	create: function(){
		//Sistema de fisica
		game.physics.startSystem(Phaser.Physics.ARCADE);

		// Display com o passaro na tela
		this.bird = this.game.add.sprite(10, 0, 'bird');

		//Adiciona gravidade para o passaro cair
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 1000;

		// Chama a função de jump com a tecla de espaço
		var tap = this.game.input.onTap;
		tap.add(this.jump, this);

		//Pipes
		this.pipes = game.add.group(); //Create a group
		this.pipes.enableBody = true; // Add physics to the group
		this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes

		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

		//Score
		this.score = 0;
		this.labelScore = game.add.text(20,20, "0", {font: "30px Arial", fill: "#FFFFFF"}); 

		this.bird.anchor.setTo(-0.2, 0.5);

		this.jumpSound = game.add.audio('jump');
	},

	addOnePipe: function(x, y){
		// Get the first dead pipe of our group
		var pipe = this.pipes.getFirstDead();

		// Set the new position of the pipe
		pipe.reset(x, y);

		// Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;

		// Kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	},

	addRowOfPipes: function(){
		// Pick where the hole will be
		var hole = Math.floor(Math.random() * 5) + 1;

		// add the 6 pipes
		for (var i = 0; i < 8; i++){
			if(i != hole && i != hole + 1)
			{
				this.addOnePipe(400, i * 60 + 10);
			}
		}

		this.score += 1;
		this.labelScore.text = this.score;
	},

	update: function(){
		//Essa função é chamad 60x por segundo
		//E contem a lógica do jogo

		if (this.bird.inWorld == false) {
			this.restartGame();
		}

		if (this.bird.angle < 20) {
			this.bird.angle += 1;
		}

		game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
	},

	hitPipe: function(){
		// If the bird has already hit a pipe, whe have nothing to do
		if(this.bird.alive == false)
			return;

		// Set alive property of the bird to false
		this.bird.alive = false;

		// Prevent new pipes from appearing
		game.time.events.remove(this.timer);

		// Go through all the pipes, and stop their movement

		this.pipes.forEachAlive(function(p){
			p.body.velocity.x = 0;
		}, this);
	},

	// Cria o pulo do passaro
	jump: function(){

		if (this.bird.alive == false)
			return;

		this.bird.body.velocity.y = -350;

		// Create an animation on the bird
		var animation = game.add.tween(this.bird);

		// Set the animation to change the anglo of the sprite to -20º in 100 milliseconds
		animation.to({angle: -15}, 100);

		this.jumpSound.play();

		// And start the animation
		animation.start();
	},

	// Reinicia o game
	restartGame: function(){
		game.state.start('main');
	},
};

//game.add.tween(this.bird).to({angle:-20}, 100).start();

//Adiciono o main e starto o objet

game.state.add('main', mainState);
game.state.start('main');