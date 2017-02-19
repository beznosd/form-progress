(function(global, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define('formProgress', factory);
  } else {
    global.formProgress = factory();
  }
}(typeof window !== 'undefined' ? window : this, () => {
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
      valueContainer,
    } = settings;

    const {
      additionalElementsToTrack,
      onChange
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
    valueContainer = document.querySelector(valueContainer);

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
      inputTypes = inputTypes.map(item => item.toLowerCase());
    }

    if (!formElements) {
      formElements = ['input', 'textarea', 'select'];
    } else {
      formElements = formElements.map(item => item.toLowerCase());
      // if user has provided formElements and not provided 'input' elements
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
    let formLength = 0;
    let existingElements = []; // all elements that should be tracked
    const radiosNames = []; // keep here only different radio names

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
    let aditionalElements = [];
    if (additionalElementsToTrack) {
      aditionalElements = [...changeableAdditinalElments, ...inputtableAdditinalElments];
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
      allElements = [...aditionalElements, ...existingElements];
    } else {
      allElements = [...existingElements];
    }

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

    // initializing value container
    const progressInPercents = getPercents(minValue, maxValue, currentProgress);
    updateValueContainer(valueContainer, progressInPercents);

    // fire callback
    if (progressInPercents > 0 && typeof onChange === 'function') {
      onChange(null, progressInPercents);
    }

    /*
    * handling the form events
    */
    
    // adding listener for text format inputs
    // check if we have inputable elements 
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
          increaseProgress(input);
          input.progressChecked = true;
        }

        // decrease progress
        if (input.value.length === 0 && input.progressChecked) {
          decreaseProgress(input);
          input.progressChecked = false;
        }
      }); // end inputable inputs event listener
    } // end check for inputable inputs existance

    // adding support for checkbox and radio
    // check if we have changeable elements
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

        // increase progress radios and checkboxes (selects and files below)
        if (input.checked && !input.progressChecked && !isFile && !isSelect) {
          increaseProgress(input);
          input.progressChecked = true;
        }

        // decrease progress
        if (!input.checked && input.progressChecked && !isFile && !isSelect) {
          decreaseProgress(input);
          input.progressChecked = false;
          if (evt.target.type === 'radio') {
            const index = checkedRadiosNames.indexOf(evt.target.name);
            if (index > 1) {
              checkedRadiosNames.splice(index, 1);
            }
          }
        }

        // handle selects and files
        if (isSelect || isFile) {
          if (input.value.length && !input.progressChecked) {
            increaseProgress(input);
            input.progressChecked = true;
          } 
          if (!input.value.length && input.progressChecked) {
            decreaseProgress(input);
            input.progressChecked = false;
          }
        }
      }); // end changeable inputs eventlistener
    } // end check for changeable inputs existance

    const increaseProgress = (input) => {
      currentProgress += progressStep;
      if (currentProgress > maxValue) {
        currentProgress = maxValue;
      }
      // change styles for progress elements
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;
      // change value in value container
      const progressInPercents = getPercents(minValue, maxValue, currentProgress);
      updateValueContainer(valueContainer, progressInPercents);
      // fire callback
      if (typeof onChange === 'function') {
        onChange(input, progressInPercents);
      }
    };

    const decreaseProgress = (input) => {
      currentProgress -= progressStep;
      if (currentProgress < initialValue) {
        currentProgress = initialValue;
      }
      // change styles for progress elements
      progress[proggressAttr][proggressStyleProperty] = currentProgress + units;
      // change value in value container
      const progressInPercents = getPercents(minValue, maxValue, currentProgress);
      updateValueContainer(valueContainer, progressInPercents);
      // fire callback
      if (typeof onChange === 'function') {
        onChange(input, progressInPercents);
      }
    };
  }; // end formProgress

  const updateValueContainer = (container, value) => {
    if (container) {
      container.innerHTML = value;
    }
  };

  const getPercents = (minValue, maxValue, currentValue) => {
    let interval;

    if (minValue < 0 && maxValue > 0) {
      interval = Math.abs(minValue) + maxValue;
    } else if (minValue >= 0 && maxValue > 0) {
      interval = maxValue - minValue;
    } else if (minValue < 0 && maxValue <= 0) {
      interval = Math.abs(minValue) - Math.abs(maxValue);
    }

    return Math.round((currentValue * 100) / interval);
  };

  return formProgress;
}));