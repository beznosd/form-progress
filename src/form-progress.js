;(function() {
  const formProgress = (settings) => {
    let { 
      form,
      progressEl, 
      proggressAttr,
      proggressStyleProperty,
      initialValue,
      maxValue,
      minValie,
      unit,
      valueContainer
    } = settings;

    form = form || '#progress-form';
    progressEl = progressEl || '#progress-element';
    proggressAttr = proggressAttr || 'style';
    proggressStyleProperty = proggressStyleProperty || 'width';
    initialValue = initialValue || 0;
    maxValue = maxValue || 100;
    minValie = minValie || 0;
    unit = unit || '%';
    valueContainer = valueContainer || null;

    let { inputTypes } = settings;

    const progressStep = 100 / (form.length - 1);
    let currentProgress = 0;

    // make all input types lowercase
    inputTypes = inputTypes.map((type) => {
      return type.toString().toLowerCase();
    });

    form.addEventListener('input', (evt) => {
      const input = evt.target;

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
}());