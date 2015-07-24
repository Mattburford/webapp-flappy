// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var player;
var labelScore;
var pipes = [];
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 400;
var jumpPower = 230;
var pipeGap = 100;
var pipeInterval = 1.75;
var gapMargin = 50;
var gapSize = 50;
var pipeMargin = 25;
var blockHeight = 50;
var pipeEndExtraWidth = 20;
var pipeEndHeight = 3;
var balloons = [];
var weights = [];
var star = [];


/*
 * Loads all resources for the game and gives them names.

 $("#greeting-form").on("submit", function(event_details){
 var greeting ="Hello ";
 var name = jQuery("#fullName").val();
 var greeting_message = greeting + name;
 $("#greeting-form").hide();
 $("#greeting").append("<p>" + greeting_message + "</p>");
 //event_details.preventDefault();
 });
 */
//jQuery.get("/score", function (data) {
//    var scores = JSON.parse(data);
//    for (var i = 0; i < scores.length; i++) {
//        $("#scoreBoard").append(
//            "<li>" +
//            scores[i].name + ": " + scores[i].score +
//            "</li>");
//    }
//});


function preload() {
    game.load.image("Frog", "../assets/flappy_frog.png");
    game.load.image("Background", "../assets/Free-vector-cartoon-natural.jpg");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/pipe.png");
    game.load.image("pipeEnd", "../assets/pipe-end.png");
    game.load.image("balloons", "../assets/balloons.png");
    game.load.image("weight", "../assets/weight.png");
    game.load.image("star", "../assets/star.png");
}

/*
 * Initialises the game. This function is only called once.
 */

function clickHandler(event) {
    game.add.sprite(event.x, event.y, "Frog");
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    game.physics.arcade.overlap(player, pipes, gameOver);
    if (0 > player.body.y || player.body.y > width) {
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y / gameSpeed);

    checkBonus(balloons, -50);
    checkBonus(weights, 50);
    for(var i=star.length; i>=0; i--){
        game.physics.arcade.overlap(player,star[i],function() {
            star[i].destroy();
            star.splice(i, 1);
            changeScore();
        });
    }


}
function gameOver() {
    score = 0;
    game.state.restart();
    gameGravity = 500;
    //game.destroy();
    //$("#score").val(score.toString());
    // $("#greeting").show();
    star = [];
}

function spaceHandler() {
    game.sound.play("score");
}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}

function playerJump() {
    player.body.velocity.y = -jumpPower;
}

function addPipeBlockO(x, y) {
    var block = game.add.sprite(x, y, "pipe");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = gameSpeed;
}

function addPipeEnd(x, y) {
    var block = game.add.sprite(x, y, "pipeEnd");
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed;
}

function generatePipeO() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - pipeMargin);

    addPipeEnd(width - 5, gapStart - pipeEndHeight);
    for (var y = gapStart - pipeEndHeight; y > 0; y -= blockHeight) {
        addPipeBlock(width, y);
    }
    addPipeEnd(width - 5, gapStart + gapSize);
    for (var y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    addstar();
}
// Adds a pipe part to the pipes array
function addPipeBlock(x, y) {
    // make a new pipe block
    var block = game.add.sprite(x, y, "pipe");
    // insert it in the pipe array
    pipes.push(block);
    // enable physics engine for the block
    game.physics.arcade.enable(block);
    // set the block's horizontal velocity to a negative value
    // (negative x value for velocity means movement will be towards left)
    block.body.velocity.x = -gameSpeed;
}

// Generate moving pipe
function generatePipe() {
    var gapStart = game.rnd.integerInRange(50, height - 50 - pipeGap);

    addPipeEnd(width - 5, gapStart - 25);
    for (var y = gapStart - 75; y > -50; y -= 50) {
        addPipeBlock(width, y);
    }
    addPipeEnd(width - 5, gapStart + pipeGap);
    for (var y = gapStart + pipeGap + 25; y < height; y += 50) {
        addPipeBlock(width, y);
    }
    addstar(width, gapStart + pipeGap/2 - 25);
}

function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity
}

function generateBalloons() {
    var bonus = game.add.sprite(width, height, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}

function generateWeights() {
    var bonus = game.add.sprite(width, 0, "weight");
    weights.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed;
    bonus.body.velocity.y = game.rnd.integerInRange(60, 100);
}


function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if (diceRoll == 1) {
        generateBalloons();
    } else if (diceRoll == 2) {
        generateWeights();
    } else {
        generatePipe();
    }
}

function checkBonus(bonusArray, bonusEffect) {
    for (var i = bonusArray.length - 1; i >= 0; i--) {
        game.physics.arcade.overlap(player, bonusArray[i], function () {
            changeGravity(bonusEffect);
            bonusArray[i].destroy();
            bonusArray.splice(i, 1);
        });
    }
}
function start() {

    //game.input
    //.onDown
    //.add(clickHandler);
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(function () {
            player.body.velocity.y = -jumpPower;
        });


    player.body.velocity.x = 0;
    player.body.velocity.y = -10;
    player.body.gravity.y = gameGravity;
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);
    splashDisplay.destroy();
}
function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var background = game.add.image(0, 0, "Background");
    background.width = 790;
    background.height = 400;
    game.stage.setBackgroundColor("#00FF00");
    game.add.text(290, 100, "Frog :)",
        {font: "100px Arial", fill: "#3399FF"});
    game.add.sprite(50, 50, "Frog");
    game.add.sprite(740, 50, "Frog");
    game.add.sprite(740, 350, "Frog");
    game.add.sprite(50, 350, "Frog");
    labelScore = game.add.text(20, 20, "0");
    player = game.add.sprite(100, 200, "Frog");
    game.physics.arcade.enable(player);
    player.anchor.setTo(0.5, 0.5);

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);

    splashDisplay = game.add.text(250,250, "Press ENTER to start, SPACEBAR to jump",
    {font: "20px Arial", fill: "#3399FF"});
}
function addstar(x, y){
    var bonus = game.add.sprite(x, y, "star");
    star.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -gameSpeed;

}


