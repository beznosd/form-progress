;(function() {
  const formProgress = (settings) => {
    let { 
      form,
      inputTypes,
      formElements,
      progress, 
      proggressAttr,
      proggressStyleProperty,
      initialValue,
      maxValue,
      unit,
    } = settings;

    /*
    *  initializing of all values
    */

    const formSelector = form || '#progress-form';
    const progressSelector = progress || '#progress-element';
    proggressAttr = proggressAttr || 'style';
    proggressStyleProperty = proggressStyleProperty || 'width';
    initialValue = +initialValue || 0;
    maxValue = +maxValue || 100;
    unit = unit || '%';

    form = document.querySelector(formSelector);
    progress = document.querySelector(progressSelector);

    if (!form) {
      console.error(`Can\'t get the form element by selector: ${formSelector}`);
      return;
    }

    if (!progress) {
      console.error(`Can\'t get the progress element by selector: ${progressSelector}`);
      return;
    }

    if (!inputTypes) {
      inputTypes = [
        'text', 'email', 'password', 'number', 'color', 
        'date', 'datetime', 'month', 'time', 'range', 
        'tel', 'search', 'url', 'week'
      ];
    } else {
      // make all input types lowercase
      inputTypes = inputTypes.map(item => item.toLowerCase());
    }

    if (!formElements) {
      formElements = ['input', 'textarea', 'select'];
    } else {
      // make all input types lowercase
      formElements = formElements.map(item => item.toLowerCase());
    }

    /*
    *  calculating the initial values 
    */

    // find the count of all elements and inputs which we need to track
    // console.log( form.querySelectorAll('textarea').length );
    let formLength = 0;
    formElements.forEach((formElement) => {
      if (formElement === 'input') {
        inputTypes.forEach((item) => {
          formLength += form.querySelectorAll(`input[type="${item}"]`).length;
        });
      } else {
        formLength += form.querySelectorAll(formElement).length;
      }
    });

    const progressStep = maxValue / formLength;
    let currentProgress = initialValue;

    /*
    * handling the form events
    */
    
    // adding listener for text format inputs
    if (formElements.indexOf('input') !== -1 || formElements.indexOf('textarea') !== -1) {
      form.addEventListener('input', (evt) => {
        const input = evt.target;

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
    return arr.map(item => item.toLowerCase());
  }

  window.formProgress = formProgress;
}());