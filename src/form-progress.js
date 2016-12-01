;(function(){

  function formProgress(settings) {

    const { form, progressEl, proggressAttr, unit } = settings;
    let { inputTypes } = settings;

    const progressStep = 100 / (form.length - 1);
    let currentProgress = 0;

    // make all input types lowercase
    inputTypes = inputTypes.map((type) => {
      return type.toString().toLowerCase();
    });

    form.addEventListener('input', (evt) => {
      let input = evt.target;

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

  }

  window.formProgress = formProgress;

}());