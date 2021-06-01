### 状态机
仓库地址：https://github.com/jakesgordon/javascript-state-machine

### 使用方法
```js
var fsm = new StateMachine({
init: 'solid',
transitions: [
{ name: 'melt',     from: 'solid',  to: 'liquid' },
{ name: 'freeze',   from: 'liquid', to: 'solid'  },
{ name: 'vaporize', from: 'liquid', to: 'gas'    },
{ name: 'condense', from: 'gas',    to: 'liquid' }
],
methods: {
onMelt:     function() { console.log('I melted')    },
onFreeze:   function() { console.log('I froze')     },
onVaporize: function() { console.log('I vaporized') },
onCondense: function() { console.log('I condensed') }
}
});


```
