import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 224,
  backgroundColor: "#6185f8",
  parent: "app",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 300 },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);

//TODO : Implementar las rutas de los assets para que se carguen en produccion correctamente
function preload() {
  // Load images
  this.load.image("cloud1", "/scenery/overworld/cloud1.png");
  this.load.image("floorbricks", "/scenery/overworld/floorbricks.png");

  // Load spritesheets
  this.load.spritesheet("mario", "/mc/bebemc.png", {
    frameWidth: 18,
    frameHeight: 16,
  });

  // Load audio
  this.load.audio("worl", "/sound/music/overworld/theme.mp3");
  this.load.audio("jump", "/sound/effects/jump.mp3");
}

function create() {
  this.add.image(50, 100, "cloud1").setOrigin(0, 0).setScale(0.15);
  this.add.image(126, 45, "cloud1").setOrigin(0, 0).setScale(0.15);
  this.add.image(200, 79, "cloud1").setOrigin(0, 0).setScale(0.15);

  this.floor = this.physics.add.staticGroup();
  this.floor
    .create(0, config.height, "floorbricks")
    .setOrigin(0, 1)
    .refreshBody();
  this.floor
    .create(150, config.height, "floorbricks")
    .setOrigin(0, 1)
    .refreshBody();
  this.mario = this.physics.add
    .sprite(30, config.height - 100, "mario")
    .setOrigin(0, 0)
    .setCollideWorldBounds(true);

  this.physics.add.collider(this.mario, this.floor);

  this.anims.create({
    key: "mario-walk",
    frames: this.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "mario-jump",
    frames: [{ key: "mario", frame: 5 }],
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "mario-idle",
    frames: [{ key: "mario", frame: 0 }],
    frameRate: 10,
    repeat: -1,
  });

  this.keys = this.input.keyboard.createCursorKeys();
  this.sound.add("worl").play()
  this.sound.add("jump")
}

function update() {
  // Update game logic
  if (this.keys.left.isDown) {
    this.mario.x -= 2;
    this.mario.flipX = true;
    this.mario.anims.play("mario-walk", true);
    if (!this.mario.body.touching.down) {
      this.mario.anims.play("mario-jump", true);
    }
  } else if (this.keys.right.isDown) {
    this.mario.x += 2;
    this.mario.flipX = false;
    this.mario.anims.play("mario-walk", true);
    if (!this.mario.body.touching.down) {
      this.mario.anims.play("mario-jump", true);
    }
  } else if (this.mario.body.touching.down) {
    this.mario.anims.play("mario-idle", true);
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-200);
    this.mario.anims.play("mario-jump", true);
    this.sound.play("jump")
  }
}
