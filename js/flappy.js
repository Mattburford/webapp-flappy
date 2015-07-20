// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("James_Bond", "../assets/jamesBond.gif");
    game.load.image("Frog", "../assets/flappy_frog.png");
    game.load.image("Background", "../assets/Background_xp.jpg");
    game.load.audio("score", "../assets/point.ogg");

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene

    var background = game.add.image(0, 0, "Background");
    background.width = 790;
    background.height = 400;
    game.stage.setBackgroundColor("#00FF00");
    game.add.text(290,100,"Hi :)",
        {font:"100px Arial",fill:"#3399FF"});
    game.add.sprite(50,50,"Frog");
    game.add.sprite(740,50,"Frog");
    game.add.sprite(740,350,"James_Bond");
    game.add.sprite(50,350,"James_Bond");

        game.input
            .onDown
            .add(clickHandler);
game.input
    .keyboard.addkey(Phaser.Keyboard.SPACEBAR)
    .onDown.add(spaceHandler);
}
function clickHandler(event) {


   game.add.sprite(event.x, event.y, "Frog");
}


/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {

}

function spaceHandler(){
    game.sound.play("score");
}

