// 全局变量

// 大小
// 跳板上的红色方块
const redLandSize = {
    width: 10,
    height: 10,
};

const heroSize = {
    // width:
    // 英雄的高度
    height: 300,
};

const fsmState = {
    // 站立
    stand: 'stand',
    // 棍子伸长完毕
    stickPressEnd: 'stickPressEnd',
    // 踢棍子
    heroTick: 'heroTick',
    // 棍子落下
    stickFall: 'stickFall',
    // 英雄移动到另一地板
    heroMoveToLand: 'heroMoveToLand',
    // 英雄移动到棍子顶部
    heroMoveToStickEnd: 'heroMoveToStickEnd',
    // 英雄掉落
    heroDown: 'heroDown',
    // 结束
    end: 'end',
}

// 游戏动画
const gameAnimation = {
    heroPush: 'heroPush',
}

// 游戏动作
const gameAction = {
    // 压棍子
    stickPress: 'stickPress',
    // 踢
    heroTick: 'heroTick',
    // 落下棍子
    stickFall: 'stickFall',
    moveToLand: 'moveToLand',
    landMove: 'landMove',
    moveToStickEnd: 'moveToStickEnd',
    heroDown: 'heroDown',
    heroEnd: 'heroEnd',
    reset: 'reset',
}

module.exports = {
    heroSize,
    redLandSize,
    fsmState,
    gameAction,
}