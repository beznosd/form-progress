'use strict';

;(function () {
  var formProgress = function formProgress(settings) {
    var form = settings.form,
        progressEl = settings.progressEl,
        proggressAttr = settings.proggressAttr,
        proggressStyleProperty = settings.proggressStyleProperty,
        initialValue = settings.initialValue,
        maxValue = settings.maxValue,
        minValie = settings.minValie,
        unit = settings.unit,
        valueContainer = settings.valueContainer;


    form = form || '#progress-form';
    progressEl = progressEl || '#progress-element';
    proggressAttr = proggressAttr || 'style';
    proggressStyleProperty = proggressStyleProperty || 'width';
    initialValue = initialValue || 0;
    maxValue = maxValue || 100;
    minValie = minValie || 0;
    unit = unit || '%';
    valueContainer = valueContainer || null;

    var inputTypes = settings.inputTypes;


    var progressStep = 100 / (form.length - 1);
    var currentProgress = 0;

    // make all input types lowercase
    inputTypes = inputTypes.map(function (type) {
      return type.toString().toLowerCase();
    });

    form.addEventListener('input', function (evt) {
      var input = evt.target;

      // increase progress
      if (input.value.length !== 0 && !input.progressChecked) {
        currentProgress += progressStep;

        if (proggressAttr === 'style') {
          progressEl.style.width = currentProgress + unit;
        }

        input.progressChecked = true;
      }

      // decrease progress
      if (input.value.length === 0 && input.progressChecked) {
        currentProgress -= progressStep;

        if (proggressAttr === 'style') {
          progressEl.style.width = currentProgress + unit;
        }

        input.progressChecked = false;
      }
    });
  };

  window.formProgress = formProgress;
})();

//# sourceMappingURL=form-progress.js.map