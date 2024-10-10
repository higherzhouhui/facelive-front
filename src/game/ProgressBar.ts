export default class ProgressBar extends Phaser.GameObjects.Graphics {
    x: number;
    y: number;
    maxValue: number;
    progressWidth: number;
    width: number;
    height: number;
    selfHeight: number;
    color: number;
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, maxValue: number, color: string) {
        super(scene);
        this.x = x - width / 2;
        this.y = y - height / 2;
        this.maxValue = maxValue;
        this.progressWidth = 0;
        this.selfHeight = 4
        // 绘制进度条的背景
        this.fillStyle(0x222222); // 设置背景颜色
        this.fillRect(0, 0, width * 0.7, this.selfHeight).setDepth(40); // 绘制矩形
        this.color = 0x4BBA96
        // 将进度条添加到场景中
        scene.add.existing(this);
        this.width = width
        this.height = height
    }
    getColor(color: string) {
      let str = 0xEF95F8
      if (color == 'germ1') {
        str = 0xFF8642
      } else if (color == 'germ2') {
        str = 0x4BBA96
      } else if (color == 'germ3') {
        str = 0x2F2FFF

      }
      return str
    }
    updatePos(x: number, y: number) {
      this.x = x - this.width / 2;
      this.y = y - this.height / 2;
    }
    // 更新进度条的值
    setProgress(value: number): void {
        if (value > this.maxValue) {
            value = this.maxValue;
        }

        // 计算进度条的宽度
        this.progressWidth = (value / this.maxValue) * this.width;

        // 清除之前的进度条
        this.clear();

        // 绘制进度条的背景
        this.fillStyle(0x222222);
        this.fillRect(0, 0, this.width, this.selfHeight);

        // 绘制进度条的进度部分
        this.fillStyle(this.color); // 设置进度颜色
        this.fillRect(0, 0, this.progressWidth, this.selfHeight);
    }
}