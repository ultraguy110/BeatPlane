module fighter {
	export class ScorePanel extends egret.Sprite{
		private text: egret.TextField;

		public constructor() {
			super();

			let g:egret.Graphics = this.graphics;
			g.beginFill(0x000000, 0.8);
			g.drawRect(0, 0, 400, 200);
			g.endFill();

			this.text = new egret.TextField();
			this.text.width = 400;
			this.text.height = 200;
			this.text.textAlign = "center";
			this.text.textColor = 0xffffff;
			this.text.size = 24;
			this.text.y = 60;
			this.addChild(this.text);
			this.touchEnabled = false;
			this.touchChildren = false;
		}

		public showScore(value: number): void {
			let msg: string = "您的成绩是:\n"+value+"\n再来一次吧";
			this.text.text = msg;
		}
	}
}