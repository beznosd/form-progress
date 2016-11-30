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

//# sourceMappingURL=form-progress.js.map