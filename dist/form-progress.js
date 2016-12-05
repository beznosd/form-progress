'use strict';

;(function () {
  var formProgress = function formProgress(settings) {
    var form = settings.form,
        inputTypes = settings.inputTypes,
        formElements = settings.formElements,
        progress = settings.progress,
        proggressAttr = settings.proggressAttr,
        proggressStyleProperty = settings.proggressStyleProperty,
        initialValue = settings.initialValue,
        maxValue = settings.maxValue,
        unit = settings.unit;

    /*
    *  initializing of all values
    */

    var formSelector = form || '#progress-form';
    var progressSelector = progress || '#progress-element';
    proggressAttr = proggressAttr || 'style';
    proggressStyleProperty = proggressStyleProperty || 'width';
    initialValue = +initialValue || 0;
    maxValue = +maxValue || 100;
    unit = unit || '%';

    form = document.querySelector(formSelector);
    progress = document.querySelector(progressSelector);

    if (!form) {
      console.error('Can\'t get the form element by selector: ' + formSelector);
      return;
    }

    if (!progress) {
      console.error('Can\'t get the progress element by selector: ' + progressSelector);
      return;
    }

    if (!inputTypes) {
      inputTypes = ['text', 'email', 'password', 'number', 'color', 'date', 'datetime', 'month', 'time', 'range', 'tel', 'search', 'url', 'week'];
    } else {
      // make all input types lowercase
      inputTypes = inputTypes.map(function (item) {
        return item.toLowerCase();
      });
    }

    if (!formElements) {
      formElements = ['input', 'textarea', 'select'];
    } else {
      // make all input types lowercase
      formElements = formElements.map(function (item) {
        return item.toLowerCase();
      });
    }

    /*
    *  calculating the initial values 
    */

    // find the count of all elements and inputs which we need to track
    // console.log( form.querySelectorAll('textarea').length );
    var formLength = 0;
    formElements.forEach(function (formElement) {
      if (formElement === 'input') {
        inputTypes.forEach(function (item) {
          formLength += form.querySelectorAll('input[type="' + item + '"]').length;
        });
      } else {
        formLength += form.querySelectorAll(formElement).length;
      }
    });

    var progressStep = maxValue / formLength;
    var currentProgress = initialValue;

    /*
    * handling the form events
    */

    // adding listener for text format inputs
    if (formElements.indexOf('input') !== -1 || formElements.indexOf('textarea') !== -1) {
      form.addEventListener('input', function (evt) {
        var input = evt.target;

        if (inputTypes.indexOf(input.type) !== -1 || formElements.indexOf('textarea') !== -1) {
          // increase progress
          if (input.value.length !== 0 && !input.progressChecked) {
            currentProgress += progressStep;

            progress[proggressAttr][proggressStyleProperty] = currentProgress + unit;

            input.progressChecked = true;
          }

          // decrease progress
          if (input.value.length === 0 && input.progressChecked) {
            currentProgress -= progressStep;

            progress[proggressAttr][proggressStyleProperty] = currentProgress + unit;

            input.progressChecked = false;
          }
        }
      }); // end form.addEventListener for input
    } // end form elements check
  }; // end formProgress

  function arrayToLowerCase(arr) {
    return arr.map(function (item) {
      return item.toLowerCase();
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