(function () {
  'use strict';
  if (window.__PRIYO_CHAT_WIDGET__) return;
  window.__PRIYO_CHAT_WIDGET__ = true;
  var script = document.currentScript;
  if (!script) return;
  var widgetOrigin = new URL(script.src).origin;
  var config = {
    apiBase: script.dataset.apiBase || '', siteId: script.dataset.siteId || location.hostname,
    position: script.dataset.position === 'bottom-left' ? 'bottom-left' : 'bottom-right',
    primaryColor: script.dataset.primaryColor || '#dc2626', title: script.dataset.title || 'Customer Support',
    greeting: script.dataset.greeting || '', locale: script.dataset.locale || 'auto'
  };
  var query = new URLSearchParams({ parentOrigin: location.origin, siteId: config.siteId, primaryColor: config.primaryColor, title: config.title, locale: config.locale });
  if (config.apiBase) query.set('apiBase', config.apiBase); if (config.greeting) query.set('greeting', config.greeting);
  var frame = document.createElement('iframe'); frame.src = widgetOrigin + '/embed?' + query.toString(); frame.title = config.title;
  frame.setAttribute('aria-label', config.title); frame.setAttribute('allow', 'clipboard-write');
  Object.assign(frame.style, { position: 'fixed', bottom: '0', border: '0', background: 'transparent', width: '88px', height: '88px', zIndex: '2147483000', colorScheme: 'normal' });
  frame.style[config.position === 'bottom-left' ? 'left' : 'right'] = '0';
  if (document.body) document.body.appendChild(frame); else document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(frame); }, { once: true });
  function resize(open) { var mobile = window.innerWidth <= 640; frame.style.width = open ? (mobile ? '100vw' : '440px') : '88px'; frame.style.height = open ? (mobile ? '100dvh' : '680px') : '88px'; }
  window.addEventListener('message', function (event) {
    if (event.origin !== widgetOrigin || event.source !== frame.contentWindow || !event.data || event.data.source !== 'priyo-chat-widget') return;
    if (event.data.type === 'open') resize(true); if (event.data.type === 'close') resize(false);
    window.dispatchEvent(new CustomEvent('priyo-chat:' + event.data.type, { detail: event.data }));
  });
  window.addEventListener('resize', function () { if (frame.style.width !== '88px') resize(true); });
  window.PriyoChat = { open: function () { frame.contentWindow && frame.contentWindow.postMessage({ source: 'priyo-chat-host', type: 'open' }, widgetOrigin); }, destroy: function () { frame.remove(); delete window.__PRIYO_CHAT_WIDGET__; } };
})();
