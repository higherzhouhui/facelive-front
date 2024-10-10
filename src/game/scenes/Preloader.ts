import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Preloader extends Scene {

    private loadText: any;
    constructor() {
        super('Preloader');
    }

    preload() {
        //  We loaded this image in our Boot Scene, so we can display it here
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        const originBg = { width: 823, height: 1280 }
        this.add.image(width / 2, height / 2, 'background').setScale(width / originBg.width, height / originBg.height);

        this.loadText = this.add.bitmapText(width / 2, height / 2, 'slime', 'Loading ...', 30).setOrigin(0.5);

        this.load.setPath('assets/games/germs/');
        this.load.atlas('assets', 'germs.png', 'germs.json');
        this.load.atlas('ghost', 'ghost.png', 'ghost.json');
        this.load.glsl('goo', 'goo.glsl.js');
        this.load.image('bullet', 'bullet.png')
        this.load.image('gun', 'gun.png')
        this.load.image('coin', 'coin.png')
        this.load.image('player', 'player.png')
        //  Audio ...
        this.load.setPath('assets/games/germs/sounds/');

        this.load.audio('appear', ['appear.ogg', 'appear.m4a', 'appear.mp3']);
        this.load.audio('fail', ['fail.ogg', 'fail.m4a', 'fail.mp3']);
        this.load.audio('laugh', ['laugh.ogg', 'laugh.m4a', 'laugh.mp3']);
        this.load.audio('music', ['music.ogg', 'music.m4a', 'music.mp3']);
        this.load.audio('pickup', ['pickup.ogg', 'pickup.m4a', 'pickup.mp3']);
        this.load.audio('start', ['start.ogg', 'start.m4a', 'start.mp3']);
        this.load.audio('victory', ['victory.ogg', 'victory.m4a', 'victory.mp3']);
        this.load.audio('dead', ['dead.mp3']);
        this.load.audio('coin', ['coin.mp3']);
        this.load.audio('bullet', ['bullet.mp3']);
        this.load.audio('disappear', ['disappear.mp3']);
    }


    create() {
        //  Create our global animations
       
        this.anims.create({
            key: 'germ1',
            // frames: this.anims.generateFrameNames('assets', { prefix: 'red', start: 1, end: 3 }),
            frames: this.anims.generateFrameNames('ghost', {  prefix: 'g1', start: 1, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'germ2',
            // frames: this.anims.generateFrameNames('assets', { prefix: 'green', start: 1, end: 3 }),
            frames: this.anims.generateFrameNames('ghost', {  prefix: 'g2', start: 1, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'germ3',
            // frames: this.anims.generateFrameNames('assets', { prefix: 'blue', start: 1, end: 3 }),
            frames: this.anims.generateFrameNames('ghost', {  prefix: 'g5', start: 1, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'germ4',
            // frames: this.anims.generateFrameNames('assets', { prefix: 'purple', start: 1, end: 3 }),
            frames: this.anims.generateFrameNames('ghost', {  prefix: 'g4', start: 1, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'coin',
            // frames: this.anims.generateFrameNames('assets', { prefix: 'purple', start: 1, end: 3 }),
            frames: this.anims.generateFrameNames('ghost', {  prefix: 'coin', start: 1, end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        // this.anims.create({
        //     key: 'germ5',
        //     // frames: this.anims.generateFrameNames('assets', { prefix: 'purple', start: 1, end: 3 }),
        //     frames: this.anims.generateFrameNames('ghost', {  prefix: 'g5', start: 1, end: 4 }),
        //     frameRate: 8,
        //     repeat: -1
        // });

        if (this.sound.locked) {
            this.loadText.setText('Click to Start');

            this.input.once('pointerdown', () => {

                this.scene.start('MainMenu');

            });
        }
        else {
            this.scene.start('MainMenu');
        }
        EventBus.emit('current-scene-ready', this);
    }
}
