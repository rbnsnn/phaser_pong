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
            debug: true
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

function preload() {
    //Preloading assets

    this.load.image('ball', '../assets/ball.png')
    this.load.image('paddle', '../assets/paddle.png')
    this.load.image('smalec', '../assets/smalectrailbig.png');
}

function create() {
    //Create keyboard input

    cursors = this.input.keyboard.createCursorKeys();

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

    let vecX = Phaser.Math.Between(100, 300);
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

    let particles = this.add.particles('smalec');

    let emitter = particles.createEmitter({
        frequency: 300,
        gravityY: 200,
        blendMode: 'add'
    })

    emitter.setPosition(400, 300);
    emitter.setSpeed(50);
    emitter.setLifespan(3000);
    emitter.setScale(1);
    emitter.startFollow(ball);

    //Ball bounce from Player paddle

    const hitPaddlePlayer = function () {
        let diff = 0;

        if (ball.y < paddlePlayer.y) {
            diff = paddlePlayer.y - ball.y;
            ball.setVelocityY(-2 * diff);
        } else if (ball.y > paddlePlayer.y) {
            diff = ball.y - paddlePlayer.y;
            ball.setVelocityY(2 * diff);
        } else {
            ball.setVelocityY(2 + Math.random() * 8);
        }
    }

    //Ball bounce from AI paddle

    const hitPaddleAi = function () {
        let diff = 0;

        if (ball.y < paddleAi.y) {
            diff = paddleAi.y - ball.y;
            ball.setVelocityY(-2 * diff);
        } else if (ball.y > paddleAi.y) {
            diff = ball.y - paddleAi.y;
            ball.setVelocityY(2 * diff);
        } else {
            ball.setVelocityY(2 + Math.random() * 8);
        }
    }

    //Collisions

    this.physics.add.collider(ball, paddlePlayer, hitPaddlePlayer, null, this);
    this.physics.add.collider(ball, paddleAi, hitPaddleAi, null, this);
}

function update() {
    //Reseting ball after hitting score

    const ballReset = function () {
        if (ball.x <= ball.width / 2 || ball.x >= (GW - ball.width / 2)) {
            ball.x = GW / 2;
            ball.y = GH / 2;
        }
    }

    //Keyboard input for paddle move

    paddleAi.setVelocity(0);

    if (cursors.up.isDown) {
        paddleAi.setVelocityY(-300);
    } else if (cursors.down.isDown) {
        paddleAi.setVelocityY(300);
    }

    ballReset();
}