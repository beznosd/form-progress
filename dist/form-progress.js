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
        minValue = settings.minValue,
        maxValue = settings.maxValue,
        units = settings.units,
        additionalElementsToTrack = settings.additionalElementsToTrack,
        valueContainer = settings.valueContainer;

    /*
    *  initializing of all values
    */

    var formSelector = form || '#progress-form';
    var progressSelector = progress || '#progress-element';
    proggressAttr = proggressAttr || 'style';
    proggressStyleProperty = proggressStyleProperty || 'width';
    initialValue = +initialValue || 0;
    minValue = +minValue || 0;
    maxValue = +maxValue || 100;
    units = units || '%';

    form = document.querySelector(formSelector);
    progress = document.querySelector(progressSelector);
    valueContainer = document.querySelector(valueContainer);

    if (minValue >= maxValue) {
      console.error('minValue should be lower than maxValue');
      return;
    }

    if (!form) {
      console.error('Can\'t get the form element by selector: ' + formSelector);
      return;
    }

    if (!progress) {
      console.error('Can\'t get the progress element by selector: ' + progressSelector);
      return;
    }

    if (!inputTypes) {
      inputTypes = ['text', 'email', 'password', 'number', 'color', 'date', 'datetime', 'month', 'time', 'week', 'tel', 'search', 'url', 'range', 'file', 'checkbox', 'radio'];
    } else {
      inputTypes = inputTypes.map(function (item) {
        return item.toLowerCase();
      });
    }

    if (!formElements) {
      formElements = ['input', 'textarea', 'select'];
    } else {
      formElements = formElements.map(function (item) {
        return item.toLowerCase();
      });
      // if user has provided formElements and not provided 'input' elements
      // then we remove all input types, because user don't want to track default inputs
      // but plugin will still track inputs that was provided in setting 'additionalElementsToTrack'
      if (formElements.indexOf('input') < 0) {
        inputTypes = [];
      }
    }

    // handle aditional elements and separate them to changeable and inputtable
    var changeableAdditinalElments = [];
    var inputtableAdditinalElments = [];
    if (additionalElementsToTrack) {
      additionalElementsToTrack.forEach(function (selector) {
        var elements = form.querySelectorAll(selector);
        elements.forEach(function (element) {
          if (element.type === 'checkbox' || element.type === 'radio') {
            var _changeableAdditinalE;

            changeableAdditinalElments = (_changeableAdditinalE = changeableAdditinalElments).concat.apply(_changeableAdditinalE, _toConsumableArray(elements));
          } else {
            var _inputtableAdditinalE;

            inputtableAdditinalElments = (_inputtableAdditinalE = inputtableAdditinalElments).concat.apply(_inputtableAdditinalE, _toConsumableArray(elements));
          }
        });
      });
    }

    /*
    *  calculating the progress step
    */

    // find the count of all elements and inputs which we need to track
    var formLength = 0;
    var existingElements = [];

    var radiosNames = [];
    formElements.forEach(function (formElementType) {
      if (formElementType === 'input') {
        inputTypes.forEach(function (inputType) {
          var _existingElements;

          var elements = form.querySelectorAll('input[type="' + inputType + '"]');
          existingElements = (_existingElements = existingElements).concat.apply(_existingElements, _toConsumableArray(elements));
          // consider radios only with differnet name attributes
          if (inputType === 'radio') {
            elements.forEach(function (radioElement) {
              if (radiosNames.indexOf(radioElement.name) === -1) {
                formLength++;
                radiosNames.push(radioElement.name);
              }
            });
          } else {
            formLength += elements.length;
          }
        });
      } else {
        var _existingElements2;

        var elements = form.querySelectorAll(formElementType);
        existingElements = (_existingElements2 = existingElements).concat.apply(_existingElements2, _toConsumableArray(elements));
        formLength += elements.length;
      }
    });

    // if aditional elements matches default input types, do not increase formLength
    if (additionalElementsToTrack) {
      (function () {
        var aditionalElements = [].concat(_toConsumableArray(changeableAdditinalElments), _toConsumableArray(inputtableAdditinalElments));
        var aditionalElementsCount = aditionalElements.length;

        aditionalElements.forEach(function (aditionalElement) {
          if (existingElements.indexOf(aditionalElement) > -1) {
            aditionalElementsCount--;
          }
        });

        formLength += aditionalElementsCount;
      })();
    }

    // calculate progress step for different cases
    var progressStep = 0;
    if (minValue < 0 && maxValue > 0) {
      progressStep = (maxValue + Math.abs(minValue)) / formLength;
    } else if (minValue >= 0 && maxValue > 0) {
      progressStep = (maxValue - minValue) / formLength;
    } else if (minValue < 0 && maxValue <= 0) {
      progressStep = (Math.abs(maxValue) - Math.abs(minValue)) / formLength;
    }

    // calculate initial value, depends on already filled form elements
    var allElements = [];
    if (additionalElementsToTrack) {
      allElements = [].concat(_toConsumableArray(changeableAdditinalElments), _toConsumableArray(inputtableAdditinalElments));
    }
    allElements = [].concat(_toConsumableArray(allElements), _toConsumableArray(existingElements));

    var trackedElements = [];
    var checkedRadiosNames = [];
    var filledElementsCount = 0;
    for (var i = 0; i < allElements.length; i++) {
      var element = allElements[i];

      if (trackedElements.indexOf(element) > -1) continue;
      trackedElements.push(element);

      if (element.type === 'checkbox' || element.type === 'radio') {
        if (element.checked) {
          filledElementsCount++;
          element.progressChecked = true;
          if (element.type === 'radio') {
            checkedRadiosNames.push(element.name);
          }
        }
      } else if (element.value.length !== 0) {
        filledElementsCount++;
        element.progressChecked = true;
      }
    }

    // set up current progress
    var currentProgress = filledElementsCount > 0 ? filledElementsCount * progressStep : minValue;

    // initializing progress with initial value, by default 0
    progress[proggressAttr][proggressStyleProperty] = currentProgress + units;

    // initializing value container
    var progressInPercents = getPercents(minValue, maxValue, currentProgress);
    updateValueContainer(valueContainer, progressInPercents);

    console.log(formLength);

    /*
    * handling the form events
    */

    // adding listener for text format inputs
    if (formElements.indexOf('input') > -1 || formElements.indexOf('textarea') > -1 || inputtableAdditinalElments.length) {
      form.addEventListener('input', function (evt) {
        var input = null;
        if (inputTypes.indexOf(evt.target.type) > -1) {
          input = evt.target;
        }
        if (formElements.indexOf('textarea') > -1 && evt.target.tagName === 'TEXTAREA') {
          input = evt.target;
        }
        // handle aditional elements checkboxes
        if (inputtableAdditinalElments.indexOf(evt.target) > -1) {
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
      }); // end inputable inputs
    }

    // adding support for checkbox and radio
    // preventing of attaching event if we have not changeable elements 
    if (formElements.indexOf('input') > -1 || formElements.indexOf('select') > -1 || changeableAdditinalElments.length) {
      form.addEventListener('change', function (evt) {
        var input = null;

        if (inputTypes.indexOf('checkbox') > -1 && evt.target.type === 'checkbox') {
          input = evt.target;
        }

        if (inputTypes.indexOf('radio') > -1 && evt.target.type === 'radio') {
          if (checkedRadiosNames.indexOf(evt.target.name) === -1) {
            input = evt.target;
            checkedRadiosNames.push(evt.target.name);
          }
        }

        var isFile = false;
        if (inputTypes.indexOf('file') > -1 && evt.target.type === 'file') {
          input = evt.target;
          isFile = true;
        }

        var isSelect = false;
        if (formElements.indexOf('select') > -1 && evt.target.tagName === 'SELECT') {
          input = evt.target;
          isSelect = true;
        }

        // handle aditional elements checkboxes and radios
        if (changeableAdditinalElments.indexOf(evt.target) > -1) {
          if (evt.target.type === 'radio') {
            if (checkedRadiosNames.indexOf(evt.target.name) === -1) {
              checkedRadiosNames.push(evt.target.name);
              input = evt.target;
            }
          } else {
            input = evt.target;
          }
        }

        if (!input) return;

        // increase progress
        if (input.checked && !input.progressChecked && !isFile && !isSelect) {
          increaseProgress();
          input.progressChecked = true;
        }

        // decrease progress
        if (!input.checked && input.progressChecked && !isFile && !isSelect) {
          decreaseProgress();
          input.progressChecked = false;
          if (evt.target.type === 'radio') {
            var index = checkedRadiosNames.indexOf(evt.target.name);
            if (index > 1) {
              checkedRadiosNames.splice(index, 1);
            }
          }
        }

        // handle selects
        if (isSelect || isFile) {
          if (input.value.length && !input.progressChecked) {
            increaseProgress();
            input.progressChecked = true;
          }
          if (!input.value.length && input.progressChecked) {
            decreaseProgress();
            input.progressChecked = false;
          }
        }
      }); // end changeable inputs
    }

    function increaseProgress() {
      currentProgress += progressStep;
      if (currentProgress > maxValue) {
        currentProgress = maxValue;
      }
      // change styles for progress elements
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;
      // change value in value container
      var progressInPercents = getPercents(minValue, maxValue, currentProgress);
      updateValueContainer(valueContainer, progressInPercents);
    }

    function decreaseProgress() {
      currentProgress -= progressStep;
      if (currentProgress < initialValue) {
        currentProgress = initialValue;
      }
      // change styles for progress elements
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;
      // change value in value container
      var progressInPercents = getPercents(minValue, maxValue, currentProgress);
      updateValueContainer(valueContainer, progressInPercents);
    }
  }; // end formProgress

  var updateValueContainer = function updateValueContainer(container, value) {
    if (container) {
      container.innerHTML = value;
    }
  };

  var getPercents = function getPercents(minValue, maxValue, currentValue) {
    var interval = void 0;

    if (minValue < 0 && maxValue > 0) {
      interval = Math.abs(minValue) + maxValue;
    } else if (minValue >= 0 && maxValue > 0) {
      interval = maxValue - minValue;
    } else if (minValue < 0 && maxValue <= 0) {
      interval = Math.abs(minValue) - Math.abs(maxValue);
    }

    return Math.round(currentValue * 100 / interval);
  };

  window.formProgress = formProgress;
})();

//# sourceMappingURL=form-progress.js.map