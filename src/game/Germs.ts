import Germ from './Germ';
import MainGame from './scenes/Game';

export default class Germs extends Phaser.Physics.Arcade.Group {
    private germConfig: { animation: string; speed: number }[];
    private timedEvent: any;
    private mainScene: MainGame;
    constructor(world: Phaser.Physics.Arcade.World, scene: MainGame) {
        super(world, scene);

        this.classType = Germ;
        this.mainScene = scene
        // Define the type for germConfig as an array of objects with animation and speed properties
        this.germConfig = [
            { animation: 'germ1', speed: 60 },
            { animation: 'germ2', speed: 90 },
            { animation: 'germ3', speed: 120 },
            { animation: 'germ4', speed: 180 },
        ];
    }

    start(): void {
        const width = this.mainScene.screen.width;
        const height = this.mainScene.screen.height;
        let germ1 = new Germ(this.mainScene, 100, 200, 'germ1');
        let germ2 = new Germ(this.mainScene, width - 75, 100, 'germ2');
        let germ3 = new Germ(this.mainScene, width - 100, height - 100, 'germ3');
        let germ4 = new Germ(this.mainScene, width - 200, height - 250, 'germ4');

        this.add(germ1, true);
        this.add(germ2, true);
        this.add(germ3, true);
        this.add(germ4, true);

        germ1.start(1000);
        germ2.start(2000);
        germ3.start(1000);
        germ4.start(2000);

        // Define the type for timedEvent as a Phaser.Time.Event
        this.timedEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: this.releaseGerm,
            callbackScope: this,
            loop: true
        });
    }
    
    stop(): void {
        if (this.timedEvent) {
            this.timedEvent.remove();
        }

        this.getChildren().forEach((child: any) => {
            child.stop();
        });
    }

    releaseGerm(): void {
        // // 根据当前游戏时长增加难度
        // if (this.mainScene.getGameDuration() > 60) {
        //     this.timedEvent.remove();
        //     this.timedEvent = this.scene.time.addEvent({
        //         delay: 1200,
        //         callback: this.releaseGerm,
        //         callbackScope: this,
        //         loop: true
        //     });
        // } else if (this.mainScene.getGameDuration() > 120) {
        //     this.timedEvent.remove();
        //     this.timedEvent = this.scene.time.addEvent({
        //         delay: 500,
        //         callback: this.releaseGerm,
        //         callbackScope: this,
        //         loop: true
        //     });
        // }
        const x = Phaser.Math.RND.between(20, this.mainScene.screen.width - 40);
        const y = Phaser.Math.RND.between(20, this.mainScene.screen.height - 40);

        let germ: Germ | undefined;

        let config: { animation: string; speed: number } = Phaser.Math.RND.pick(this.germConfig);

        this.getChildren().forEach((child: any) => {
            if (child.anims.getName() === config.animation && !child.active) {
                // We found a dead matching germ, so resurrect it
                germ = child;
            }
        });

        if (germ) {
            germ.restart(x, y);
        } else {
            germ = new Germ(this.mainScene, x, y, config.animation, config.speed);
            
            this.add(germ, true);

            germ.start();
        }
    }
}