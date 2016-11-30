;(function(){

  function formProgress(settings) {

    const { form, progressEl, proggressAttr, unit } = settings;
    let { inputTypes } = settings;

    const progressStep = 100 / (form.length - 1);
    let currentProgress = 0;

    // make all input types lowercase
    inputTypes = inputTypes.map(function(type){
      return type.toString().toLowerCase();
    });

    // improve with bubbling, one callback to the form
    [].forEach.call(form, (input) => {
      if (inputTypes.indexOf(input.tagName.toLowerCase()) != -1) {

        // increase progress
        input.addEventListener('input', function() {
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

}());