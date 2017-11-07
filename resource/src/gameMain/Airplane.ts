module fighter {
	export class Airplane extends egret.DisplayObjectContainer{
		private static cacheDict: Object = {};

		private bmp: egret.Bitmap;
		private fireDelay: number;
		private fireTimer: egret.Timer;
		public blood: number = 10;
		public textureName: string;

		public constructor(texture: egret.Texture, fireDelay: number, textureName: string) {
			super();

			this.fireDelay = fireDelay;
			this.bmp = new egret.Bitmap(texture);
			this.textureName = textureName;
			this.addChild(this.bmp);
			this.fireTimer = new egret.Timer(fireDelay);
			this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.createBullet, this);
		}

		/**生产 */
		public static produce(textureName: string, fireDelay: number): fighter.Airplane{
			if (fighter.Airplane.cacheDict[textureName] == null) 
				fighter.Airplane.cacheDict[textureName] = [];
			let dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
			let theFighter: fighter.Airplane;
			if (dict.length > 0) {
				theFighter = dict.pop();
			} else {
				theFighter = new fighter.Airplane(RES.getRes(textureName), fireDelay, textureName);
			}
			theFighter.blood = 10;
			return theFighter;
		}

		/**回收 */
		public static reclaim(theFighter: fighter.Airplane): void {
			let textureName: string = theFighter.textureName;
			if (fighter.Airplane.cacheDict[textureName] == null){
				fighter.Airplane.cacheDict[textureName] = [];
			}
			let dict: fighter.Airplane[] = fighter.Airplane.cacheDict[textureName];
			if (dict.indexOf(theFighter) == -1){
				dict.push(theFighter);
			}
		}

		/**开火 */
		public fire(): void {
			this.fireTimer.start();
		}

		/**停火 */
		public stopFire(): void {
			this.fireTimer.stop();
		}

		/**创建子弹 */
		private createBullet(evt: egret.TimerEvent): void {
			this.dispatchEventWith("createBullet");
		}
	}
}