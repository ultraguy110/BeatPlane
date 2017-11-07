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
    var Buff = (function (_super) {
        __extends(Buff, _super);
        function Buff(texture, textureName) {
            var _this = _super.call(this, texture) || this;
            _this.textureName = textureName;
            return _this;
        }
        /**生产 */
        Buff.produce = function (textureName) {
            if (fighter.Buff.cacheDict[textureName] == null) {
                fighter.Buff.cacheDict[textureName] = [];
            }
            var dict = fighter.Buff.cacheDict[textureName];
            var buff;
            if (dict.length > 0) {
                buff = dict.pop();
            }
            else {
                buff = new fighter.Buff(RES.getRes(textureName), textureName);
            }
            console.log("buff", buff);
            return buff;
        };
        /**回收 */
        Buff.reclaim = function (buff) {
            var textureName = buff.textureName;
            if (fighter.Buff.cacheDict[textureName] == null) {
                fighter.Buff.cacheDict[textureName] = [];
            }
            var dict = fighter.Buff.cacheDict[textureName];
            if (dict.indexOf(buff) == -1) {
                dict.push(buff);
            }
        };
        return Buff;
    }(egret.Bitmap));
    Buff.cacheDict = {};
    fighter.Buff = Buff;
    __reflect(Buff.prototype, "fighter.Buff");
})(fighter || (fighter = {}));
//# sourceMappingURL=Buff.js.map