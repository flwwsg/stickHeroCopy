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
}

function init(target) {
    State.setConsole(console);
    model = new State.StateMachine('model');
    const initial = new State.PseudoState('init-stand', model, State.PseudoStateKind.Initial);

    // 状态机状态
    const stand = new State.StateMachine(fsmState.stand);
    const stickPressEnd = new State.StateMachine(fsmState.stickPressEnd);
    const heroTick = new State.StateMachine(fsmState.heroTick);
    const stickFall = new State.StateMachine(fsmState.stickFall);
    const heroMoveToLand = new State.StateMachine(fsmState.heroMoveToLand);
    const heroMoveToStickEnd = new State.StateMachine(fsmState.heroMoveToStickEnd);
    const heroDown = new State.StateMachine(fsmState.heroDown);
    const end = new State.StateMachine(fsmState.end);

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

    // 初始化状态机
    instance = new State.StateMachineInstance('fsm');
    State.initialise(model, instance);
}

module.exports = {
    init,
}