
const g = require('./constants');

// 闭包处理缓存
const spriteCreator = (function () {
    let spriteFrameCache = null;

    return {
        // 生成另一跳板
        createNewLand: function (width) {
            const newLand = new cc.Node('land');
            // 锚点在左下角
            newLand.anchorX = 0;
            newLand.anchorY = 0;
            const sprite = newLand.addComponent(cc.Sprite);
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            newLand.color = cc.Color.BLACK;
            newLand.height = g.heroSize.height;
            newLand.width = width;

            // 生成红色块
            const redLand = new cc.Node('redLand');
            redLand.anchorY = 1;
            const redSprite = redLand.addComponent(cc.Sprite);
            redSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            redLand.color = cc.Color.RED;
            redLand.parent = newLand;
            redLand.height = g.redLandSize.height;
            redLand.width = g.redLandSize.width;
            redLand.setPosition(newLand.width/2, newLand.height);
            if (spriteFrameCache) {
                sprite.spriteFrame = spriteFrameCache;
                redSprite.spriteFrame = spriteFrameCache;
            } else {
                // 载入图片
                cc.loader.loadRes('blank', cc.SpriteFrame, (err, sf) => {
                    sprite.spriteFrame = sf;
                    redSprite.spriteFrame = sf;
                    spriteFrameCache = sf;
                });
            }
        },
        // 添加棍子长度
        createStick: function (width) {
            const stick = new cc.Node('stick');
            // 水平居中
            stick.anchorY = 0;
            stick.y = g.heroSize.height;
            const sprite = stick.addComponent(cc.Sprite);
            // sprite 模式
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite.spriteFrame = spriteFrameCache;
            stick.color = cc.Color.BLACK;
            stick.width = width;
            stick.height = 0;
            return stick;
        }
    }
})();


module.exports = spriteCreator;