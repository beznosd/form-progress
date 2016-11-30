'use strict';

;(function () {

  function formProgress(settings) {
    var form = settings.form,
        progressEl = settings.progressEl,
        proggressAttr = settings.proggressAttr,
        unit = settings.unit;
    var inputTypes = settings.inputTypes;


    var progressStep = 100 / (form.length - 1);
    var currentProgress = 0;

    // make all input types lowercase
    inputTypes = inputTypes.map(function (type) {
      return type.toString().toLowerCase();
    });

    // improve with bubbling, one callback to the form
    [].forEach.call(form, function (input) {
      if (inputTypes.indexOf(input.tagName.toLowerCase()) != -1) {

        // increase progress
        input.addEventListener('input', function () {
          if (this.value.length !== 0 && !this.progressChecked) {
            currentProgress += progressStep;

            if (proggressAttr === 'style') {
              progressEl.style.width = currentProgress + unit;
            }

            this.progressChecked = true;
          }

          // decrease progress
          if (this.value.length === 0 && this.progressChecked) {
            currentProgress -= progressStep;

            if (proggressAttr === 'style') {
              progressEl.style.width = currentProgress + unit;
            }

            this.progressChecked = false;
          }
        });
      }
    });
  }

  window.formProgress = formProgress;
})();
'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },

    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function onLoad() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */
;
//# sourceMappingURL=form-progress.js.map