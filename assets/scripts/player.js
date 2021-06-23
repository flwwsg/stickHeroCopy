const storageManager = require('./storageManager');
const spriteCreator = require('./spriteCreator');
const fsm = require('./fsm');
const { redLandSize } =require('./constants');

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
        this.isFirst = true;
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
        this.createNewLand();
        const range = this.getLandRange();
        // 角色世界坐标
        this.heroWorldPosX = this.firstLand.width - (1 - this.hero.anchorX) * this.hero.width - this.stickWidth;
        // 第二块跳板
        this.secondLand.setPosition(range + this.firstLand.width, 0);
        // 初始化
        fsm.init(this);
        this.registryEvent();
        // const ani = this.hero.getComponent(cc.Animation);
        // ani.on('stop', (type, state, target) => {
        //     if (state.name === 'heroTick') {
        //         // TODO fsm
        //         // fsm.stickFall()
        //     }
        // });

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

    unregisterEvent() {
        cc.log('touch off');
        this.canvas.targetOff(this.node);
    },

    touchStart(event) {
        cc.log('touchStart');
        fsm.toPress();
    },
    touchEnd(event) {
        cc.log('touch end');
        fsm.heroStick();
    },
    touchCancel(event) {
        cc.log('touch cancel');
        this.touchEnd(event);
    },

    // 设置最高分
    updateHighestScoreLabel() {
        this.highestScoreLabel.string = '最高分:' + storageManager.getHighestScore();
    },
    // 跳板的范围
    getLandRange() {
        this.currentLandRange = this.landRange.x + (this.landRange.y - this.landRange.x) * Math.random();
        // 窗口大小
        const winSize = cc.winSize;
        if (winSize.width < this.currentLandRange + this.heroWorldPosX + this.hero.width + this.secondLand.width) {
            this.currentLandRange = winSize.width - this.heroWorldPosX - this.hero.width - this.secondLand.width;
        }
        return this.currentLandRange;
    },

    getLandWidth() {
        return this.landWidth.x + (this.landWidth.y - this.landWidth.x) * Math.random();
    },

    createNewLand() {
        this.secondLand = spriteCreator.createNewLand(this.getLandWidth());
        this.secondLand.parent = this.node;
    },
    // 按压棍子
    // onStickLengthen
    enterStickPress() {
        this.isPress = true;
        this.stick = this.createStick();
        // 棍子立于英雄前面
        this.stick.x = this.hero.x + this.hero.width * (1 - this.hero.anchorX) + this.stick.width * this.stick.anchorX;
        console.log('stick.x', this.stick.x);
        // TODO play heroPush animation
        // const animation = this.hero.getComponent(cc.Animation);
        // animation.play()
    },

    // 踢棍子
    // onHeroTick
    enterHeroTick() {
        this.isPress = false;
        // TODO play hero tick, to fsm stickFall state on play finish
        fsm.stickFall();
    },

    exitHeroTick() {
        // 禁止触摸
        this.unregisterEvent();
    },

    // onStickFall
    enterStickFall() {
        const cb = function () {
            // hero move
            // 棍子的长度, 扣掉转下去时，棍子的宽度
            const stickLength = this.stick.height - this.stick.width * this.stick.anchorX;
            if (stickLength < this.currentLandRange || stickLength > this.currentLandRange + this.secondLand.width) {
                // 失败
                cc.log('stick fail');
                fsm.heroMoveFail();
            } else {
                cc.log('stick success');
                fsm.heroMoveSuccess();
                const halfSize = redLandSize.width / 2;
                if (stickLength > this.currentLandRange + this.secondLand.width / 2 - halfSize
                    && stickLength < this.currentLandRange + this.secondLand.width / 2 + halfSize) {
                    // 落在红色区域中
                    // TODO perform perfect
                }
            }
        };
        cc.tween(this.stick).to(0.5, { angle: -90 }, { easing: 'sineIn' }).call(cb.bind(this)).start();
    },

    enterStickEnd() {
        // TODO play hero run
        const cb = () => {
            // TODO stop animation
            fsm.heroDown();
        };
        this.heroMove(this.stick.height, cb);
    },

    enterHeroDown() {
        // stick down
        cc.tween(this.stick).to(0.5, { angle: -180 }, { easing: 'sineIn'}).start();
        // hero down
        const cb = () => {
            // TODO gameOver
            cc.log('game over');
            // fsm.gameOver();
        }
        cc.tween(this.hero).by(0.5, { position: cc.v2(0, -300 - this.hero.height)}, { easing: 'sineIn' }).call(cb.bind(this)).start();
    },

    enterHeroMoveSuccess() {
        cc.log('hero move to land');
        const cb = () => {
            // TODO play hero run
            // 跳过第一块
            fsm.landMove();
            this.getScore();
        }
        this.heroMove(this.currentLandRange + this.secondLand.width, cb);
    },

    // 生成新地
    enterLandMove() {
        cc.log('enter land move');
        if (this.isFirst) {
            // 跳过第一次
            this.isFirst = false;
            return;
        }
        const cb = () => {
            this.registryEvent();
        }
        const winSize = cc.winSize;
        const length = this.currentLandRange + this.secondLand.width;
        // 地面的坐标
        this.runLength += length;
        cc.tween(this.node).by(this.moveDuration, { position: cc.v2(-length, 0) }).start();
        this.firstLand = this.secondLand;
        this.createNewLand();
        const range = this.getLandRange();
        this.secondLand.setPosition(this.runLength + winSize.width, 0);
        // 移动到新位置
        const l = winSize.width - range - this.heroWorldPosX - this.hero.width * this.hero.anchorX - this.stickWidth;
        cc.tween(this.secondLand).by(this.moveDuration, { position: cc.v2(-l, 0) }).call(cb.bind(this)).start();
    },

    heroMove(runLength, cb) {
        const t = runLength / this.heroMoveSpeed;
        if (cb) {
            cc.tween(this.hero).by(t, { position: cc.v2(runLength, 0) }).call(cb.bind(this)).start();
        } else {
            cc.tween(this.hero).by(t, { position: cc.v2(runLength, 0) }).start();
        }
    },

    // 计算分数
    getScore(num) {
        if (num) {
            this.score += num;
        } else {
            this.score++;
        }
        if (storageManager.getHighestScore() < this.score) {
            storageManager.setHighestScore(this.score);
            this.changeHighestScoreLabel();
        }
        this.scoreLabel.string = '得分:' + this.score;
    },

    changeHighestScoreLabel() {
        this.highestScoreLabel.string = '最高分:' + storageManager.getHighestScore();
    },

    createStick() {
        cc.log('create stick');
        const stick = spriteCreator.createStick(this.stickWidth);
        stick.parent = this.node;
        return stick;
    }
});
