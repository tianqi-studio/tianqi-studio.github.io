/* 页脚「本站已运行 X 天 X 时 X 分 X 秒」计数器
   起始时间改下面这一个常量即可；格式为 本地时区 +08:00 */
(function () {
  var START = '2026-11-14T16:00:00+08:00'

  function pad (n) {
    return n < 10 ? '0' + n : '' + n
  }

  function render () {
    if (!document.getElementById('runtime-days')) return
    var diff = Date.now() - new Date(START).getTime()
    if (!(diff > 0)) diff = 0

    var d = Math.floor(diff / 86400000)
    var h = Math.floor(diff % 86400000 / 3600000)
    var m = Math.floor(diff % 3600000 / 60000)
    var s = Math.floor(diff % 60000 / 1000)

    var elD = document.getElementById('runtime-days')
    var elH = document.getElementById('runtime-hours')
    var elM = document.getElementById('runtime-mins')
    var elS = document.getElementById('runtime-secs')
    if (elD) elD.textContent = d
    if (elH) elH.textContent = pad(h)
    if (elM) elM.textContent = pad(m)
    if (elS) elS.textContent = pad(s)
  }

  var timer = null
  function start () {
    render()
    if (timer) clearInterval(timer)
    timer = setInterval(render, 1000)
    try {
      if (window.btf && typeof window.btf.addGlobalFn === 'function') {
        window.btf.addGlobalFn('pjaxComplete', render, 'runtime')
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
