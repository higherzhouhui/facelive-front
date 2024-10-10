export default class Player extends Phaser.Physics.Arcade.Image
{
    // 定义属性类型
    isAlive: boolean;
    speed: number;
    target: Phaser.Math.Vector2;
    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y, 'ghost', 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setDepth(10).setScale(0.6,0.6)
        this.setCircle(22);
        this.setCollideWorldBounds(true);

        this.isAlive = false;

        this.speed = 280;
        this.target = new Phaser.Math.Vector2();
    }

    start(): void
    {
        this.isAlive = true;

        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) =>
        {
            if (this.isAlive)
            {
                this.target.x = pointer.x;
                this.target.y = pointer.y;
                // Add 90 degrees because the sprite is drawn facing up
                this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + 1.5707963267948966;
            }
        });
    }

    kill(): void
    {
        this.isAlive = false;

        this.body!.stop();
    }

    preUpdate(): void
    {
        const body: any = this.body
        if (body.speed &&( body.speed > 0 && this.isAlive))
        {
            if (Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 6)
            {
                this.body!.reset(this.target.x, this.target.y);
            }
        }
    }
}