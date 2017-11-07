var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fighter;
(function (fighter) {
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        function ScorePanel() {
            var _this = _super.call(this) || this;
            var g = _this.graphics;
            g.beginFill(0x000000, 0.8);
            g.drawRect(0, 0, 400, 200);
            g.endFill();
            _this.text = new egret.TextField();
            _this.text.width = 400;
            _this.text.height = 200;
            _this.text.textAlign = "center";
            _this.text.textColor = 0xffffff;
            _this.text.size = 24;
            _this.text.y = 60;
            _this.addChild(_this.text);
            _this.touchEnabled = false;
            _this.touchChildren = false;
            return _this;
        }
        ScorePanel.prototype.showScore = function (value) {
            var msg = "您的成绩是:\n" + value + "\n再来一次吧";
            this.text.text = msg;
        };
        return ScorePanel;
    }(egret.Sprite));
    fighter.ScorePanel = ScorePanel;
    __reflect(ScorePanel.prototype, "fighter.ScorePanel");
})(fighter || (fighter = {}));
//# sourceMappingURL=ScorePanel.js.map