// TypeScript file
module game {
    export class BgMap extends egret.DisplayObjectContainer {
        public constructor(){
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        private bmpArr: egret.Bitmap[];
        private stageW: number;
        private stageH: number;
        private textureHeight: number;
        private rowCount: number;
        private speed: number = 2;

        private onAddToStage(event: egret.Event){
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

            this.stageH = this.stage.stageHeight;
            this.stageW = this.stage.stageWidth;

            let texture:egret.Texture  = RES.getRes("bg_jpg");
            this.textureHeight = texture.textureHeight;
            this.rowCount = Math.ceil(this.stageH/this.textureHeight) + 1;
            this.bmpArr = [];

            //创建图片, 设置y坐标, 并让它们连接起来
            for (let i: number = 0; i < this.rowCount; i++){
                let bgBmp: egret.Bitmap = fighter.createBitmapByName("bg_jpg");
                //mark
                bgBmp.y = this.textureHeight*i-(this.textureHeight*this.rowCount-this.stageH);
                this.bmpArr.push(bgBmp);
                this.addChild(bgBmp);
            }
        }

        /**开始滚动 */
        public start(): void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        }

        /**逐帧运动 */
        private enterFrameHandler(event: egret.Event): void {
            for (let i: number = 0; i < this.rowCount; i++){
                let bgBmp: egret.Bitmap = this.bmpArr[i];
                bgBmp.y += this.speed;
                //判断超出屏幕后，回到队首，这样来实现循环反复
                if (bgBmp.y > this.stageH){
                    bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                    this.bmpArr.pop();
                    this.bmpArr.unshift(bgBmp);//在数组前面添加元素
                }
            }
        }

        /**暂停滚动 */
        public pause():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        } 
    }
}