const GW = 1200;
const GH = 700;

// const ball = {
//     size: 20,
//     speed: 100,
// }
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
let game = new Phaser.Game(config);
let ball;
let paddlePlayer;
let paddleAi;
let cursor;

function preload() {
    this.load.image('ball', '../assets/ball.png')
    this.load.image('paddle', '../assets/paddle.png')
    this.load.image('smalec', '../assets/smalectrailbig.png');
}

function create() {
    cursors = this.input.keyboard.createCursorKeys();
    paddlePlayer = this.physics.add.image(100, (GH / 2), 'paddle');
    paddlePlayer.setImmovable(true);
    paddlePlayer.setCollideWorldBounds(true);
    paddlePlayer.setBounce(1);
    paddlePlayer.setDepth(5);


    paddleAi = this.physics.add.image((GW - 100), (GH / 2), 'paddle');
    paddleAi.setImmovable(true);
    paddleAi.setCollideWorldBounds(true);
    paddleAi.setBounce(1);
    paddleAi.setDepth(5);

    let vecX = Phaser.Math.Between(100, 300);
    let vecY = Phaser.Math.Between(-300, 300);
    ball = this.physics.add.image((GW / 2), (GH / 2), 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(vecX, vecY);
    ball.setDepth(5);

    this.input.on('pointermove', function (pointer) {
        paddlePlayer.y = pointer.y;
    }, this);




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



    const hitPaddlePlayer = function () {
        let diff = 0;

        if (ball.y < paddlePlayer.y) {
            //  Ball is on the left-hand side of the paddle
            diff = paddlePlayer.y - ball.y;
            ball.setVelocityY(-2 * diff);
        } else if (ball.y > paddlePlayer.y) {
            //  Ball is on the right-hand side of the paddle
            diff = ball.y - paddlePlayer.y;
            ball.setVelocityY(2 * diff);
        } else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityY(2 + Math.random() * 8);
        }
    }

    const hitPaddleAi = function () {
        let diff = 0;

        if (ball.y < paddleAi.y) {
            //  Ball is on the left-hand side of the paddle
            diff = paddleAi.y - ball.y;
            ball.setVelocityY(-2 * diff);
        } else if (ball.y > paddleAi.y) {
            //  Ball is on the right-hand side of the paddle
            diff = ball.y - paddleAi.y;
            ball.setVelocityY(2 * diff);
        } else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ball.setVelocityY(2 + Math.random() * 8);
        }
    }

    this.physics.add.collider(ball, paddlePlayer, hitPaddlePlayer, null, this);
    this.physics.add.collider(ball, paddleAi, hitPaddleAi, null, this);




}

function update() {
    const ballReset = function () {
        if (ball.x <= ball.width / 2 || ball.x >= (GW - ball.width / 2)) {
            ball.x = GW / 2;
            ball.y = GH / 2;
        }
    }



    paddleAi.setVelocity(0);

    if (cursors.up.isDown) {
        paddleAi.setVelocityY(-300);
    } else if (cursors.down.isDown) {
        paddleAi.setVelocityY(300);
    }

    ballReset();
}