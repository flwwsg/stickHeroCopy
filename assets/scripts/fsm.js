const State = require('./lib/state.com');
const { fsmState, gameAction } = require('./constants');

// 比较消息状态
function on(message) {
    return function (msg2Evaluate) {
        return msg2Evaluate === message;
    }
}
let evaluating = false;
let instance;
let model;

function _evaluate(message) {
    cc.log('evaluating message ' + message);
    if (evaluating) {
        // 正在处理，1s以后再试
        cc.log('on evaluating');
        setTimeout(function () {
            State.evaluate(model, instance, message);
        }, 1);
        return;
    }
    evaluating = true;
    State.evaluate(model, instance, message);
    evaluating = false;
}

function init(target) {
    State.setConsole(console);
    model = new State.StateMachine('model');
    const initial = new State.PseudoState('init-stand', model, State.PseudoStateKind.Initial);

    // 状态机状态
    const stand = new State.State(fsmState.stand, model);
    const stickPressEnd = new State.State(fsmState.stickPressEnd, model);
    const heroTick = new State.State(fsmState.heroTick, model);
    const stickFall = new State.State(fsmState.stickFall, model);
    const heroMoveToLand = new State.State(fsmState.heroMoveToLand, model);
    const heroMoveToStickEnd = new State.State(fsmState.heroMoveToStickEnd, model);
    const heroDown = new State.State(fsmState.heroDown, model);
    const end = new State.State(fsmState.end, model);

    // 初始为站立
    initial.to(stand);
    stand.to(stickPressEnd).when(on(gameAction.stickPress));
    stickPressEnd.to(heroTick).when(on(gameAction.heroTick));
    heroTick.to(stickFall).when(on(gameAction.stickFall));
    stickFall.to(heroMoveToLand).when(on(gameAction.moveToLand));
    // 没有走到下一地板
    stickFall.to(heroMoveToStickEnd).when(on(gameAction.moveToStickEnd));
    heroMoveToLand.to(stand).when(on(gameAction.moveToLandEnd));
    heroMoveToStickEnd.to(heroDown).when(on(gameAction.moveDown));
    heroDown.to(end).when(on(gameAction.heroDown));
    // 重新开始
    end.to(stand).when(on(gameAction.reset));

    // 生成棍子
    stickPressEnd.entry(function () {
        cc.log('enter on press');
        target.enterStickPress();
    });
    heroTick.entry(function () {
        cc.log('enter hero stick');
        target.enterHeroTick();
    });
    stickFall.entry(function () {
        cc.log('enter stick fall');
        target.enterStickFall();
    });

    // 初始化状态机
    instance = new State.StateMachineInstance('fsm');
    State.initialise(model, instance);
}

// 按压棍子
function toPress() {
    _evaluate(gameAction.stickPress);
}

// 踢棍子
function heroStick() {
    _evaluate(gameAction.heroTick);
}

function stickFall() {
    _evaluate(gameAction.stickFall);
}

module.exports = {
    init,
    toPress,
    heroStick,
    stickFall,
}