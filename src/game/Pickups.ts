import Coin from "./Coin";
import MainGame from "./scenes/Game";

export default class Pickups extends Phaser.Physics.Arcade.Group
{
    private outer: Phaser.Geom.Rectangle;
    private target: Phaser.Geom.Point;
    private mainScene: MainGame;
    constructor(world: Phaser.Physics.Arcade.World, scene: MainGame)
    {
        super(world, scene);
        this.outer = new Phaser.Geom.Rectangle(16, 32, scene.screen.width - 32, scene.screen.height - 48);
        this.target = new Phaser.Geom.Point();
        this.mainScene = scene
    }

    start(): void
    {
        const width = this.mainScene.screen.width;
        const height = this.mainScene.screen.height;

        for (let i = 0; i < 4; i ++) {
            let _width = Phaser.Math.RND.between(16, width - 16);
            let _height = Phaser.Math.RND.between(16, height - 16);
            if (Math.abs(_width - width / 2) < 10 && Math.abs(_height - height / 2) < 10) {
                _width = Phaser.Math.RND.between(16, width - 16);
                _height = Phaser.Math.RND.between(16, height - 16);
            }
            // this.create(_width, _height, 'ghost', 'coin1').setScale(0.4).setDepth(20);
            const coin  = new Coin(this.mainScene, _width, _height, 'coin');
      
    
            this.add(coin, true);
        }
    }

    collect(pickup: Phaser.GameObjects.GameObject, isOver: boolean): void
    {
        // Move the pick-up to a new location
        const body = pickup.body as any
        body.reset && body.reset(10000, 10000);
        if (!isOver) {
            setTimeout(() => {
                try {
                    this.outer.getRandomPoint(this.target);
                    const body = pickup.body as any
                    body.reset && body.reset(this.target.x, this.target.y);
                } catch (error) {
                    console.error(error)
                }
            }, 10000);
        }
    }
}