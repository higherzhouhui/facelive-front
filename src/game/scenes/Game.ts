import { EventBus } from "../EventBus";
import Germs from '../Germs.js';
import Player from '../Player.js';
import Pickups from '../Pickups.js';
import Bullet from "../Bullet";
import Germ from "../Germ";
import { formatNumTen } from "@/utils/common";
export default class MainGame extends Phaser.Scene {
    public player: Player | null;
    public screen: { width: number, height: number };
    public gameInfo: any;
    public life: number;
    private germs: Germs | null;
    private pickups: Pickups | null;
    private introText: Phaser.GameObjects.BitmapText | null;
    private scoreText: Phaser.GameObjects.BitmapText | null;
    private highscore: number;
    private newHighscore: boolean;
    private startTime: number;
    private bullet: any;
    private canTouch: boolean;
    private timedEvent: any;
    public killGhost: number;
    private coin: number;
    private score: number;
    private gameInfoText: any;
    constructor() {
        super('MainGame');

        this.player = null;
        this.germs = null;
        this.pickups = null;
        this.gameInfoText = null;
        this.introText = null;
        this.scoreText = null;
        this.score = 0;
        this.highscore = 0;
        this.newHighscore = false;
        this.screen = { width: 0, height: 0 }
        this.startTime = Date.now()
        this.life = 1
        this.canTouch = true
        this.timedEvent = null
        this.killGhost = 0
        this.coin = 0
    }

    create(): void {
        const screen = document.getElementById('root')!;
        const width = screen.clientWidth;
        const height = screen.clientHeight;
        this.screen = { width, height }
        this.score = 0;
        this.highscore = this.registry.get('highscore');
        this.newHighscore = false;

        const originBg = { width: 823, height: 1280 }
        this.add.image(width / 2, height / 2, 'background').setScale(width / originBg.width, height / originBg.height);

        this.germs = new Germs(this.physics?.world, this);

        this.pickups = new Pickups(this.physics?.world, this);

        this.player = new Player(this, width / 2, height / 2);
        this.bullet = []

        this.scoreText = this.add.bitmapText(width - 120, 18, 'slime', 'Coin   0', 16).setDepth(1);

        this.introText = this.add.bitmapText(width / 2, height / 2, 'slime', 'Avoid the Germs\n\nCollect the Coins', 30).setOrigin(0.5).setCenterAlign().setDepth(100);

        this.pickups.start();

        this.input.once('pointerdown', () => {
            this.player!.start();
            this.germs!.start();
            this.sound.play('start');
            this.tweens.add({
                targets: this.introText,
                alpha: 0,
                duration: 300
            });
        });

        // Define the type for timedEvent as a Phaser.Time.Event
        this.timedEvent = this.time.addEvent({
            delay: 50,
            callback: this.shootBullet,
            callbackScope: this,
            loop: true
        });



        this.physics.add.overlap(this.player, this.pickups, (player: any, pickup: any) => this.playerHitPickup(player, pickup));
        this.physics.add.overlap(this.player, this.germs, (player: any, germ: any) => this.playerHitGerm(player, germ));
        this.physics.add.overlap(this.bullet, this.germs!, (bullet: any, germ: any) => this.bulletHintGerm(bullet, germ));

        EventBus.emit('current-scene-ready', this);
    }
    shootBullet() {
        const pos = this.getVirusPos()
        if (pos.x !== 0 && pos.y !== 0) {
            const bullet = new Bullet(this, this.player!.x, this.player!.y, this.getVirusPos())
            this.sound.play('bullet', { volume: 0.1 })
            this.bullet.push(bullet)
        }
    }
    playerHitGerm(player: Player, germ: Germ): void {
        if (player.isAlive && germ.isChasing) {
            if (this.canTouch) {
                this.life--;
                this.sound.play('dead');
                this.cameras.main.shake(100, 0.01);
                this.canTouch = false
                setTimeout(() => {
                    this.canTouch = true
                }, 3000);
            }
            if (this.life <= 0) {
                this.gameOver();
            }
        }
    }

    playerHitPickup(player: Player, pickup: any): void {
        this.coin += 1
        this.score = formatNumTen(this.gameInfo.game.ratio * this.coin * this.gameInfo.user.efficiency)
        this.scoreText!.setText('Coin    ' + this.score);

        // if (!this.newHighscore && this.score > this.highscore) {
        //     if (this.highscore > 0) {
        //         this.sound.play('victory');
        //     } else {
        //         this.sound.play('pickup');
        //     }
        //     this.newHighscore = true;
        // } else {
        //     this.sound.play('pickup');
        // }
        const isOver = this.coin >= this.gameInfo.game.coin ? true : false
        this.sound.play('coin');
        this.pickups!.collect(pickup, isOver);
    }

