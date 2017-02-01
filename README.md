# form-progress
A form completion progress plugin. Without any dependencies. Your progress and your design. Any limitations!<br/>
Just pass css selector of your form and progress element to a simple function and you are ready to go!

## The work is going

The plugin is very unstable now and not tested yet. I am working on it. <br/>

## Usage

Add `form-progress.js` from dist folder.
`<script src="form-progress.js"></script>`

Then use it

```
formProgress({
  // css selector of form element to track
  form: 'form', // "#progress-form" by default

  // array of types of inputs you want to track ['text', 'email', 'checkbox']
  inputTypes: ['text'], // by default all types except 'submit'

  // array of types of form elements you want to track ['input', 'textarea', 'select']
  formElements: ['input', 'textarea', 'select'],

  // progress element to show the progress
  progress: '.progress-element', // "#progress-element" by default

  // attribute of proggress element to change, 
  // for now only works 'style' setting, later will be added support for custom atributes
  proggressAttr: 'style', // by default 'style'

  // in case of selecting 'style' in progressAttr
  // 'width, margin, padding etc.'
  proggressStyleProperty: 'width', // by default 'width'

  // units which you want to change in style of your progress elements
  // `unit` make sense only if `prgressAttr` equals to `style` 
  unit: '%', // (%, px, em, etc units you are using to set width of progress in styles)

  // initialValue will be calculated depends on filled by default form fields
  // initialValue: 0, // by default 0, can be negative

  minValue: 0, // by default 0, can be negative
  maxValue: 100, // by default 100, can be negative

  // may be useful if you don't want to track checkboxes, 
  // because usualy they contain not required form data
  // but you need to track one checkbox related to terms or license
  // you can pass here a css selector of that checkbox
  // and omit other checkboxes by not passing 'checkbox' value to "inputTypes" setting above
  // should be an array of instances of form elements(input, textarea, select)
  additionalElementsToTrack: [], // by default an empty array,
  
  // will be fired every time when progress of form is changed
  onChange: function(currentElement, progressPercents) {
    document.getElementById('example').setAttribute('data-value', progressPercents);
  }
});
```

## List of supported input types and form elements

* text
* email
* password
* file
* radio
* select
* checkbox
* textarea
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
