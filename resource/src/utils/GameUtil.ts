module fighter {
	export class GameUtil {
		public static hitTest(obj1: egret.DisplayObject, obj2: egret.DisplayObject): boolean {
			let rect1: egret.Rectangle = obj1.getBounds();
			let rect2: egret.Rectangle = obj2.getBounds();
			rect1.x = obj1.x;
			rect1.y = obj1.y;
			rect2.x = obj2.x;
			rect2.y = obj2.y;
			return rect1.intersects(rect2);
		}
	}

	/**根据name创建一个bitmap对象 */
	export function createBitmapByName(name: string): egret.Bitmap {
		let result: egret.Bitmap = new egret.Bitmap();
		let texture: egret.Texture = RES.getRes(name);
		result.texture = texture;
		return result;
	}
}