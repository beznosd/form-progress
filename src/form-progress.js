;(function() {
  const formProgress = (settings = {}) => {
    let { 
      form,
      inputTypes,
      formElements,
      progress, 
      proggressAttr,
      proggressStyleProperty,
      initialValue,
      maxValue,
      units,
      additionalElementsToTrack
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
    units = units || '%';

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
        'date', 'datetime', 'month', 'time', 'week', 
        'tel', 'search', 'url', 'range'
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
  
    // handle aditional elements and separate them to changeable and inputtable
    let changeableAdditinalElments = [];
    let inputtableAdditinalElments = [];
    if (additionalElementsToTrack) {
      additionalElementsToTrack.forEach((selector) => {
        const elements = form.querySelectorAll(selector);
        // console.log(elements);
        elements.forEach((element) => {
          // console.log(element);
          if (element.type === 'checkbox') {
            changeableAdditinalElments = changeableAdditinalElments.concat(...elements);
          } else {
            inputtableAdditinalElments = inputtableAdditinalElments.concat(...elements);
          }
        });
      });
    }

    // console.log(changeableAdditinalElments);
    // console.log(inputtableAdditinalElments);
    // console.log(formElements);
    // console.log(inputTypes);

    /*
    *  calculating the initial values 
    */

    // find the count of all elements and inputs which we need to track
    // console.log( form.querySelectorAll('textarea').length );
    let formLength = 0;
    let existingElements = [];
    formElements.forEach((formElementType) => {
      if (formElementType === 'input') {
        inputTypes.forEach((item) => {
          const elements = form.querySelectorAll(`input[type="${item}"]`);
          existingElements = existingElements.concat(...elements);
          formLength += elements.length;
        });
      } else {
        const elements = form.querySelectorAll(formElementType);
        existingElements = existingElements.concat(...elements);
        formLength += elements.length;
      }
    });

    // if aditional elements matches default input types, do not increase formLength
    if (additionalElementsToTrack) {
      const aditionalElements = [...changeableAdditinalElments, ...inputtableAdditinalElments];
      let aditionalElementsCount = aditionalElements.length;

      aditionalElements.forEach((aditionalElement) => {
        if (existingElements.indexOf(aditionalElement) > -1) {
          aditionalElementsCount--;
        }
      });

      formLength += aditionalElementsCount;
    }

    const progressStep = (maxValue - initialValue) / formLength;
    let currentProgress = initialValue;

    // initializing progress with initial value, by default 0
    progress[proggressAttr][proggressStyleProperty] = currentProgress + units;

    /*
    * handling the form events
    */
    
    // adding listener for text format inputs
    if (formElements.indexOf('input') > -1 
        || formElements.indexOf('textarea') > -1
        || inputtableAdditinalElments.length) {
      form.addEventListener('input', (evt) => {
        let input = null;
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
          // console.log(input.value.length);
          // console.log(input.progressChecked);
          decreaseProgress();
          input.progressChecked = false;
        }
      }); // end text format inputs

      // adding support for checkbox and radio
      // preventing of attaching event if we have not checkboxes and changeableAdditinalElments 
      if (formElements.indexOf('input') > -1 
          && (inputTypes.indexOf('checkbox') > -1 || changeableAdditinalElments.length)) {
        form.addEventListener('change', (evt) => {
          let input = null;
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
        });
      }
    } // end form elements check

    function increaseProgress() {
      currentProgress += progressStep;
      if (currentProgress > maxValue) {
        currentProgress = maxValue;
      }
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;              
    }

    function decreaseProgress() {
      currentProgress -= progressStep;
      if (currentProgress < initialValue) {
        currentProgress = initialValue;
      }
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;              
    }
  }; // end formProgress


  window.formProgress = formProgress;
}());