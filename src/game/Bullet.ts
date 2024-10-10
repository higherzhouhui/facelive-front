import MainGame from "./scenes/Game";

export default class Bullet extends Phaser.Physics.Arcade.Image {
    // 定义属性类型
    isAlive: boolean;
    speed: number;
    target: Phaser.Math.Vector2;
    germPos: any;
    private mainScene: MainGame;

    constructor(scene: MainGame, x: number, y: number, germ: any) {
        super(scene, x, y, 'bullet');

        this.setScale(0.3, 0.3).setDepth(1).setOrigin(0.5, 0.5)
        this.mainScene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.setCircle(14, 3, 6);
        this.setCollideWorldBounds(true);

        this.isAlive = false;
        this.speed = 500;
        this.target = new Phaser.Math.Vector2(x, y);
        this.germPos = {
            directionX: (germ.x - x) / 40,
            directionY: (germ.y - y) / 40
        }
    }

    reStart() {
        const player = this.mainScene.player
        if (player) {
            this.target = new Phaser.Math.Vector2(player.x, player.y);
        }
    }

    stop(): void {
        this.isAlive = false;

        this.body!.stop();
    }

    preUpdate(): void {
        this.body!.velocity.x += this.germPos.directionX;
        this.body!.velocity.y += this.germPos.directionY;
        if (this.body!.x > this.mainScene.screen.width - 16 || this.body!.x < 8 || this.body!.y < 8 || this.body!.y > this.mainScene.screen.height - 16) {
            this.destroy()
        }
        // const scene: any = this.scene;
        // scene.getVirus(this.target);
        // // Add 90 degrees because the sprite is drawn facing up
        // this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + 1.5707963267948966;
        // if (this.target.x == 0 || this.target.y == 0) {
        //     this.destroy()
        // }
    }
}