breadcrumb
==========

Github-like breadcrumb

### Markup

Required markup:

```html
<div id="breadcrumb">
    <strong id="section-container"></strong>
    <span id="subsections-container"></span>
    <input id="breadcrumb-input" type="text" placeholder="Name your file...">
</div>
```

### Options

All configuration values are optional. The default values are specified below.

```javascript
var options = {
  
    // {String} Section name. Defaults to "".
    section: "section",
    
    // {Array} List of subsections names. Defaults to [].
    subsections: ["sub1", "sub2"],
    
    // {String} File name. Defaults to "".
    fileName: "index.html",
    
    // {Object} Callbacks object.
    callbacks: {
      
        // {Function} Callback invoked on initialization.  
        // The this keyword refers to the breadcrumb instance.
        onInit: function() {},
        
        // {Function} Callback invoked on keyup event. 
        // The this keyword refers to the breadcrumb instance.
        // One parameter, e, is an object event passed to the function.
        onInputKeyup: function(e) {},
        
        // {Function} Callback invoked after a subsection is added. 
        // The this keyword refers to the breadcrumb instance.
        afterAddSubsection: function() {},
        
        // {Function} Callback invoked after a subsection is removed.
        // The this keyword refers to the breadcrumb instance.
        afterRemoveSubsection: function() {}        
    }
};
```
