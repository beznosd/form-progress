'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

;(function () {
  var formProgress = function formProgress() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var form = settings.form,
        inputTypes = settings.inputTypes,
        formElements = settings.formElements,
        progress = settings.progress,
        proggressAttr = settings.proggressAttr,
        proggressStyleProperty = settings.proggressStyleProperty,
        initialValue = settings.initialValue,
        maxValue = settings.maxValue,
        units = settings.units,
        additionalElementsToTrack = settings.additionalElementsToTrack;

    /*
    *  initializing of all values
    */

    var formSelector = form || '#progress-form';
    var progressSelector = progress || '#progress-element';
    proggressAttr = proggressAttr || 'style';
    proggressStyleProperty = proggressStyleProperty || 'width';
    initialValue = +initialValue || 0;
    maxValue = +maxValue || 100;
    units = units || '%';

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
      inputTypes = ['text', 'email', 'password', 'number', 'color', 'date', 'datetime', 'month', 'time', 'week', 'tel', 'search', 'url', 'range'];
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

    // handle aditional elements and separate them to changeable and inputtable
    var changeableAdditinalElments = [];
    var inputtableAdditinalElments = [];
    if (additionalElementsToTrack) {
      additionalElementsToTrack.forEach(function (selector) {
        var elements = form.querySelectorAll(selector);
        if (elements[0].type === 'checkbox') {
          var _changeableAdditinalE;

          changeableAdditinalElments = (_changeableAdditinalE = changeableAdditinalElments).concat.apply(_changeableAdditinalE, _toConsumableArray(elements));
        } else {
          var _inputtableAdditinalE;

          inputtableAdditinalElments = (_inputtableAdditinalE = inputtableAdditinalElments).concat.apply(_inputtableAdditinalE, _toConsumableArray(elements));
        }
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
    if (additionalElementsToTrack) {
      additionalElementsToTrack.forEach(function (element) {
        formLength += form.querySelectorAll(element).length;
      });
    }

    var progressStep = (maxValue - initialValue) / formLength;
    var currentProgress = initialValue;

    progress[proggressAttr][proggressStyleProperty] = currentProgress + units;

    /*
    * handling the form events
    */

    // adding listener for text format inputs
    if (formElements.indexOf('input') > -1 || formElements.indexOf('textarea') > -1) {
      form.addEventListener('input', function (evt) {
        var input = null;
        if (evt.target.tagName === 'TEXTAREA' || inputTypes.indexOf(evt.target.type) > -1) {
          input = evt.target;
        }
        if (!input) return;

        // increase progress
        if (input.value.length !== 0 && !input.progressChecked) {
          increaseProgress();
          input.progressChecked = true;
        }

        // decrease progress
        if (input.value.length === 0 && input.progressChecked) {
          decreaseProgress();
          input.progressChecked = false;
        }
      }); // end text format inputs

      // adding support for checkbox and radio
      // preventing attaching event if we have not checkboxes and changeableAdditinalElments 
      if (formElements.indexOf('input') > -1 && (inputTypes.indexOf('checkbox') > -1 || changeableAdditinalElments.length)) {
        form.addEventListener('change', function (evt) {
          var input = null;
          // handle checkboxex
          if (inputTypes.indexOf('checkbox') > -1 && evt.target.type === 'checkbox') {
            input = evt.target;
          }
          // handle aditional elements checkboxes
          if (changeableAdditinalElments.indexOf(evt.target) > -1) {
            input = evt.target;
          }

          if (!input) return;

          // increase progress
          if (input.checked && !input.progressChecked) {
            increaseProgress();
            input.progressChecked = true;
          }

          // decrease progress
          if (!input.checked && input.progressChecked) {
            decreaseProgress();
            input.progressChecked = false;
          }
          // console.log(evt.target);
        });
      }
    } // end form elements check

    function increaseProgress() {
      currentProgress += progressStep;
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;
    }

    function decreaseProgress() {
      currentProgress -= progressStep;
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;
    }
  }; // end formProgress


  window.formProgress = formProgress;
})();

//# sourceMappingURL=form-progress.js.map