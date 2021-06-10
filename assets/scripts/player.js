const storageManager = require('./storageManager');

cc.Class({
    extends: cc.Component,

    properties: {
        // 生成的地板范围
        landRange: cc.v2(20, 300),
        landWidth: cc.v2(20, 200),
        hero: cc.Node,
        firstLand: cc.Node,
        secondLand: cc.Node,
        moveDuration: 0.5,
        // 棍子伸长的速度
        stickSpeed: 400,
        // 英雄移动的速度
        heroMoveSpeed: 400,
        stickWidth: 6,
        canvas: cc.Node,
        scoreLabel: cc.Label,
        highestScoreLabel: cc.Label,
        overLabel: cc.Label,
        perfectLabel: cc.Node,
    },

    onLoad () {
        this.runLength = 0;
        // 棍子
        this.stick = null;
        // 棍子是否在按压（伸长）
        this.isPress = false;
        this.score = 0;
        this.perfect = 0;
        this.currentLandRange = 0;
        this.heroWorldPosX = 0;
        this.updateHighestScoreLabel();
        // TODO init gameController
        this.createNewLand();
        const range = this.getLandRange();
        // 角色世界坐标
        this.heroWorldPosX = this.firstLand.width - (1 - this.hero.anchorX) * this.hero.width - this.stickWidth;

        // 第二块跳板
        this.secondLand.setPosition(range + this.firstLand.width, 0);

        // TODO register event
        const ani = this.hero.getComponent(cc.Animation);
        ani.on('stop', (type, state, target) => {
            if (state.name === 'heroTick') {
                // TODO fsm
                // fsm.stickFall()
            }
        });

    },

    start () {

    },

    // 更新棍子长度
    update (dt) {
        if (this.isPress) {
            this.stick.height += dt * this.stickSpeed;
        }
    },
    // 注册
    registryEvent() {
        cc.log('touch on');
        this.canvas.on(cc.Node.EventType.TOUCH_START, this.touchStart.bind(this), this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_END, this.touchEnd.bind(this), this.node);
        this.canvas.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel.bind(this), this.node);
    },

    touchStart(event) {
        cc.log('touchStart');
        // TODO fsm press stick
    },
    touchEnd(event) {
        cc.log('touch end');
        // TODO fsm hero touch stick
    },
    touchCancel(event) {
        cc.log('touch cancel');
        this.touchEnd(event);
    },

    // 设置最高分
    updateHighestScoreLabel() {
        this.highestScoreLabel.string = '最高分:' + storageManager.getHighestScore();
    },
    // TODO 跳板的范围
    getLandRange() {
    },

    // TODO create new land
    createNewLand() {

    }
});
