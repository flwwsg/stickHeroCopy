const storageManager = require('./storageManager');

cc.Class({
    extends: cc.Component,

    properties: {
        // 生成的地板范围
        landRange: cc.v2(20, 300),
        hero: cc.Node,
        firstLand: cc.Node,

        canvas: cc.Node,
        scoreLabel: cc.Label,
        highestScoreLabel: cc.Label,
    },

    onLoad () {
        // 棍子
        this.stick = null;
        // 棍子是否在按压（伸长）
        this.isPress = false;
        this.score = 0;
        this.currentLandRange = 0;
    },

    start () {

    },

    // update (dt) {},

    // 设置最高分
    updateHighestScoreLabel() {
        this.highestScoreLabel.string = '最高分:' + storageManager.getHighestScore();
    }
});
