// 封装中间件函数
export const directiveObj = {
  install (Vue) {
    Vue.directive('fofo', {
      inserted (el) {
        // el是div,input需要用原生方法获取
        // 提高普适性,看el绑定在了哪里进行判断
        if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
          el.focus()
        } else {
          const theInput = el.querySelector('input')
          const theTextarea = el.querySelector('textarea')
          if (theInput) {
            theInput.focus()
          }
          if (theTextarea) {
            theTextarea.focus()
          }
        }
      }
    })
  }
}
