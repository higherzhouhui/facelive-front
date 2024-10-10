import { EventBus } from "../EventBus";

export default class MainMenu extends Phaser.Scene
{
    private music: any;
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        this.music = this.sound.play('music', { loop: true });
        
        this.sound.play('laugh');

        const originBg = { width: 823, height: 1280 }
        this.add.image(width / 2, height / 2, 'background').setScale(width / originBg.width, height / originBg.height);

        const area = new Phaser.Geom.Rectangle(0, 0, width, height);

        this.addGerm(area, 'germ1');
        this.addGerm(area, 'germ2');
        this.addGerm(area, 'germ3');
        this.addGerm(area, 'germ4');
        
        this.add.shader('goo', width / 2, height / 2, width, height);

        this.add.image(width / 2, height / 2 - 90, 'assets', 'logo').setScale(0.5, 0.5);

        this.add.bitmapText(width / 2, height / 2, 'slime', 'Click to Play', 30).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainGame');

        });
        EventBus.emit('current-scene-ready', this);
    }

    addGerm (area: any, animation: any)
    {
        let start = area.getRandomPoint();

        let germ = this.add.sprite(start.x, start.y, '').play(animation).setScale(0.75);
        
        let durationX = Phaser.Math.Between(4000, 6000);
        let durationY = durationX + 3000;

        this.tweens.add({
            targets: germ,
            x: {
                getStart: (tween: any, target: any) => {
                    return germ.x;
                },
                getEnd: () => {
                    return area.getRandomPoint().x;
                },
                duration: durationX,
                ease: 'Linear'
            },
            y: {
                getStart: (tween: any, target: any) => {
                    return germ.y;
                },
                getEnd: () => {
                    return area.getRandomPoint().y;
                },
                duration: durationY,
                ease: 'Linear'
            },
            repeat: -1
        });
    }
}