    bulletHintGerm(bullet: Bullet, germ: Germ) {
        if (germ.isChasing) {
            germ.hint()
            bullet.destroy()
        }
    }

    gameOver(): void {
        this.player!.kill();
        this.germs!.stop();
        this.sound.stopAll();
        if (this.timedEvent) {
            this.timedEvent.remove();
        }
        this.sound.play('fail');
        this.introText!.setText('Game Over!');

        this.tweens.add({
            targets: this.introText,
            alpha: 1,
            duration: 300
        });

        if (this.newHighscore) {
            this.registry.set('highscore', this.score);
        }
        setTimeout(() => {
            localStorage.setItem('currentScore', `${this.score}`)
            localStorage.removeItem('victory')
            this.scene.start('GameOver')
        }, 1000);
    }

    passGame(): void {
        this.player!.kill();
        this.germs!.stop();
        this.sound.stopAll();
        this.sound.play('victory');
        this.introText!.setText('Pass the level!');
        if (this.timedEvent) {
            this.timedEvent.remove();
        }
        this.tweens.add({
            targets: this.introText,
            alpha: 1,
            duration: 300
        });

        if (this.newHighscore) {
            this.registry.set('highscore', this.score);
        }
        setTimeout(() => {
            localStorage.setItem('currentScore', `${this.score}`)
            localStorage.setItem('victory', 'victory')
            this.scene.start('GameOver')
        }, 1000);
    }

    getPlayer(target: Phaser.GameObjects.Sprite): Phaser.GameObjects.Sprite {
        target.x = this.player!.x;
        target.y = this.player!.y;
        return target;
    }

    getVirus(target: Phaser.GameObjects.Sprite): Phaser.GameObjects.Sprite {
        let closestVirus = { x: 0, y: 0 };
        let minDistance = Infinity; // 初始化为无穷大

        this.germs?.getChildren().forEach((virus: any) => {
            if (virus.isChasing) {
                // 计算当前病毒与飞机之间的距离
                let distance = Phaser.Math.Distance.Between(this.player!.x, this.player!.y, virus.x, virus.y);

                // 如果当前病毒距离更近，则更新最近病毒的信息
                if (distance < minDistance) {
                    minDistance = distance;
                    closestVirus = virus;
                }
            }
        });
        target.x = closestVirus.x;
        target.y = closestVirus.y;
        return target;
    }

    getVirusPos() {
        let closestVirus = { x: 0, y: 0 };
        let minDistance = Infinity; // 初始化为无穷大

        this.germs?.getChildren().forEach((virus: any) => {
            if (virus.isChasing) {
                // 计算当前病毒与飞机之间的距离
                let distance = Phaser.Math.Distance.Between(this.player!.x, this.player!.y, virus.x, virus.y);

                // 如果当前病毒距离更近，则更新最近病毒的信息
                if (distance < minDistance) {
                    minDistance = distance;
                    closestVirus = virus;
                }
            }
        });
        return { x: closestVirus.x, y: closestVirus.y }
    }

    getGameDuration() {
        // 获取当前时间
        let currentTime = Date.now();
        // 计算游戏进行的时长（毫秒）
        let duration = currentTime - this.startTime;
        return duration / 1000;
    }

    initConfig(config: any) {
        this.gameInfo = config
        this.life = config.skin.life
        // this.add.bitmapText(16, 18, 'slime', `Level   ${this.gameInfo?.game.level}`, 18).setDepth(1);
        const fontStyle = {
            fontSize: 12,
            color: '#fff',
        }
        const str = `Coins: ${this.gameInfo.game.coin - this.coin}   Germs: ${this.gameInfo.game.ghost - this.killGhost}\n`
        this.gameInfoText = this.add.text(16, 8, str, fontStyle)
        this.gameInfoText.setShadow(2, 2, '#000', 2);
        console.log(this.gameInfo)
    }
    update(time: number, delta: number): void {
        this.updateGameInfo()
    }
    updateGameInfo() {
        if (!this.gameInfo) {
            return
        }
        let heart = ''
        for (let i = 0; i < this.life; i++) {
            heart += '❤️'
        }
        heart = heart || '💔'
        const str = `Life:${heart}\nLevel: ${this.gameInfo.game.level}  RGerms: ${this.gameInfo.game.ghost - this.killGhost}\nATK: ${this.gameInfo.user.attack}    Crit: ${this.gameInfo.skin.strike * 100}%\nDeuff: ${(1 - this.gameInfo.skin.speed) * 100}% EFCY: ${this.gameInfo.user.efficiency * 100}%\n`
        this.gameInfoText.setText(str)

    }
}