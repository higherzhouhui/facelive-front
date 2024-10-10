import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('background', 'assets/bg.jpg');
        this.load.setPath('assets/games/germs/');
        this.load.bitmapFont('slime', 'slime-font.png', 'slime-font.xml');
    }

    create() {
        this.registry.set('highscore', 0);

        this.scene.start('Preloader');    }
}
