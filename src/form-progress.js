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
      minValue,
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
    minValue = +minValue || 0;
    maxValue = +maxValue || 100;
    units = units || '%';

    form = document.querySelector(formSelector);
    progress = document.querySelector(progressSelector);

    if (minValue >= maxValue) {
      console.error('minValue should be lower than maxValue');
      return;
    }

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
        'tel', 'search', 'url', 'range', 'file',
        'checkbox', 'radio'
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
      // if user has provided formElements and not provided 'input' element
      // then we remove all input types, because user don't want to track default inputs
      // but plugin will still track inputs that was provided in setting 'additionalElementsToTrack'
      if (formElements.indexOf('input') < 0) {
        inputTypes = [];
      }
    }
  
    // handle aditional elements and separate them to changeable and inputtable
    let changeableAdditinalElments = [];
    let inputtableAdditinalElments = [];
    if (additionalElementsToTrack) {
      additionalElementsToTrack.forEach((selector) => {
        const elements = form.querySelectorAll(selector);
        elements.forEach((element) => {
          if (element.type === 'checkbox' || element.type === 'radio') {
            changeableAdditinalElments = changeableAdditinalElments.concat(...elements);
          } else {
            inputtableAdditinalElments = inputtableAdditinalElments.concat(...elements);
          }
        });
      });
    }

    /*
    *  calculating the progress step
    */

    // find the count of all elements and inputs which we need to track
    // console.log( form.querySelectorAll('textarea').length );
    let formLength = 0;
    let existingElements = [];

    const radiosNames = [];
    formElements.forEach((formElementType) => {
      if (formElementType === 'input') {
        inputTypes.forEach((inputType) => {
          const elements = form.querySelectorAll(`input[type="${inputType}"]`);
          existingElements = existingElements.concat(...elements);
          // consider radios only with differnet name attributes
          if (inputType === 'radio') {
            elements.forEach((radioElement) => {
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
    
    // calculate progress step for different cases
    let progressStep = 0;
    if (minValue < 0 && maxValue > 0) {
      progressStep = (maxValue + Math.abs(minValue)) / formLength;
    } else if (minValue >= 0 && maxValue > 0) {
      progressStep = (maxValue - minValue) / formLength;
    } else if (minValue < 0 && maxValue <= 0) {
      progressStep = (Math.abs(maxValue) - Math.abs(minValue)) / formLength;
    }

    // calculate initial value, depends on already filled form elements
    let allElements = [];
    if (additionalElementsToTrack) {
      allElements = [...changeableAdditinalElments, ...inputtableAdditinalElments];
    }
    allElements = [...allElements, ...existingElements];

    const trackedElements = [];
    const checkedRadiosNames = [];
    let filledElementsCount = 0;
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];

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
    let currentProgress = (filledElementsCount > 0) ? filledElementsCount * progressStep : minValue;

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
      // preventing of attaching event if we have not changeable elements 
      if (formElements.indexOf('input') > -1 
          || formElements.indexOf('select') > -1 
          || changeableAdditinalElments.length) {
        form.addEventListener('change', (evt) => {
          let input = null;

          if (inputTypes.indexOf('checkbox') > -1 && evt.target.type === 'checkbox') {
            input = evt.target;
          }

          if (inputTypes.indexOf('radio') > -1 && evt.target.type === 'radio') {
            if (checkedRadiosNames.indexOf(evt.target.name) === -1) {
              input = evt.target;
              checkedRadiosNames.push(evt.target.name);
            }
          }
          
          let isFile = false;
          if (inputTypes.indexOf('file') > -1 && evt.target.type === 'file') {
            input = evt.target;
            isFile = true;
          }
          
          let isSelect = false;
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
              const index = checkedRadiosNames.indexOf(evt.target.name);
              if (index > 1) {
                checkedRadiosNames.splice(index, 1);
              }
            }
          }

          // handle selects
          if (isSelect || isFile) {
            console.dir(input);
            if (input.value.length && !input.progressChecked) {
              increaseProgress();
              input.progressChecked = true;
            } 
            if (!input.value.length && input.progressChecked) {
              decreaseProgress();
              input.progressChecked = false;
            }
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