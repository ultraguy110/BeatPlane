namespace game {
	export class gameMain extends egret.DisplayObjectContainer{
		public constructor() {
			super();

			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		}

		private stageW: number;
		private stageH: number;
		private btnStart;
		/**可滚动的背景 */
		private bg: game.BgMap;

		/**我的飞机 */
		private myPlane: fighter.Airplane;
		/**敌人的飞机 */
		private enemyPlanes: fighter.Airplane[] = [];
		/**显示成绩 */
		private scorePanel: fighter.ScorePanel;
		/**我的成绩 */
		private myScore: number;
		/**触发创建敌机的间隔 */
		private enemyPlaneTimer: egret.Timer = new egret.Timer(1000);
		/**敌人的子弹 */
		private enemyBullets: fighter.Bullet[] = [];
		/**我的子弹 */
		private myBullets: fighter.Bullet[] = [];
		private _lastTime: number;
		/**加血道具 */
		// private buff_blood: egret.Bitmap;
		private buffArr: fighter.Buff[] = [];
		/**血槽 */
		private bloodBar: egret.Bitmap;
		private bloodBarBg: egret.Bitmap;

		/**初始化 */
		private onAddToStage() {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
			this.createGameScene();
		}

		/**创建游戏场景 */
		private createGameScene(): void {
			this.stageW = this.stage.stageWidth;
			this.stageH = this.stage.stageHeight;

			this.bg = new game.BgMap();
			this.addChild(this.bg);

			this.btnStart = fighter.createBitmapByName("btn_start_png");
			this.btnStart.x = (this.stageW - this.btnStart.width) / 2;
			this.btnStart.y = (this.stageH - this.btnStart.height) / 2;
			this.btnStart.touchEnabled = true;
			this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
			this.addChild(this.btnStart);

			//我的飞机
			this.myPlane = new fighter.Airplane(RES.getRes("f1_png"), 100, "f1_png");
			this.myPlane.y = this.stageH - this.myPlane.height - 50;
			//我的飞机的锚点
			this.myPlane.anchorOffsetX = this.myPlane.width / 2;
			this.myPlane.anchorOffsetY = this.myPlane.height / 2;
			// console.log("我的飞机的锚点", this.myPlane.scaleX);
			this.addChild(this.myPlane);
			this.scorePanel = new fighter.ScorePanel();
			//预创建
			this.preCreatedInstance();
			//创建血槽
			let myHP = new egret.Bitmap(RES.getRes("hp_png"));
			this.addChild(myHP);
			this.bloodBarBg = new egret.Bitmap(RES.getRes("bloodBarBg_png"));
			this.bloodBarBg.x = 70;
			this.bloodBarBg.y = 5;
			this.addChild(this.bloodBarBg);
			this.bloodBar = new egret.Bitmap(RES.getRes("bloodBar_png"));
			this.bloodBar.x = 70;
			this.bloodBar.y = 5;
			this.addChild(this.bloodBar);
		}

		/**预创建一些对象, 减少游戏时的创建消耗 */
		private preCreatedInstance(): void {
			let i: number = 0;
			let objArr: any[] = [];
			for (i = 0; i < 20; i++){
				var bullet = fighter.Bullet.produce("b1_png");
				objArr.push(bullet);
				// console.log("111", i);
			}
			for (i = 0; i < 20; i++){
				bullet = objArr.pop();
				fighter.Bullet.reclaim(bullet);
				// console.log("222", i);
			}
			for (i = 0; i < 20; i++){
				var enemyPlane: fighter.Airplane = fighter.Airplane.produce("f2_png", 1000);
				objArr.push(enemyPlane);
				// console.log("333", i);
			}
			for (i = 0; i < 20; i++){
				enemyPlane = objArr.pop();
				fighter.Airplane.reclaim(enemyPlane);
				// console.log("444", i);
			}
		}

		private gameStart(){
			this.myScore = 0;
			this.removeChild(this.btnStart);
			this.bg.start();
			this.touchEnabled = true;
			this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
			this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
			this.myPlane.x = (this.stageW - this.myPlane.width) / 2;
			this.myPlane.fire();
			this.myPlane.blood = 10;
			this.myPlane.addEventListener("createBullet", this.createBulletHandler, this);
			this.enemyPlaneTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane, this);
			this.enemyPlaneTimer.start();
			if (this.scorePanel.parent == this){
				this.removeChild(this.scorePanel);
			}
			//重置血槽
			if (this.bloodBar.width < 92) this.bloodBar.width = 92;
		}

		/**响应Touch */
		private touchHandler(evt: egret.TouchEvent): void {
			if (evt.type == egret.TouchEvent.TOUCH_MOVE){
				let tx: number = evt.localX;
				tx = Math.max(0, tx);
				tx = Math.min(this.stageW, tx);
				this.myPlane.x = tx;

				let ty: number = evt.localY;
				ty = Math.max(0, ty);
				ty = Math.min(this.stageH, ty);
				this.myPlane.y = ty;
			}
		}
		
		/**创建子弹(包括我的子弹和敌机的子弹) */
		private createBulletHandler(evt: egret.Event): void {
			let bullet: fighter.Bullet;
			if (evt.target == this.myPlane) {
				for (let i: number = 0; i < 2; i++){
					bullet = fighter.Bullet.produce("b1_png");
					// bullet.x = i == 0 ? (this.myPlane.x + 10) : (this.myPlane.x + this.myPlane.width - 22);
					// console.log("wwwww", i);
					bullet.x = i == 0 ? (this.myPlane.x - this.myPlane.width/2) : (this.myPlane.x + this.myPlane.width/2 - 22);
					bullet.y = this.myPlane.y - 30;
					this.addChildAt(bullet, this.numChildren - 1 - this.enemyPlanes.length);
					this.myBullets.push(bullet);
				}
				//散弹
				//暴走8发子弹
				// if (1){
				// 	for(let i: number = 0; i < 8; i++){
				// 		bullet = fighter.Bullet.produce("b1_png");
				// 		if (i == 0){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2;
				// 		} else if (i == 1){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2 + 20;
				// 		} else if (i == 2){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2 + 40;
				// 		} else if (i == 3){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2 + 60;
				// 		} else if (i == 4){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2 + 80;
				// 		} else if (i == 5){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2 + 100;
				// 		} else if (i == 6){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2 + 120;
				// 		} else if (i == 7){
				// 			bullet.x = this.myPlane.x - this.myPlane.width/2 + 140;
				// 		}
				// 		bullet.y = this.myPlane.y - 30;
				// 	this.addChildAt(bullet, this.numChildren - 1 - this.enemyPlanes.length);
				// 	this.myBullets.push(bullet);
				// 	}
				// }
			} else {
				let theFighter: fighter.Airplane = evt.target;
				bullet = fighter.Bullet.produce("b2_png");
				bullet.x = theFighter.x + 28;
				bullet.y = theFighter.y + 10;
				this.addChildAt(bullet, this.numChildren - 1 - this.enemyPlanes.length);
				this.enemyBullets.push(bullet);
			}
		}

		/**创建敌机 */
		private createEnemyPlane(evt: egret.TimerEvent): void {
			let enemyPlane: fighter.Airplane = fighter.Airplane.produce("f2_png", 1000);
			enemyPlane.x = Math.random() * (this.stageW - enemyPlane.width);
			enemyPlane.y = -enemyPlane.height - Math.random() * 300;
			enemyPlane.addEventListener("createBullet", this.createBulletHandler, this);
			enemyPlane.fire();
			this.addChildAt(enemyPlane, this.numChildren - 1);
			this.enemyPlanes.push(enemyPlane);
		}

		/**游戏画面更新 */
		private gameViewUpdate(evt: egret.Event): void {
			let nowTime: number = egret.getTimer();
			let fps: number = 1000/(nowTime - this._lastTime);
			this._lastTime = nowTime;
			let speedOffset: number = 60/fps;
			//我的子弹运动
			let i: number = 0;
			let bullet: fighter.Bullet;
			let myBulletsCount: number = this.myBullets.length;
			for (i = 0 ; i < myBulletsCount; i++){
				bullet = this.myBullets[i];
				if (bullet.y < -bullet.height){		//子弹完全射出屏幕外面(上边界)
					this.removeChild(bullet);
					fighter.Bullet.reclaim(bullet);	//mark
					//代表从第 i+1 位开始, 移除一个元素, 如果后面还有参数, 则代表从 i+1 位开始依次插入参数
					this.myBullets.splice(i, 1);
					i--;
					myBulletsCount--;
				}
				// bullet.y -= 12*speedOffset;
				//散弹
				// if (i == 0){
					// console.log(i);
					// bullet.x -= 5*speedOffset;
					bullet.y -= 12*speedOffset;
				// }
			}

			//敌机运动
			let theFighter: fighter.Airplane;
			let enemyPlanesCount: number = this.enemyPlanes.length;
			for (i = 0; i < enemyPlanesCount; i++){
				theFighter = this.enemyPlanes[i];
				if (theFighter.y > this.stage.stageHeight){
					this.removeChild(theFighter);
					fighter.Airplane.reclaim(theFighter);	//mark
					theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
					theFighter.stopFire();
					this.enemyPlanes.splice(i, 1);
					i--;
					enemyPlanesCount--;
				}
				theFighter.y += 4 * speedOffset;
			}

			//敌人子弹运动
			let enemyBulletsCount: number = this.enemyBullets.length;
			for (i = 0; i < enemyBulletsCount; i++){
				bullet = this.enemyBullets[i];
				if (bullet.y > this.stage.stageHeight){
					this.removeChild(bullet);
					fighter.Bullet.reclaim(bullet);
					this.enemyBullets.splice(i, 1);
					i--;
					enemyBulletsCount--;
				}
				bullet.y += 8 * speedOffset;
			}

			//道具移动
			// let buffCount: number = this.buffArr.length;
			// let buff: fighter.Buff;
			// for (i = 0; i < buffCount; i++){
			// 	buff = this.buffArr[i];
			// 	// console.log(i);
			// 	// if (i == 0){
			// 	// 	buff.y += speedOffset;
			// 	// }


			// 	// buff.y += 5 * speedOffset;
			// }

			this.gameHitTest();
		}

		/**游戏碰撞检测 */
		private gameHitTest(): void{
			let i: number, j: number;
			let bullet: fighter.Bullet;
			let theFighter: fighter.Airplane;
			let buff: fighter.Buff;
			let myBulletsCount: number = this.myBullets.length;
			let enemyPlanesCount: number = this.enemyPlanes.length;
			let enemyBulletsCount: number = this.enemyBullets.length;
			let buffCount: number = this.buffArr.length;
			//将消失的子弹和飞机记录
			let delBullets: fighter.Bullet[] = [];
			let delPlanes: fighter.Airplane[] = [];
			//我的子弹可以消灭敌机
			for (i = 0; i < myBulletsCount; i++){
				bullet = this.myBullets[i];
				for (j = 0; j < enemyPlanesCount; j++){
					theFighter = this.enemyPlanes[j];
					if (fighter.GameUtil.hitTest(theFighter, bullet)){
						theFighter.blood -= 2;
						if (delBullets.indexOf(bullet) == -1){
							delBullets.push(bullet);
						}
						if (theFighter.blood <= 0 && delPlanes.indexOf(theFighter) == -1){
							delPlanes.push(theFighter);

							let random_addBlood = Math.round(Math.random()*10);
							//爆出加血道具
							if (random_addBlood > 6){
								// console.log(theFighter.x, theFighter.y);

								let buff_blood = fighter.Buff.produce("buff_blood_png");
								buff_blood.x = theFighter.x + theFighter.width/2;
								buff_blood.y = theFighter.y + theFighter.height/2;
								// console.log("buff_blood", buff_blood);
								this.addChild(buff_blood);
								this.buffArr.push(buff_blood);
							}
						}

					}
				}
			}

			//敌人的子弹可以减我的血
			for (i = 0; i < enemyBulletsCount; i++){
				bullet = this.enemyBullets[i];
				if (fighter.GameUtil.hitTest(this.myPlane, bullet)){
					this.myPlane.blood -= 1;
					//血槽减少
					this.bloodBar.width -= 9;
					if (delBullets.indexOf(bullet) == -1){
						delBullets.push(bullet);
					}
				}
			}

			//撞击敌机可以消灭我
			for (i = 0; i < enemyPlanesCount; i++){
				theFighter = this.enemyPlanes[i];
				if (fighter.GameUtil.hitTest(this.myPlane, theFighter)){
					// this.myPlane.blood -= 10;
					//清空血槽
					// this.bloodBar.width = 0;
				}
			}
			if (this.myPlane.blood <= 0){
				this.gameStop();
			} else {
				while (delBullets.length > 0){
					bullet = delBullets.pop();
					this.removeChild(bullet);
					if (bullet.textureName == "b1_png")
						this.myBullets.splice(this.myBullets.indexOf(bullet), 1);
					else
						this.enemyBullets.splice(this.enemyBullets.indexOf(bullet), 1);
					fighter.Bullet.reclaim(bullet);
				}
				this.myScore += delPlanes.length;
				while (delPlanes.length > 0){
					theFighter = delPlanes.pop();
					theFighter.stopFire();
					theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
					this.removeChild(theFighter);
					this.enemyPlanes.splice(this.enemyPlanes.indexOf(theFighter), 1);
					fighter.Airplane.reclaim(theFighter);
				}
			}

			//吃到道具
			for (i = 0; i < buffCount; i++){
				buff = this.buffArr[i];
				// console.log(buff);
				console.log(this.buffArr);
				if (fighter.GameUtil.hitTest(this.myPlane, buff)){
					if (this.myPlane.blood < 10){
						this.myPlane.blood += 1;
						this.bloodBar.width += 9;
						// console.log(this);
						// console.log(buff.parent);
						console.log(buff);
						this.buffArr.splice(this.buffArr.indexOf(buff), 1);
						if (buff.parent) buff.parent.removeChild(buff);
						fighter.Buff.reclaim(buff);
					}
				}
			}
		}

		/**游戏结束 */
		private gameStop(): void {
			this.addChild(this.btnStart);
			this.bg.pause();
			this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
			this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
			this.myPlane.stopFire();
			this.myPlane.removeEventListener("createBullet", this.createBulletHandler, this);
			this.enemyPlaneTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemyPlane, this);
			this.enemyPlaneTimer.stop();
			//清理子弹
			let i: number = 0;
			let bullet: fighter.Bullet;
			while (this.myBullets.length > 0){
				bullet = this.myBullets.pop();
				this.removeChild(bullet);
				fighter.Bullet.reclaim(bullet);
			}
			while (this.enemyBullets.length > 0){
				bullet = this.enemyBullets.pop();
				this.removeChild(bullet);
				fighter.Bullet.reclaim(bullet);
			}

			//清理飞机
			let theFighter: fighter.Airplane;
			while (this.enemyPlanes.length > 0){
				theFighter = this.enemyPlanes.pop();
				theFighter.stopFire();
				theFighter.removeEventListener("createBullet", this.createBulletHandler, this);
				this.removeChild(theFighter);
				fighter.Airplane.reclaim(theFighter);
			}
			//显示成绩
			this.scorePanel.showScore(this.myScore);
			this.scorePanel.x = (this.stageW - this.scorePanel.width) / 2;
			this.scorePanel.y = 100;
			this.addChild(this.scorePanel);
		}
	}
}