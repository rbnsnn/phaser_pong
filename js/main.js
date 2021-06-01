//Window Width and Height
const GW = 1200;
const GH = 700;

//Phaser init
let config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true
            // gravity: {
            //     y: 100
            // }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//Variables
let game = new Phaser.Game(config);
let ball;
let paddlePlayer;
let paddleAi;
let cursor;
let scorePlayer;
let scoreAi;
let score;

function preload() {
    //Preloading assets
    this.load.image('ball', '../assets/balls.png')
    this.load.image('paddle', '../assets/paddle.png')
    this.load.image('particle', '../assets/particle.png');
}

function create() {
    //Create keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    //Line and circle
    let graphics = this.add.graphics();
    let a = new Phaser.Geom.Point(GW / 2, GH / 2);
    let radius = 100;

    graphics.lineStyle(1, 0xffffff, 1);
    graphics.lineBetween(GW / 2, 0, GW / 2, GH);
    graphics.strokeCircle(a.x, a.y, radius);

    //Player paddle set
    paddlePlayer = this.physics.add.image(100, (GH / 2), 'paddle');
    paddlePlayer.setImmovable(true);
    paddlePlayer.setCollideWorldBounds(true);
    paddlePlayer.setBounce(1);
    paddlePlayer.setDepth(5);

    //AI paddle set
    paddleAi = this.physics.add.image((GW - 100), (GH / 2), 'paddle');
    paddleAi.setImmovable(true);
    paddleAi.setCollideWorldBounds(true);
    paddleAi.setBounce(1);
    paddleAi.setDepth(5);

    //Ball set
    let vecX = Phaser.Math.Between(500, 600);
    let vecY = Phaser.Math.Between(-300, 300);
    ball = this.physics.add.image((GW / 2), (GH / 2), 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(vecX, vecY);
    ball.setDepth(5);

    //Moving paddle via mouse
    this.input.on('pointermove', function (pointer) {
        paddlePlayer.y = pointer.y;
    }, this);


    //Particle emmiter
    let particles = this.add.particles('particle');

    let emitter = particles.createEmitter({
        // gravityY: 200,
        blendMode: 'add',
    })

    emitter.setSpeed(50);
    emitter.setLifespan(500);
    emitter.setScale(1);
    emitter.startFollow(ball);



    //Ball bounce from Player paddle
    const hitPaddlePlayer = function () {
        let diff = 0;

        if (ball.y < paddlePlayer.y) {
            diff = paddlePlayer.y - ball.y;
            ball.setVelocityY(-3 * diff);
        } else if (ball.y > paddlePlayer.y) {
            diff = ball.y - paddlePlayer.y;
            ball.setVelocityY(3 * diff);
        } else {
            ball.setVelocityY(3 + Math.random() * 8);
        }
    }

    //Ball bounce from AI paddle
    const hitPaddleAi = function () {
        let diff = 0;

        if (ball.y < paddleAi.y) {
            diff = paddleAi.y - ball.y;
            ball.setVelocityY(-3 * diff);
        } else if (ball.y > paddleAi.y) {
            diff = ball.y - paddleAi.y;
            ball.setVelocityY(3 * diff);
        } else {
            ball.setVelocityY(3 + Math.random() * 8);
        }
    }

    //Scoring
    scorePlayer = 0;
    scoreAi = 0;
    scorePlayerText = this.add.text(20, 20, scorePlayer, {
        font: '36px Courier',
        fill: '#fff',
        align: 'center'
    });

    scoreAiText = this.add.text(GW - 40, 20, scoreAi, {
        font: '36px Courier',
        fill: '#fff',
        align: 'left'
    });
    if (ball.x <= ball.width / 2) scoreAi++;
    if (ball.x >= (GW - ball.width / 2)) scorePlayer++;

    //Collisions
    this.physics.add.collider(ball, paddlePlayer, hitPaddlePlayer, null, this);
    this.physics.add.collider(ball, paddleAi, hitPaddleAi, null, this);


}

function update() {
    //Reseting ball after hitting score
    const ballReset = function () {

        ball.x = GW / 2;
        ball.y = GH / 2;

    }


    //Score update
    scorePlayerText.setText(scorePlayer);
    scoreAiText.setText(scoreAi);

    if (ball.x <= ball.width / 2) scoreAi++;
    if (ball.x >= (GW - ball.width / 2)) scorePlayer++;

    //Keyboard input for paddle move
    paddleAi.setVelocity(0);

    if (cursors.up.isDown) {
        paddleAi.setVelocityY(-300);
    } else if (cursors.down.isDown) {
        paddleAi.setVelocityY(300);

    }

    if (ball.x <= ball.width / 2 || ball.x >= (GW - ball.width / 2)) {
        ballReset();

    }
}