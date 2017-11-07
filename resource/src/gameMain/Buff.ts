module fighter {
	export class Buff extends egret.Bitmap {
		public textureName: string;

		public constructor(texture:egret.Texture,textureName: string) {
			super(texture);		//mmp
			this.textureName = textureName;
		}

		private static cacheDict: Object = {};
		/**生产 */
		public static produce(textureName: string): fighter.Buff {
			if (fighter.Buff.cacheDict[textureName] == null){
				fighter.Buff.cacheDict[textureName] = [];
			}
			let dict: fighter.Buff[] = fighter.Buff.cacheDict[textureName];
			let buff: fighter.Buff;
			if (dict.length > 0){
				buff = dict.pop();
			} else {
				buff = new fighter.Buff(RES.getRes(textureName), textureName);
			}
			console.log("buff", buff);
			return buff;
		}

		/**回收 */
		public static reclaim(buff: fighter.Buff): void {
			let textureName: string = buff.textureName;
			if (fighter.Buff.cacheDict[textureName] == null){
				fighter.Buff.cacheDict[textureName] = [];
			}
			let dict: fighter.Buff[] = fighter.Buff.cacheDict[textureName];
			if (dict.indexOf(buff) == -1){
				dict.push(buff);
			}
		}
	}
}