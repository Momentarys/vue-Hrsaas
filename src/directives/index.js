//  负责管理所有的自定义指令
export const imgerror = {
  // onerror 属性
  // 指令对象会在当前的el元素插入到节点之后执行
  inserted(el, binding, vnode) {
    // binding.是指令中的变量的解释其中有一个属性叫做value
    // el表示当前指令作用的dom对象
    // el认为此时就是图片
    // 当图片有地址 但是地址没有加载成功的时候 会报错会触发图片的一个事件 => onerror
    el.onerror = function() {
      // 当图片出现异常的时候 会将指令配置的默认图片设置为该图片的内容
      // el可以注册error事件
      el.src = binding.value // 这里不能写死
    }
  }
}
// 虚拟dom描述
//
