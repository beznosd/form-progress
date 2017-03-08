# form-progress
A form completion progress plugin. Without any dependencies. Your progress and your design. Any limitations!<br/>
Just pass css selector of your form and progress element to a simple function and you are ready to go!

## Usage

1. Add file `form-progress.js` from `dist` folder to your page.
`<script src="form-progress.js"></script>`

2. Run the function `formProgress` and pass to it object with settings

```javascript
formProgress({
  // selector of form element to track
  // default value: '#progress-form'
  form: '.my-awesome-form',
  
  // progress element to show the progress
  // default value: '#progress-element'
  progress: '.my-awesome-progress',
  
  // array of types of form elements which you want to track
  // default value: ['input', 'textarea', 'select']
  formElements: ['input', 'textarea', 'select'],

  // array of input types which you want to track
  // default value: all input types (text, radio, checkbox, date, etc.)
  // see list of supported types below in docs
  inputTypes: ['text'], // by default all types except 'submit'
  
  // plugin will change the 'style' attribute of progress element (see setting 'progress' above)
  // default value: 'width'
  // you can pass here any style property (margins, paddings etc.)
  proggressStyleProperty: 'width', // by default 'width'

  // units which will be applied to the style of progress elements (%, px, em, etc)
  // default value: '%'
  unit: '%',

  minValue: 0, // by default 0, can be negative
  maxValue: 100, // by default 100, can be negative
  
  // array of selectors of elements which should be tracked anyway
  // even if they were omitted in the settings 'formElements' or 'inputTypes'
  additionalElementsToTrack: [], // by default an empty array,
  
  // will be fired every time when progress of form is being changed
  onChange: function(currentElement, progressPercents) {
    // feed some value container, which shows the completeness percentage
    document.getElementById('example').setAttribute('data-value', progressPercents);
  }
});
```

Initial value will be calculated depends on filled by default form fields.

### additionalElementsToTrack
May be useful if you don't want to track all exemplars of some elements or input types, but you need just some of them to track.

For example checkboxes usually are required in forms.</br>
But if you need to track one checkbox related to terms or license. You may pass to this setting a css selector of that checkbox. And omit other checkboxes by not passing 'checkbox' value to setting 'inputTypes'.

## List of supported form elements

* input
* select
* textarea

## List of supported input types

* text
* email
* password
* file
* radio
* checkbox
* number
* search
* tel
* url
* date
* datetime-local
* month
* week
* time
* color 
* range 

## Plan

Work on docs and examples in process. <br>

## License
[MIT](https://www.tldrlegal.com/l/mit) Copyright (c) 2016-2017 Dima Beznos
