import ProgressBar from "./ProgressBar";
import MainGame from "./scenes/Game";

export default class Germ extends Phaser.Physics.Arcade.Sprite {
    public isChasing: boolean;
    private speed: number;
    private originSpeed: number;
    private target: Phaser.Math.Vector2;
    private life: number;
    private healthBar: ProgressBar;
    private mainScene: MainGame;
    private customScale: number;
    constructor(scene: MainGame, x: number, y: number, animation: string, speed?: number) {
        super(scene, x, y, 'assets');

        this.play(animation);
        this.customScale = Phaser.Math.FloatBetween(0.7, 1.1)
        this.setScale(this.customScale);
        this.speed = speed || 100; // Default speed if not provided
        this.originSpeed = this.speed
        this.mainScene = scene
        this.alpha = 0;
        this.isChasing = false;

        this.target = new Phaser.Math.Vector2();
        this.life = Math.ceil(scene.gameInfo.game.life * this.customScale)

        this.healthBar = new ProgressBar(scene, x, y, 85 * this.customScale,  85 * this.customScale, this.life, animation)
        this.healthBar.setProgress(this.life)
    }

    start(chaseDelay?: number): this {
        const radius = Math.floor(78 * this.customScale) / 2

        this.setCircle(radius);
        chaseDelay = chaseDelay || Phaser.Math.RND.between(this.mainScene.gameInfo.game.delay * 1000, 4000);
        this.scene.sound.play('appear');

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: chaseDelay,
            ease: 'Linear',
            hold: chaseDelay + 500,
            onComplete: () => {
                const scene: any = this.scene;
                if (scene && scene.player && scene.player.isAlive) {
                    this.isChasing = true;
                }
            }
        });

        return this;
    }

    restart(x: number, y: number): this {
        this.body!.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        this.setAlpha(0);

        return this.start();
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        if (this.isChasing) {
            const scene: any = this.scene;
            scene.getPlayer(this.target);
            // Add 90 degrees because the sprite is drawn facing up
            this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + 10.5707963267948966;
            this.healthBar.updatePos(this.x, this.y)
        }
    }
    hint(): void {
        let attack = this.mainScene.gameInfo.user.attack
        const random = Math.random()
        if (random <  this.mainScene.gameInfo.skin.strike) {
            attack *= 2
        }
        this.life -= attack
        this.speed = this.originSpeed * this.mainScene.gameInfo.skin.speed
        this.healthBar.setProgress(this.life)
        if (this.life <= 0) {
            this.destroy();
            this.healthBar.destroy();
            this.mainScene.sound.play('disappear')
            this.mainScene.killGhost ++;
            if (this.mainScene.killGhost >= this.mainScene.gameInfo.game.ghost) {
                this.mainScene.passGame()
            }
        }
    }
    stop(): any {
        this.isChasing = false;
        this.body!.stop();
    }
}