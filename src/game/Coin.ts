import MainGame from "./scenes/Game";

export default class Germ extends Phaser.Physics.Arcade.Sprite {
  
    constructor(scene: MainGame, x: number, y: number, animation: string) {
        super(scene, x, y, 'assets');

        this.play(animation);
        this.setScale(0.4)
    }

   

    restart(x: number, y: number) {
       
    }

    hint(): void {
      
    }
    stop(): any {
        
    }
}