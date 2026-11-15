/* 给分享栏追加「复制链接」按钮（自托管，不依赖第三方脚本）
   sharejs 只支持 wechat/weibo/qq/qzone 等平台，没有 copy_link，
   所以这里自己加一个。 */
(function () {
  var SVG = '<svg viewBox="0 0 1024 1024" width="18" height="18" aria-hidden="true">' +
    '<path d="M704 512a192 192 0 0 1-192 192H256a192 192 0 0 1 0-384h144a32 32 0 0 1 0 64H256a128 128 0 0 0 0 256h256a128 128 0 0 0 128-128v-16a32 32 0 0 1 64 0v16z" fill="currentColor"/>' +
    '<path d="M768 512a192 192 0 0 1 192-192h-144a32 32 0 0 1 0-64h144a192 192 0 0 1 0 384H768a128 128 0 0 1-128-128v-16a32 32 0 0 1 64 0v16a64 64 0 0 0 64 64z" fill="currentColor"/>' +
    '</svg>'

  function legacyCopy (text) {
    var ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', 'readonly')
    ta.style.position = 'fixed'
    ta.style.top = '0'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, text.length)
    var ok = false
    try { ok = document.execCommand('copy') } catch (e) { ok = false }
    document.body.removeChild(ta)
    return ok
  }

  // 优先用异步剪贴板 API，失败则退回 execCommand
  function copy (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
        .then(function () { return true })
        .catch(function () { return legacyCopy(text) })
    }
    return Promise.resolve(legacyCopy(text))
  }

  function toast (el, msg) {
    var tip = el.querySelector('.copy-link-tip')
    tip.textContent = msg
    tip.classList.add('show')
    setTimeout(function () { tip.classList.remove('show') }, 1600)
  }

  function build () {
    var box = document.querySelector('.post-share .social-share')
    if (!box || box.querySelector('.copy-link-btn')) return

    var btn = document.createElement('a')
    btn.className = 'copy-link-btn'
    btn.href = 'javascript:void(0)'
    btn.title = '复制链接'
    btn.innerHTML = SVG + '<span class="copy-link-tip">链接已复制</span>'

    btn.addEventListener('click', function (e) {
      e.preventDefault()
      var url = location.origin + location.pathname
      copy(url).then(function (ok) {
        if (ok) {
          toast(btn, '链接已复制')
        } else {
          // 浏览器禁用剪贴板时（无焦点/无权限），弹窗让用户自己复制
          toast(btn, '请手动复制')
          window.prompt('复制链接：Ctrl+C 或长按选中后复制', url)
        }
      })
    })

    box.appendChild(btn)
  }

  function start () {
    build()
    try {
      if (window.btf && typeof window.btf.addGlobalFn === 'function') {
        window.btf.addGlobalFn('pjaxComplete', build, 'copyLink')
      }
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 300) })
  } else {
    setTimeout(start, 300)
  }
})()
